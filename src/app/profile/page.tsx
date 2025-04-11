'use client';

import {useSession} from 'next-auth/react';
import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';

const ProfilePage = () => {
  const {data: session} = useSession();
  const router = useRouter();

  if (!session || !session.user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Please log in to view your profile.</p>
        <Button onClick={() => router.push('/login')}>Login</Button>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div>
        <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
        <p>Name: {session.user.name}</p>
        <p>Email: {session.user.email}</p>
        <p>Role: {session.user.role || 'User'}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
