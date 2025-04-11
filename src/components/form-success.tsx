'use client';

import {Alert, AlertDescription} from '@/components/ui/alert';

interface FormSuccessProps {
  message?: string;
}

export const FormSuccess = ({message}: FormSuccessProps) => {
  if (!message) {
    return null;
  }

  return (
    <Alert>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

