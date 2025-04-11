'use client';

import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {RegisterSchema} from '@/schemas';
import {z} from 'zod';
import {useState, useTransition} from 'react';
import {FormError} from '@/components/form-error';
import {FormSuccess} from '@/components/form-success';
import {register} from '@/actions/register';

const RegisterPage = () => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      register(values).then(data => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-secondary">
      <Card className="w-80">
        <CardHeader className="space-y-2">
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...form.register('name')}
                type="text"
                placeholder="John Doe"
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                {...form.register('email')}
                type="email"
                placeholder="john.doe@example.com"
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                {...form.register('password')}
                type="password"
                placeholder="********"
                disabled={isPending}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Loading...' : 'Register'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
