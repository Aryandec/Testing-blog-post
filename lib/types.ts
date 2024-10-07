export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  comments: Comment[];
}