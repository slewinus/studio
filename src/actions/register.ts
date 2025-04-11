'use server';

import * as z from 'zod';
import {RegisterSchema} from '@/schemas';
import {db} from '@/lib/db';
import bcrypt from 'bcryptjs';
import {DEFAULT_LOGIN_REDIRECT} from '@/routes';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return {error: 'Invalid fields!'};
  }

  const {email, password, name} = validatedFields.data;

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return {error: 'Email already taken'};
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // TODO: Send verification token
  return {success: 'User created!', redirect: DEFAULT_LOGIN_REDIRECT};
};
