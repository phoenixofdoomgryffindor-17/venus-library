'use client';

import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Loader2, ShoppingCart, MessageSquarePlus, Flag, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFirestore, useUser } from '@/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { doc, collection, query, where, getDocs, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Book, Chapter, Review, User } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const StarRating = ({ rating, setRating }: { rating: number, setRating: (r: number) => void }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <button
                        key={starValue}
                        type="button"
                        onClick={() => setRating(starValue)}
                        className="focus:outline-none"
                    >
                        <svg className={`w-6 h-6 transition-colors ${starValue <= rating ? 'text-amber-500 fill-amber-400' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    </button>
                )
            })}
        </div>
    )
}

function ReviewForm({ book, user }: { book: Book; user: User }) {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!comment || rating === 0) {
      toast({ title: 'Please provide a rating and a comment.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    const reviewData = {
      bookId: book.id,
      bookTitle: book.title,
      userId: user.uid,
      user: {
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL || '',
      },
      rating,
      comment,
      timestamp: serverTimestamp(),
    };
    
    try {
      // Add to reviews collection
      addDocumentNonBlocking(collection(firestore, 'reviews'), reviewData);

      // Add to flags collection for author feedback panel
      addDocumentNonBlocking(collection(firestore, 'flags'), {
        title: `New Review for "${book.title}"`,
        reason: `Rating: ${rating}/5 - ${comment}`,
        contentId: book.id,
        type: 'review',
        status: 'pending',
        date: serverTimestamp(),
      });

      toast({ title: 'Review submitted!', description: 'Thank you for your feedback.' });
      setComment('');
      setRating(0);
    } catch (e: any) {
      toast({ title: 'Error submitting review', description: e.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mt-6 bg-card/50">
        <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Write a review</h3>
            <div className="space-y-4">
                <div>
                    <StarRating rating={rating} setRating={setRating} />
                </div>
                <Textarea 
                    placeholder="Share your thoughts..." 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="bg-background/50"
                />
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit Review'}
                </Button>
            </div>
        </CardContent>
    </Card>
  );
}


export default function BookPage() {
  const params = useParams();
  const slug = params.slug as string;
  const firestore = useFirestore();
  const { user, loading: userLoading } = useUser();

  const [book, setBook] = useState<Book | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [loadingBook, setLoadingBook] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { toast } = useToast();

  const [chaptersSnapshot, chaptersLoading] = useCollection(
    book ? query(collection(firestore, 'chapters'), where('bookId', '==', book.id)) : null
  );
  const [reviewsSnapshot, reviewsLoading] = useCollection(
    book ? query(collection(firestore, 'reviews'), where('bookId', '==', book.id)) : null
  );
  
  const [authorSnapshot, authorLoading] = useCollection(
    book?.authorId ? query(collection(firestore, 'users'), where('uid', '==', book.authorId)) : null
  );

  useEffect(() => {
    const fetchBook = async () => {
      setLoadingBook(true);
      const booksRef = collection(firestore, 'books');
      const q = query(booksRef, where('slug', '==', slug), where('status', '==', 'published'));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setBook(null);
      } else {
        const bookDoc = querySnapshot.docs[0];
        setBook({ id: bookDoc.id, ...bookDoc.data() } as Book);
      }
      setLoadingBook(false);
    };

    if (slug) {
      fetchBook();
    }
  }, [firestore, slug]);

  useEffect(() => {
    if (authorSnapshot && !authorSnapshot.empty) {
      setAuthor(authorSnapshot.docs[0].data() as User);
    }
  }, [authorSnapshot]);
  

  const handleDeleteReview = async (reviewId: string) => {
    if (!firestore) return;
    try {
        await deleteDoc(doc(firestore, 'reviews', reviewId));
        toast({ title: "Review Deleted", description: "Your review has been removed." });
    } catch (e: any) {
        toast({ title: "Error", description: "Could not delete review.", variant: "destructive"});
    }
  };

  const handleReportBook = async () => {
    if (!book || !user) return;
    addDocumentNonBlocking(collection(firestore, 'flags'), {
        title: `Book Report: "${book.title}"`,
        reason: `Manually reported by user ${user.displayName} (${user.uid})`,
        contentId: book.id,
        type: 'book',
        status: 'pending',
        date: serverTimestamp(),
      });
      toast({ title: 'Book Reported', description: 'Thank you for your feedback. Our moderation team will review it.' });
  }

  const isLoading = loadingBook || chaptersLoading || reviewsLoading || authorLoading || userLoading;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!book) {
    notFound();
  }

  const chapters = chaptersSnapshot?.docs.map(d => ({ id: d.id, ...d.data() } as Chapter)).sort((a, b) => a.order - b.order) || [];
  const reviews = reviewsSnapshot?.docs.map(d => ({ id: d.id, ...d.data() } as Review)) || [];
  const totalWords = chapters.reduce((sum, ch) => sum + (ch.wordCount || 0), 0);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <div className="md:col-span-1">
            <Card className="overflow-hidden shadow-2xl">
              <div className="aspect-[3/4] relative">
                <Image
                  src={book.coverUrl}
                  alt={`Cover for ${book.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover"
                  data-ai-hint="book cover"
                />
              </div>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{book.genre}</Badge>
                {book.tags && book.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
              </div>

              <div className="flex justify-between items-start">
                  <div>
                      <h1 className="font-headline text-5xl font-bold">{book.title}</h1>
                      {author && (
                          <div className="flex items-center gap-2 mt-2">
                              <Avatar className="h-8 w-8">
                                  <AvatarImage src={author.photoURL ?? undefined} />
                                  <AvatarFallback>{author.displayName?.[0]}</AvatarFallback>
                              </Avatar>
                              <p className="text-lg font-medium">by {author.displayName}</p>
                          </div>
                      )}
                  </div>
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                              <Flag />
                          </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                              <AlertDialogTitle>Report this book?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  If this book contains inappropriate content, please report it. Our moderation team will review it shortly.
                              </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleReportBook}>Report</AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                  </AlertDialog>
              </div>

              <Card className="bg-card/50">
                <CardContent className="p-4 flex justify-around">
                   <div className="text-center">
                      <BookOpen className="mx-auto" />
                      <span className="block font-bold text-lg">{chapters.length}</span>
                      <span className="text-sm text-muted-foreground">Chapters</span>
                  </div>
                   <div className="text-center">
                      <Clock className="mx-auto" />
                      <span className="block font-bold text-lg">{Math.ceil(totalWords / 250)}</span>
                      <span className="text-sm text-muted-foreground">min read</span>
                  </div>
                  <div className="text-center">
                      <ShoppingCart className="mx-auto" />
                      <span className="block font-bold text-lg">{book.copiesSold || 0}</span>
                      <span className="text-sm text-muted-foreground">Sold</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <p className="text-lg leading-relaxed">{book.description}</p>
            
              {author && (
                  <Card className="bg-card/50">
                    <CardHeader>
                      <h2 className="text-2xl font-bold">About the Author</h2>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4">
                       <Avatar className="h-16 w-16">
                           <AvatarImage src={author.photoURL ?? undefined} />
                           <AvatarFallback>{author.displayName?.[0]}</AvatarFallback>
                       </Avatar>
                       <div>
                           <p className="font-bold text-xl">{author.displayName}</p>
                           <p className="text-muted-foreground mt-1">{author.bio}</p>
                       </div>
                    </CardContent>
                  </Card>
              )}
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-baseline gap-4">
                      <h2 className="text-3xl font-bold">Reader Reviews ({reviews.length})</h2>
                      {(book.ratingAvg ?? 0) > 0 && (
                          <div className="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-amber-400 text-amber-500" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                              <span className="font-bold text-lg">{book.ratingAvg?.toFixed(1)}</span>
                              <span className="text-sm text-muted-foreground">({book.ratingCount} ratings)</span>
                          </div>
                      )}
                  </div>
                  <Button variant="outline" onClick={() => setShowReviewForm(!showReviewForm)}>
                      <MessageSquarePlus />
                      {showReviewForm ? 'Cancel' : 'Write a Review'}
                  </Button>
                </div>

                {showReviewForm && user && <ReviewForm book={book} user={user} />}
                
                <div className="space-y-6">
                  {reviews.map(review => (
                    <Card key={review.id} className="bg-card/50">
                      <CardContent className="p-6 flex gap-4">
                        <Avatar>
                          <AvatarImage src={review.user?.photoURL ?? undefined} alt={review.user?.displayName} />
                          <AvatarFallback>{review.user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold">{review.user?.displayName || 'Anonymous'}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-500' : 'fill-muted text-muted-foreground'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-muted-foreground">
                                {review.timestamp ? new Date((review.timestamp as any).seconds * 1000).toLocaleDateString() : 'Just now'}
                              </p>
                              {user?.uid === review.userId && (
                                  <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-7 w-7">
                                              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                          </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                          <AlertDialogHeader>
                                              <AlertDialogTitle>Delete this review?</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                  This action cannot be undone. Your review will be permanently removed.
                                              </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                                              <AlertDialogAction onClick={() => handleDeleteReview(review.id)}>Delete</AlertDialogAction>
                                          </AlertDialogFooter>
                                      </AlertDialogContent>
                                  </AlertDialog>
                              )}
                            </div>
                          </div>
                          
                          <p className="mt-3 text-foreground/90">{review.comment}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
