import * as z from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  email: z.string().email({
    message: 'Invalid email',
  }),
  password: z.string().min(6, {
    message: 'Minimum 6 characters required',
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Invalid email',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
});
