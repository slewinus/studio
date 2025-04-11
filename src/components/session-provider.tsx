'use client';

import {SessionProvider} from 'next-auth/react';

interface SessionProviderProps {
  children: React.ReactNode;
}

export const NextAuthSessionProvider = ({children}: SessionProviderProps) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
};
