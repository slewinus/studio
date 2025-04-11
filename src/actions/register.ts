'use server';

import * as z from 'zod';
import {RegisterSchema} from '@/schemas';
import {db} from '@/lib/db';
import bcrypt from 'bcryptjs';
import {DEFAULT_LOGIN_REDIRECT} from '@/routes';
import {redirect} from 'next/navigation';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  console.log('Attempting registration with values:', values);

  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    console.log('Registration validation failed:', validatedFields.error);
    return {error: 'Invalid fields!'};
  }

  const {email, password, name} = validatedFields.data;
  console.log('Registration validation successful. Email:', email, 'Name:', name);

  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      console.log('Email already taken:', email);
      return {error: 'Email already taken'};
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed.');

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    console.log('Registration successful!', 'redirect: /login');
    return {success: 'Registration successful!', redirect: '/login'};
  } catch (error: any) {
    console.error('Registration failed:', error);
    return {error: 'Failed to register user. Please try again later.'};
  }
};
