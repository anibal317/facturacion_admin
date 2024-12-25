import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Login
export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: 'Credenciales incorrectas' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    const response = NextResponse.json({ message: 'Login exitoso' });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hora
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error en el login:', error);
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }
}

// Logout
export async function DELETE() {
  try {
    const response = NextResponse.json({ message: 'Logout exitoso' });
    response.cookies.set('token', '', { maxAge: 0, path: '/' }); // Limpia la cookie del token
    return response;
  } catch (error) {
    console.error('Error en el logout:', error);
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }
}
