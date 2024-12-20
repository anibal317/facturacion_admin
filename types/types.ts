// types.ts
export interface User {
    id: number;
    name: string;
    email: string;
    active: boolean;
    [key: string]: any; // Permitir propiedades dinámicas
}

export interface PlanFeature {
    id: number;
    text: string;
    savings: string | null;
    hasInfo: boolean;
    isPremium: boolean;
    planId: string;
}

export interface PricingPlan {
    id: number;
    planId: string;
    isRecommended: boolean;
    title: string;
    subtitle: string | null;
    originalPrice: number;
    discountedPrice: number | null;
    freeMonths: number | null;
    purchasePoints: string;
    planfeature: PlanFeature[];
}

export interface Client {
    id: number;
    name: string;
    img: string;
    link: string;
    active: boolean;
    ordering: number;
}