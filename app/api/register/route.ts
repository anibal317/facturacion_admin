import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

const registerSchema = z.object({
  username: z.string().nonempty('Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  createdAt: z.string().datetime().optional(),
  active: z.boolean().optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedBody = registerSchema.safeParse(body);


    if (!parsedBody.success) {
      // Formateamos los errores de Zod para una mejor legibilidad
      const errors = parsedBody.error.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message
      }));

      return NextResponse.json({ message: 'Invalid input', errors }, { status: 400 });
    }

    const { username, password, createdAt, active } = parsedBody.data;
    const currentDate = new Date().toISOString();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        createdAt: createdAt ?? currentDate,
        active: active ?? true
      },
    });

    return NextResponse.json({ message: 'Usuario creado', user: newUser });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 });
    }
    // Si el body está completamente vacío, req.json() lanzará un error
    if (error instanceof Error && error.message === 'Unexpected end of JSON input') {
      return NextResponse.json({ message: 'Request body is empty', errors: [{ path: 'body', message: 'Body is required' }] }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }
}

