
import { notFound, redirect } from 'next/navigation';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { Book } from '@/lib/types';
import { getApps } from 'firebase/app';

// This is a Server Component to handle redirection.
export default async function BookIdRedirectPage({ params }: { params: { id: string } }) {
  const bookId = params.id as string;
  
  // Firebase must be initialized on the server to fetch data.
  if (getApps().length === 0) {
    initializeFirebase();
  }
  const firestore = getFirestore();

  try {
    const bookDocRef = doc(firestore, 'books', bookId);
    const bookSnapshot = await getDoc(bookDocRef);

    if (!bookSnapshot.exists()) {
      notFound();
      return;
    }

    const book = bookSnapshot.data() as Book;
    const slug = book.slug;

    if (slug) {
      redirect(`/books/${slug}`);
    } else {
      // Handle cases where a published book might not have a slug, although this should be rare.
      notFound();
    }
  } catch (error) {
    console.error("Error fetching book for redirect:", error);
    notFound();
  }

  // This component will not render anything as it always redirects or throws notFound.
  return null;
}
