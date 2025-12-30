
import type { Editor } from '@tiptap/react';

export type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  bio?: string;
  socials?: Record<string, string>;
  earnings?: number;
  is2FAEnabled?: boolean;
  onboarded?: boolean;
  schoolCode?: string;
  favoriteGenres?: string[];
  readingGoals?: string;
  age?: number;
  region?: string;
  address?: string;
  phone?: string;
};

export type Book = {
  id: string;
  authorId: string;
  title: string;
  slug: string;
  description:string;
  genre: string;
  tags?: string[];
  coverUrl: string;
  status: 'draft' | 'published';
  price: number;
  ratingAvg?: number;
  ratingCount?: number;
  createdAt: string | { seconds: number; nanoseconds: number; };
  updatedAt: string | { seconds: number; nanoseconds: number; };
  copiesSold?: number;
  appreciations?: number;
};

export type Chapter = {
  id: string;
  bookId: string;
  title: string;
  content: string;
  order: number;
  wordCount: number;
  illustrations?: string[];
  createdAt?: any;
  updatedAt?: any;
};

export type Review = {
  id: string;
  bookId: string;
  bookTitle?: string;
  userId: string;
  rating: number;
  comment: string;
  appreciation?: boolean;
  timestamp: string | { seconds: number; nanoseconds: number; };
  user?: {
    displayName: string;
    photoURL?: string;
  }
};

export type FlaggedContent = {
  id: string;
  type: 'book' | 'review';
  contentId: string;
  title: string;
  reason: string;
  authorId?: string; // Link feedback to an author
  date: string | { seconds: number; nanoseconds: number; };
  status: 'pending' | 'resolved';
};

export type SchoolCode = {
  code: string;
  schoolName: string;
};

export type AIJob = {
  id:string;
  type: 'cover' | 'illustration' | 'rewrite' | 'narration';
  payload: Record<string, any>;
  status: 'pending' | 'completed' | 'failed';
  resultUrl?: string;
  createdAt: string;
}

export type Feature = {
  id: string;
  title: string;
  keywords?: string[];
  icon?: string;
  shortcut?: string;
  tab: 'home' | 'insert' | 'layout' | 'review' | 'ai' | 'view';
  action: (editor?: Editor | null) => void;
};
