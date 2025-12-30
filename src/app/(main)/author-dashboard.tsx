
'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Book } from '@/lib/types';
import { useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, serverTimestamp, doc, getDocs, setDoc, deleteDoc, where, updateDoc } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, Trash2, Edit, BarChart, Loader2, BookUp, MessageCircleQuestion } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { critiqueBook } from '@/ai/flows/critique-book';
import EditButton from '@/components/EditButton';
import { useRouter } from 'next/navigation';

const createSlug = (title: string) => {
    if (!title) {
        return '';
    }
    const timestamp = new Date().getTime();
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim() + '-' + timestamp;
};

const genres = ["Fantasy", "Science Fiction", "Mystery", "Thriller", "Romance", "Horror", "Historical Fiction", "Non-Fiction"];

export default function AuthorDashboard() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [critiqueLoading, setCritiqueLoading] = useState<string | null>(null);
  const [isCreateBookOpen, setCreateBookOpen] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookGenre, setNewBookGenre] = useState('');
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);


  const authorBooksQuery = useMemoFirebase(
    () => (firestore && user ? query(collection(firestore, 'books'), where('authorId', '==', user.uid)) : null),
    [firestore, user]
  );
  
  const { data: authorBooks, isLoading: booksLoading } = useCollection<Book>(authorBooksQuery);
  
  const handleCreateBook = async () => {
    if (!user || !firestore) {
        toast({ title: "Not Authenticated", description: "You must be logged in to create a book.", variant: "destructive" });
        return;
    }
    if (!newBookTitle || !newBookGenre) {
        toast({ title: "Missing Information", description: "Please provide a title and genre.", variant: "destructive" });
        return;
    }
    toast({ title: "Creating Book..." });
    
    const newSlug = createSlug(newBookTitle);

    try {
        const bookDocRef = doc(collection(firestore, 'books'));
        
        await setDoc(bookDocRef, {
            id: bookDocRef.id,
            authorId: user.uid,
            title: newBookTitle,
            slug: newSlug,
            description: '',
            genre: newBookGenre,
            coverUrl: `https://picsum.photos/seed/${Date.now()}/265/400`,
            status: 'draft',
            price: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        
        const chaptersColRef = collection(firestore, `books/${bookDocRef.id}/chapters`);
        await addDocumentNonBlocking(chaptersColRef, {
          title: 'Chapter 1',
          order: 1,
          content: 'Start writing your first chapter here...',
          wordCount: 6,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        setNewBookTitle('');
        setNewBookGenre('');
        setCreateBookOpen(false);
        toast({ title: "Book Created!", description: `"${newBookTitle}" has been added to your studio.` });
    } catch(e: any) {
        toast({ title: 'Error creating book', description: e.message, variant: 'destructive' });
    }
  };
  
  const confirmDeleteBook = (book: Book) => {
    setBookToDelete(book);
    setDeleteDialogOpen(true);
  };

  const handleDeleteBook = async () => {
    if (!firestore || !user || !bookToDelete) return;
    
    setDeleteDialogOpen(false);

    try {
      const bookRef = doc(firestore, 'books', bookToDelete.id);
      await deleteDoc(bookRef);
      
      toast({ title: "Book Deleted", description: "The book has been removed from your studio and the marketplace." });
      router.refresh();

    } catch (e: any) {
        toast({ title: "Delete failed", description: e.message, variant: "destructive" });
    } finally {
        setBookToDelete(null);
    }
  };

  const handlePublishBook = async (bookId: string, bookData: Book) => {
    if (!firestore || !user) return;
    
    const bookRef = doc(firestore, 'books', bookId);
    updateDocumentNonBlocking(bookRef, {
        status: 'published',
        updatedAt: serverTimestamp(),
    });

    toast({ title: "Book Published!", description: `"${bookData.title}" is now live in the marketplace.` });
  }
  
  const handleRequestCritique = async (book: Book) => {
    if (!firestore || !user) return;
    setCritiqueLoading(book.id);
    toast({ title: "Requesting AI Critique...", description: "The story doctor is on the way."});

    try {
        const chaptersQuery = query(collection(firestore, 'books', book.id, 'chapters'));
        const chaptersSnapshot = await getDocs(chaptersQuery);
        const bookContent = chaptersSnapshot.docs
            .map(doc => doc.data().content)
            .join('\n\n');

        if (!bookContent.trim()) {
            toast({ title: "Critique Failed", description: "This book has no content to critique.", variant: 'destructive'});
            setCritiqueLoading(null);
            return;
        }

        const result = await critiqueBook({ title: book.title, content: bookContent });
        
        await addDocumentNonBlocking(collection(firestore, 'flags'), {
            title: `AI Critique: ${book.title}`,
            reason: result.critique,
            contentId: book.id,
            type: 'book',
            status: 'pending',
            date: serverTimestamp(),
        });

        toast({ title: "AI Critique Ready!", description: `Feedback for "${book.title}" has been generated and is available in the Review/Feedback section.` });

    } catch (error: any) {
        toast({ title: "AI Critique Failed", description: error.message || 'An unknown error occurred.', variant: 'destructive' });
    } finally {
        setCritiqueLoading(null);
    }
  }

  const loading = userLoading || booksLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-headline text-3xl font-semibold">My Books</h2>
        <Dialog open={isCreateBookOpen} onOpenChange={setCreateBookOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle />
                    Create New Book
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New Book</DialogTitle>
                    <DialogDescription>
                        Give your new book a title and a genre to get started. You can change this later.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={newBookTitle} onChange={(e) => setNewBookTitle(e.target.value)} />
                    </div>
                      <div className="grid gap-2">
                        <Label htmlFor="genre">Genre</Label>
                          <Select value={newBookGenre} onValueChange={setNewBookGenre}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a genre" />
                            </SelectTrigger>
                            <SelectContent>
                                {genres.map(genre => (
                                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setCreateBookOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateBook}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-lg bg-card/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {authorBooks && authorBooks.map(book => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>
                  <Badge variant={book.status === 'published' ? 'default' : 'secondary'} className={book.status === 'published' ? 'bg-green-600' : ''}>
                    {book.status}
                  </Badge>
                </TableCell>
                <TableCell>{(book.ratingAvg ?? 0) > 0 ? `${book.ratingAvg?.toFixed(1)} (${book.ratingCount})` : 'N/A'}</TableCell>
                <TableCell>{book.updatedAt && typeof book.updatedAt === 'object' && 'seconds' in book.updatedAt ? new Date((book.updatedAt as any).seconds * 1000).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                        <EditButton bookId={book.id} />
                        {book.status !== 'published' && (
                            <Button variant="secondary" size="sm" onClick={() => handlePublishBook(book.id, book)}>
                                <BookUp /> Publish
                            </Button>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>More Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleRequestCritique(book)} disabled={critiqueLoading === book.id}>
                                    {critiqueLoading === book.id ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <MessageCircleQuestion />
                                    )}
                                    {critiqueLoading === book.id ? 'Analyzing...' : 'AI Critique'}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <BarChart /> View Analytics
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => confirmDeleteBook(book)}
                                >
                                    <Trash2 /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{bookToDelete?.title}". If published, it will also be removed from the marketplace. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBook}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    