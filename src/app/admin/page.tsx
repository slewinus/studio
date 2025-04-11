'use client';

import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {db} from '@/lib/db';
import {User} from '@prisma/client';
import {Button} from '@/components/ui/button';

const AdminPage = () => {
  const {data: session} = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await db.user.findMany();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    if (session?.user?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [session]);

  if (!session || session.user?.role !== 'ADMIN') {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Unauthorized. You must be an admin to view this page.</p>
        <Button onClick={() => router.push('/profile')}>Go to Profile</Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel - User Management</h1>
      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {user.name} - {user.email} - {user.role}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default AdminPage;
