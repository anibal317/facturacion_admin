// app/api/cors.ts

export function setCorsHeaders() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*'); // Cambia '*' por tu dominio en producción
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return headers;
}