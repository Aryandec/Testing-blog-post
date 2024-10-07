'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth';
import { BlogPost, Comment } from '@/lib/types';

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comment, setComment] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const foundPost = posts.find((p: BlogPost) => p.id === id);
    if (foundPost) {
      setPost(foundPost);
    }
  }, [id]);

  const handleComment = () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to comment on posts.',
        variant: 'destructive',
      });
      return;
    }
    if (comment.trim() && post) {
      const newComment: Comment = {
        id: Date.now().toString(),
        content: comment,
        author: user.username,
        createdAt: new Date().toISOString(),
      };
      const updatedPost = { ...post, comments: [...post.comments, newComment] };
      setPost(updatedPost);
      const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
      const updatedPosts = posts.map((p: BlogPost) => p.id === id ? updatedPost : p);
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
      setComment('');
      toast({
        title: 'Comment added',
        description: 'Your comment has been posted successfully.',
      });
    }
  };

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-2">By {post.author} on {new Date(post.createdAt).toLocaleDateString()}</p>
      <div className="mb-8">{post.content}</div>
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <div className="space-y-4 mb-8">
        {post.comments.map((comment) => (
          <div key={comment.id} className="bg-gray-100 p-4 rounded">
            <p>{comment.content}</p>
            <p className="text-sm text-gray-600 mt-2">
              By {comment.author} on {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <Button onClick={handleComment}>Post Comment</Button>
      </div>
    </div>
  );
}