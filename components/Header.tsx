'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import LoginModal from '@/components/LoginModal';
import { useAuth } from '@/lib/auth';

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLoginClick = () => setIsLoginModalOpen(true);
  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out successfully',
      description: 'You have been logged out of your account.',
    });
  };

  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">Random Stuff</h1>
      <nav>
        {user ? (
          <>
            <Button variant="outline" onClick={() => window.location.href = '/create'}>Create Post</Button>
            <Button variant="ghost" onClick={handleLogout} className="ml-2">Logout</Button>
          </>
        ) : (
          <Button onClick={handleLoginClick}>Login</Button>
        )}
      </nav>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  );
}