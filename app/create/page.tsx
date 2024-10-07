'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth';
import { BlogPost } from '@/lib/types';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create a post.',
        variant: 'destructive',
      });
      return;
    }
    if (title && content) {
      const newPost: BlogPost = {
        id: Date.now().toString(),
        title,
        content,
        author: user.username,
        createdAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        comments: [],
      };
      const existingPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
      localStorage.setItem('blogPosts', JSON.stringify([newPost, ...existingPosts]));
      toast({
        title: 'Post created',
        description: 'Your post has been published successfully.',
      });
      router.push('/');
    } else {
      toast({
        title: 'Invalid input',
        description: 'Please enter both title and content for your post.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
          />
        </div>
        <Button type="submit">Publish Post</Button>
      </form>
    </div>
  );
}