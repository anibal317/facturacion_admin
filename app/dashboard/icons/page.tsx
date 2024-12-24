// app/page.tsx

import IconGrid from "../../components/iconGrid/IconGrid";
import '@/app/globals.css';
import React from 'react';

export default function Page() {
    return (
        <div className="flex flex-col items-center w-full max-h-screen">
            <h1 className="mb-6 font-bold text-4xl">Iconos</h1>
            <p className="mb-4 text-lg">Explora y copia los iconos que desees.</p>
            <em className="mb-4 text-lg">Si haces click sobre el icono, el nombre se copiará al portapalees</em> 😁
            <div className="">
                <IconGrid />
            </div>
        </div>
    );
}