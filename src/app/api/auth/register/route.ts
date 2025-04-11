'use server';

import {z} from 'zod';
import {RegisterSchema} from '@/schemas';
import {db} from '@/lib/db';
import bcrypt from 'bcryptjs';
import {NextResponse} from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {email, password, name, role} = RegisterSchema.parse(body);

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return new NextResponse('Email already taken', {status: 409});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json(
      {user: {email: user.email, name: user.name, role: user.role}},
      {status: 200}
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, {status: 400});
    }

    return new NextResponse('Something went wrong', {
      status: 500,
    });
  }
}
