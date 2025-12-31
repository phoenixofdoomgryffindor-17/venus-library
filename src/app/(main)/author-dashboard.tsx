'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Book } from '@/lib/types';
import { useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp, doc, setDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
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
import { usePaginatedAuthorBooks } from '@/hooks/use-paginated-author-books';
import { flagInappropriateContent } from '@/ai/flows/flag-inappropriate-content';
import { generateBookCover } from '@/ai/flows/generate-book-cover';
import { getCommand } from '@/lib/commands';

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
  
  const { books, loading: booksLoading, hasMore, loadMore, loadingMore } = usePaginatedAuthorBooks(user?.uid);
  
  const [critiqueLoading, setCritiqueLoading] = useState<string | null>(null);
  const [isCreateBookOpen, setCreateBookOpen] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookGenre, setNewBookGenre] = useState('');
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  
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
    const placeholderCoverUrl = `https://picsum.photos/seed/${newSlug}/600/800`;

    try {
        const bookDocRef = doc(collection(firestore, 'books'));
        
        const newBookData: Omit<Book, 'id'> = {
            authorId: user.uid,
            title: newBookTitle,
            slug: newSlug,
            description: '',
            genre: newBookGenre,
            coverUrl: placeholderCoverUrl, // Use placeholder image
            status: 'draft',
            price: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        await setDoc(bookDocRef, {
            ...newBookData,
            id: bookDocRef.id,
        });
        
        const chaptersColRef = collection(firestore, `books/${bookDocRef.id}/chapters`);
        addDocumentNonBlocking(chaptersColRef, {
          title: 'Chapter 1',
          order: 1,
          content: '<p>Start writing your first chapter here...</p>',
          wordCount: 6,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        setNewBookTitle('');
        setNewBookGenre('');
        setCreateBookOpen(false);
        toast({ title: "Book Created!", description: `"${newBookTitle}" has been added to your studio.` });
        router.refresh();
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
      // This is a simple way to refresh data, optimistic UI would be better.
      router.refresh();

    } catch (e: any) {
        toast({ title: "Delete failed", description: e.message, variant: "destructive" });
    } finally {
        setBookToDelete(null);
    }
  };

  const handlePublishBook = async (book: Book) => {
    if (!firestore || !user) return;
    
    const chaptersQuery = query(collection(firestore, 'books', book.id, 'chapters'));
    const chaptersSnapshot = await getDocs(chaptersQuery);
    const bookContent = chaptersSnapshot.docs
        .map(doc => doc.data().content)
        .join('\n\n');

    const flagResult = await flagInappropriateContent({ text: book.title + '\n' + bookContent, contentType: 'book' });
    
    if (flagResult.isFlagged) {
        addDocumentNonBlocking(collection(firestore, 'flags'), {
            title: `Auto-flagged on Publish: ${book.title}`,
            reason: `AI detected potentially inappropriate content: ${flagResult.reason}`,
            contentId: book.id,
            type: 'book',
            status: 'pending',
            date: serverTimestamp(),
        });
        toast({ title: "Publication Pending Review", description: "Your book has been flagged for review due to potentially inappropriate content. It will be published after verification.", variant: "default" });
        return;
    }
    
    const bookRef = doc(firestore, 'books', book.id);
    updateDocumentNonBlocking(bookRef, {
        status: 'published',
        updatedAt: serverTimestamp(),
    });

    toast({ title: "Book Published!", description: `"${book.title}" is now live in the marketplace.` });
    router.refresh();
  }
  
  const handleRequestCritique = async (book: Book) => {
    const command = getCommand('ai.critique');
    if (command && command.run) {
      command.run({ editor: null, book, activeChapter: {} as any, toggleSidebar: () => {}});
    }
  }

  const loading = userLoading || (booksLoading && books.length === 0);

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
                        Give your new book a title and a genre to get started. A placeholder cover will be generated for you.
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
            {books && books.map(book => (
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
                            <Button variant="secondary" size="sm" onClick={() => handlePublishBook(book)}>
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
        {books.length === 0 && !booksLoading && (
            <div className="text-center p-8 text-muted-foreground">
                <p>No books yet. Start your authoring journey by creating one!</p>
            </div>
        )}
        {hasMore && (
            <div className="p-4 text-center">
                <Button onClick={loadMore} disabled={loadingMore}>
                    {loadingMore ? <Loader2 className="animate-spin" /> : 'Load More'}
                </Button>
            </div>
        )}
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
            <AlertDialogAction onClick={handleDeleteBook} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
