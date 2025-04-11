'use server';

import * as z from 'zod';
import {LoginSchema} from '@/schemas';
import {db} from '@/lib/db';
import bcrypt from 'bcryptjs';
import {signIn} from '@/auth';
import {DEFAULT_LOGIN_REDIRECT} from '@/routes';
import { AuthError } from 'next-auth';

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {error: 'Invalid fields!'};
  }

  const {email, password} = validatedFields.data;

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      // Check if error and error.type exists before proceeding
      if (error && error.type) {
        switch (error.type) {
          case 'CredentialsSignin':
            return {error: 'Invalid credentials!'};
          default:
            return {error: 'Something went wrong!'};
        }
      } else {
        // Handle the case where error or error.type is undefined
        return {error: 'An unexpected error occurred during login.'};
      }
    }

    throw error;
  }
};

