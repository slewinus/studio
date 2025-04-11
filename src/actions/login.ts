'use server';

import * as z from 'zod';
import {LoginSchema} from '@/schemas';
import {db} from '@/lib/db';
import bcrypt from 'bcryptjs';
import {signIn} from '@/auth';
import {DEFAULT_LOGIN_REDIRECT} from '@/routes';
import {AuthError} from 'next-auth';

export const login = async (values: z.infer<typeof LoginSchema>) => {
  console.log('Attempting login with values:', values);

  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    console.log('Login validation failed:', validatedFields.error);
    return {error: 'Invalid fields!'};
  }

  const {email, password} = validatedFields.data;
  console.log('Login validation successful. Email:', email);

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
    console.log('signIn successful, redirecting');
  } catch (error) {
    console.error('signIn error:', error);    
    if (error) {
      if (error instanceof AuthError) {
          if (error.type) {
            switch (error.type) {
              case 'CredentialsSignin':
                console.log('Invalid credentials error');
                return { error: 'Invalid credentials!' };
              default:
                console.log('Generic authentication error');
                return { error: 'Something went wrong!' };
            }
          }
      } else { 
            return {error: 'An unexpected error occurred during login.'};
      }
    }
    throw error;
  }
};
