'use server';

import * as z from 'zod';
import {RegisterSchema} from '@/schemas';
import {db} from '@/lib/db';
import bcrypt from 'bcryptjs';
import {DEFAULT_LOGIN_REDIRECT} from '@/routes';
import {redirect} from 'next/navigation';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  console.log('register - Attempting registration with values:', values);

  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    console.log('register - Registration validation failed:', validatedFields.error);
    return {error: 'Invalid fields!'};
  }

  const {email, password, name} = validatedFields.data;
  console.log('register - Registration validation successful. Email:', email, 'Name:', name);

  try {
    console.log('register - Checking for existing user with email:', email);
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      console.log('register - Email already taken:', email);
      return {error: 'Email already taken'};
    }

    console.log('register - Hashing password.');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('register - Password hashed.');

    console.log('register - Creating user in database.');
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    console.log('register - Registration successful!', 'redirect: /login');
    return {success: 'Registration successful! Please login.', redirect: '/login'};
  } catch (error: any) {
    console.error('register - Registration failed:', error);
    return {error: 'Failed to register user. Please try again later.'};
  }
};
