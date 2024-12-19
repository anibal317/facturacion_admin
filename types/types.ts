// types.ts
export interface User {
    id: number;
    name: string;
    email: string;
    active: boolean;
    [key: string]: any; // Permitir propiedades dinámicas
}