export type Suitability = 'recommended' | 'caution' | 'not_recommended';

export type Product = {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  imageUrl: string;
  imageHint: string;
  suitability: Suitability;
  tags: string[];
  ingredients: string;
  allergens: string[];
  nutritionalInformation: {
    servingsPerPackage: number;
    servingSize: string;
    metrics: { name: string; perServing: string; per100g: string }[];
  };
};

export type Allergen = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type Diet = {
    id: string;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
};

export type HealthGoal = {
    id: string;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
};

export type User = {
  name: string;
  email: string;
  avatarUrl: string;
  avatarHint: string;
  allergies: string[];
  diet: string[];
  healthGoals: string[];
  shoppingList: string[];
  scanHistory: string[];
  onboardingComplete: boolean;
};
