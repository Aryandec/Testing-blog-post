'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth';
import { BlogPost } from '@/lib/types';

export default function AdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [users, setUsers] = useState<{ username: string; password: string }[]>([]);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push('/');
      return;
    }

    const storedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    setPosts(storedPosts);

    // In a real app, you would fetch users from a secure backend
    // This is just a simulation for the admin page
    setUsers([
      { username: 'admin', password: 'admin123' },
      { username: 'user1', password: 'password1' },
      { username: 'user2', password: 'password2' },
    ]);
  }, [user, router]);

  const handleDeletePost = (postId: string) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    toast({
      title: 'Post deleted',
      description: 'The post has been successfully deleted.',
    });
  };

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Users</h2>
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.username} className="bg-gray-100 p-2 rounded">
              Username: {user.username}, Password: {user.password}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Posts</h2>
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id} className="bg-gray-100 p-4 rounded">
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p className="text-gray-600 mb-2">By {post.author} on {new Date(post.createdAt).toLocaleDateString()}</p>
              <Button variant="destructive" onClick={() => handleDeletePost(post.id)}>Delete Post</Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}