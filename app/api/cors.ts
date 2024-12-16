// app/api/cors.ts

import { NextResponse } from 'next/server';

export function cors(req: Request) {
  const res = NextResponse.next();

  // Habilitar CORS
  res.headers.set('Access-Control-Allow-Origin', '*'); // Cambia '*' por tu dominio en producción
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar solicitudes OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: res.headers });
  }

  return res;
}