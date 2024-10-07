import { Suspense } from 'react';
import BlogList from '@/components/BlogList';
import Header from '@/components/Header';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <h1 className="text-4xl font-bold mb-8">Random Stuff</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <BlogList />
      </Suspense>
    </div>
  );
}