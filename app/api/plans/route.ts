// pages/api/plans.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001'); // Cambia esto a tu dominio en producción
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Métodos permitidos
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Encabezados permitidos

  if (req.method === 'OPTIONS') {
    // Responder a las solicitudes preflight
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const plans = await prisma.plan.findMany(); // Suponiendo que tienes un modelo "Plan"
      res.status(200).json({ plans });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los planes' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}