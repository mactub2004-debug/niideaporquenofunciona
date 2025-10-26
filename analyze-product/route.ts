import { NextResponse } from 'next/server';
// Se elimina la importación estática de MistralClient aquí
import type { Product, User } from '@/lib/types';
import { ALL_PRODUCTS } from '@/lib/data';

interface AnalysisResult {
  score: number;
  rating: string;
  summary: string;
}

const apiKey = process.env.MISTRAL_API_KEY;

if (!apiKey) {
  console.error("Mistral API key is not set in environment variables.");
}

// Se elimina la instanciación global del cliente aquí

const buildPrompt = (product: Product, user: User): string => {
  const userAllergies = user.allergies.join(', ') || 'none';
  const userDiets = user.diet.join(', ') || 'none';
  const userGoals = user.healthGoals.join(', ') || 'none';

  return `
    You are an expert nutritionist AI. Your task is to analyze a food product based on a user's profile and provide a clear, concise, and helpful analysis. You will output a JSON object with the fields "score", "rating", and "summary".

    **User Profile:**
    - **Allergies:** ${userAllergies}
    - **Dietary Preferences:** ${userDiets}
    - **Health Goals:** ${userGoals}

    **Product Information:**
    - **Name:** ${product.name}
    - **Brand:** ${product.brand}
    - **Ingredients:** ${product.ingredients}
    - **Tags:** ${product.tags.join(', ')}
    - **Nutritional Metrics (per 100g):**
      ${product.nutritionalInformation.metrics.map(m => `- ${m.name}: ${m.per100g}`).join('\n          ')}

    **Your Task:**
    1.  **Calculate a Score (0-100):** Based on all the information, determine a suitability score for this user.
        -   **Penalize heavily for allergens.** If the product contains any of the user's allergens, the score must be very low (under 20).
        -   **Penalize for conflicts** with health goals (e.g., high sugar for a 'reduce_sugar' goal).
        -   **Reward for alignment** with health goals (e.g., high protein for a 'build_muscle' goal).
        -   **Consider overall healthiness** based on ingredients and nutritional info (e.g., processed, high sodium/sugar vs. organic, high fiber).
    2.  **Determine a Rating:** Based on the score, provide a simple rating: "Excellent", "Good", "Fair", "Poor", or "Very Poor".
    3.  **Write a Summary:** In 1-2 sentences, explain the score and rating. Be direct. If there's an allergen, state it clearly as the primary reason for a low score. Mention key alignments or conflicts with the user's goals.
  `;
};

function parseAnalysisResult(text: string): AnalysisResult | null {
    try {
        const json = JSON.parse(text);
        if (typeof json.score !== 'number' || typeof json.rating !== 'string' || typeof json.summary !== 'string') {
            console.error("Invalid JSON structure from AI:", json);
            return null;
        }
        return json;
    } catch (e) {
        console.error("Failed to parse AI response:", text, e);
        return null;
    }
}

export async function POST(req: Request) {
  if (!apiKey) {
    return NextResponse.json({ error: 'AI service is not configured.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { productId, user } = body;

    if (!productId || !user) {
      return NextResponse.json({ error: 'Product ID and user data are required' }, { status: 400 });
    }

    const product = ALL_PRODUCTS.find(p => p.id === productId);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // --- Inicio de la modificación ---
    // Importación dinámica y creación del cliente dentro de la función POST
    const { default: MistralClient } = await import('@mistralai/mistralai');
    const client = new MistralClient(apiKey);
    // --- Fin de la modificación ---

    const prompt = buildPrompt(product, user as User);

    const chatResponse = await client.chat({
      model: 'mistral-large-latest',
      messages: [{ role: 'user', content: prompt }],
      responseFormat: { type: 'json_object' }
    });

    const analysisText = chatResponse.choices[0].message.content;

    if (!analysisText) {
        throw new Error("Received empty response from AI.");
    }

    const analysis = parseAnalysisResult(analysisText);

    if (!analysis) {
        return NextResponse.json({
            error: "AI analysis could not be completed. The model returned an invalid format."
        }, { status: 500 });
    }

    return NextResponse.json(analysis);

  } catch (error: any) {
    console.error("Error in /api/analyze-product:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}