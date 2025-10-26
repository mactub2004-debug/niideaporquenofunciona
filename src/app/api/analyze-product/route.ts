import { NextResponse } from 'next/server';
import { mistral } from '@ai-sdk/mistral'; // Importar desde la librería correcta
import { streamText, type CoreMessage } from 'ai'; // Importar utilidades del Vercel AI SDK
import type { Product, User } from '@/lib/types'; //
import { ALL_PRODUCTS } from '@/lib/data'; //

// Opcional: Configurar para Vercel Edge Runtime (recomendado para rendimiento)
export const runtime = 'edge';

interface AnalysisResult {
  score: number;
  rating: string;
  summary: string;
}

// La API Key (MISTRAL_API_KEY) debe estar configurada en las variables de entorno de Vercel.
// El SDK la tomará automáticamente.

// Función para construir el prompt del sistema
const buildSystemPrompt = (): string => {
 return `You are an expert nutritionist AI. Your task is to analyze a food product based on a user's profile and provide a clear, concise, and helpful analysis. You will output a VALID JSON object containing ONLY the following fields: "score" (number 0-100), "rating" (string: "Excellent", "Good", "Fair", "Poor", or "Very Poor"), and "summary" (string, 1-2 sentences explaining score/rating, noting allergens or key goal conflicts/alignments).`;
};

// Función para construir el prompt del usuario
const buildUserPrompt = (product: Product, user: User): string => {
  const userAllergies = user.allergies.join(', ') || 'none'; //
  const userDiets = user.diet.join(', ') || 'none'; //
  const userGoals = user.healthGoals.join(', ') || 'none'; //

  return `
    Analyze the following product based on the provided user profile.

    **User Profile:**
    - Allergies: ${userAllergies}
    - Dietary Preferences: ${userDiets}
    - Health Goals: ${userGoals}

    **Product Information:**
    - Name: ${product.name}
    - Brand: ${product.brand}
    - Ingredients: ${product.ingredients}
    - Tags: ${product.tags.join(', ')}
    - Nutritional Metrics (per 100g):
      ${product.nutritionalInformation.metrics.map(m => `- ${m.name}: ${m.per100g}`).join('\n      ')}

    **Instructions:**
    1. Calculate Score (0-100): Penalize allergens heavily (score < 20). Penalize goal conflicts. Reward goal alignments. Consider overall healthiness.
    2. Determine Rating: "Excellent", "Good", "Fair", "Poor", or "Very Poor" based on score.
    3. Write Summary: 1-2 sentences. State allergens clearly if present. Mention key goal impacts.
    Output ONLY the JSON object. No extra text or markdown formatting.
  `;
};

// Función para parsear la respuesta JSON de forma segura
function parseAnalysisResult(text: string): AnalysisResult | null {
    try {
        // Limpiar posible markdown alrededor del JSON si aún aparece
        const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();
        const json = JSON.parse(jsonString);
        // Validar estructura básica
        if (typeof json.score !== 'number' || typeof json.rating !== 'string' || typeof json.summary !== 'string') {
            console.error("Invalid JSON structure from AI:", json);
            return null;
        }
        // Validar y redondear score
        json.score = Math.max(0, Math.min(100, Math.round(json.score)));
        return json as AnalysisResult; // Asegurar el tipo
    } catch (e) {
        console.error("Failed to parse AI response:", text, e);
        return null;
    }
}


// --- Handler POST ---
export async function POST(req: Request) {
  try {
    const body = await req.json(); //
    const { productId, user } = body; //

    // Validación de entrada
    if (!productId || !user) {
      return NextResponse.json({ error: 'Product ID and user data are required' }, { status: 400 }); //
    }
    const product = ALL_PRODUCTS.find(p => p.id === productId); //
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 }); //
    }

    // Construir mensajes para el SDK
    const messages: CoreMessage[] = [
      { role: 'system', content: buildSystemPrompt() },
      { role: 'user', content: buildUserPrompt(product, user as User) }
    ];

    // Llamar a la API usando Vercel AI SDK
    const result = await streamText({
       model: mistral('mistral-large-latest'), // Usar el cliente importado, la API key se toma de env vars
       messages: messages,
       mode: 'json' // Intentar obtener JSON directamente
    });

    // --- Procesamiento de la Respuesta ---
    // Como usamos 'mode: json', esperamos que el SDK parsee el JSON por nosotros.
    const analysisObject = await result.response;

    // Validar el objeto JSON recibido
    if (
      typeof analysisObject !== 'object' ||
      analysisObject === null ||
      typeof (analysisObject as any).score !== 'number' ||
      typeof (analysisObject as any).rating !== 'string' ||
      typeof (analysisObject as any).summary !== 'string'
    ) {
      console.error("Invalid JSON object structure received with mode:json:", analysisObject);
      // Intentar parsear manualmente como fallback si 'mode: json' falla estructuralmente
      console.log("Attempting manual parse as fallback...");
      const fullStream = await result.text; // Leer todo el stream como texto
      const manualAnalysis = parseAnalysisResult(fullStream);
      if (!manualAnalysis) {
          throw new Error("AI analysis returned invalid format (failed both mode:json and manual parse).");
      }
      // Validar y redondear score del parseo manual
      manualAnalysis.score = Math.max(0, Math.min(100, Math.round(manualAnalysis.score)));
      return NextResponse.json(manualAnalysis);
    }

     // Si la validación pasa, asegurar el tipo y validar el rango del score
     const analysis = analysisObject as AnalysisResult;
     analysis.score = Math.max(0, Math.min(100, Math.round(analysis.score)));

    // Devolver el resultado validado
    return NextResponse.json(analysis); //

  } catch (error: any) {
    console.error("Error in /api/analyze-product:", error); //
    let errorMessage = 'Internal Server Error';
    let status = 500;
     // Extraer mensaje de error si está disponible
     if (error instanceof Error && error.message) {
         errorMessage = error.message;
     } else if (typeof error === 'string') {
         errorMessage = error;
     }
     // Intentar obtener el status si es un error de API conocido (puede variar según el SDK)
     // if (error.status) { status = error.status; }

    return NextResponse.json({ error: errorMessage }, { status: status }); //
  }
}
