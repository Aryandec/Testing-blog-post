'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth';
import { BlogPost } from '@/lib/types';

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filter, setFilter] = useState('newest');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const storedPosts = localStorage.getItem('blogPosts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  }, []);

  useEffect(() => {
    let sortedPosts = [...posts];
    switch (filter) {
      case 'mostLiked':
        sortedPosts.sort((a, b) => b.likes - a.likes);
        break;
      case 'mostDisliked':
        sortedPosts.sort((a, b) => b.dislikes - a.dislikes);
        break;
      case 'mostCommented':
        sortedPosts.sort((a, b) => b.comments.length - a.comments.length);
        break;
      default:
        sortedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    setPosts(sortedPosts);
  }, [filter, posts]);

  const handleLike = (postId: string) => {
    if (!user) {
      toast({ title: 'Login Required', description: 'Please log in to like posts.' });
      return;
    }
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
    localStorage.setItem('blogPosts', JSON.stringify(posts));
  };

  const handleDislike = (postId: string) => {
    if (!user) {
      toast({ title: 'Login Required', description: 'Please log in to dislike posts.' });
      return;
    }
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, dislikes: post.dislikes + 1 } : post
    ));
    localStorage.setItem('blogPosts', JSON.stringify(posts));
  };

  return (
    <div>
      <div className="mb-4">
        <Select onValueChange={setFilter} defaultValue={filter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter posts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="mostLiked">Most Liked</SelectItem>
            <SelectItem value="mostDisliked">Most Disliked</SelectItem>
            <SelectItem value="mostCommented">Most Commented</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{post.content.substring(0, 100)}...</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" size="sm" onClick={() => handleLike(post.id)}>
                <ThumbsUp className="mr-2 h-4 w-4" /> {post.likes}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDislike(post.id)}>
                <ThumbsDown className="mr-2 h-4 w-4" /> {post.dislikes}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = `/post/${post.id}`}>
                <MessageSquare className="mr-2 h-4 w-4" /> {post.comments.length}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}