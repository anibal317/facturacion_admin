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
    active: boolean;
    ordering: number;}

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
    active: boolean;
    ordering: number;
}

export interface Client {
    id: number;
    name: string;
    img: string;
    link: string;
    active: boolean;
    ordering: number;
}

export interface FAQ {
    id: number;
    question: string;
    answer: string;
    active: boolean;
    ordering: number;}

export interface Benefits {
    id: number;
    icon: string;
    title: string;
    description: string;
    color: string;
    isStrikethrough: boolean;
    section: string;
    active: boolean;
    ordering: number;
}

export interface Features {
    id: number;
    title: string;
    description: string;
    video: boolean;
    videoLink: string;
    items: Item[];
}

export interface Item {
    id: number;
    text: string;
    featureId: number;
    parentId: number | null;
    children: Item[];
}