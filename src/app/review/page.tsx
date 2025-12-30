
'use client';

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
import { MoreHorizontal, ShieldAlert, CheckCircle, Loader2, PlusCircle, Book } from 'lucide-react';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useFirestore, useUser } from '@/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, doc, updateDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { FlaggedContent, Book as BookType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import MainApp from "@/components/main-app";
import { Header } from "@/components/header";


export default function ReviewDashboard() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [feedbackSnapshot, feedbackLoading] = useCollection(
    user ? query(collection(firestore, 'flags'), where('authorId', '==', user.uid)) : null
  );
  const [books, setBooks] = useState<Record<string, BookType>>({});

  const [isReportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportContentId, setReportContentId] = useState('');


  const feedbackItems = feedbackSnapshot?.docs.map(d => ({ id: d.id, ...d.data() } as FlaggedContent));

    useEffect(() => {
    const fetchBookData = async () => {
      if (!feedbackItems || feedbackItems.length === 0) return;

      const bookIds = [
        ...new Set(
          feedbackItems
            .filter((item) => item.type === 'book' || item.type === 'review')
            .map((item) => item.contentId)
        ),
      ];
      
      if (bookIds.length === 0) return;

      const booksRef = collection(firestore, 'books');
      const q = query(booksRef, where('__name__', 'in', bookIds));
      const querySnapshot = await getDocs(q);

      const fetchedBooks: Record<string, BookType> = {};
      querySnapshot.forEach((doc) => {
        fetchedBooks[doc.id] = { id: doc.id, ...doc.data() } as BookType;
      });
      setBooks(fetchedBooks);
    };

    if (!feedbackLoading) {
      fetchBookData();
    }
  }, [feedbackItems, feedbackLoading, firestore]);

  const handleResolveFlag = async (id: string) => {
    try {
      await updateDoc(doc(firestore, 'flags', id), { status: 'resolved' });
      toast({ title: 'Feedback Resolved', description: 'The item has been marked as resolved.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleAddReport = async () => {
    if (!reportTitle || !reportReason || !reportContentId || !user) {
        toast({ title: "Missing Information", description: "Please fill out all fields.", variant: "destructive"});
        return;
    }
    
    addDocumentNonBlocking(collection(firestore, 'flags'), {
        title: reportTitle,
        reason: reportReason,
        type: 'book',
        contentId: reportContentId,
        authorId: user.uid, // Ensure feedback is linked to the author
        status: 'pending',
        date: serverTimestamp(),
    });

    toast({ title: 'Manual Feedback Added', description: 'The manual feedback has been submitted for review.' });
    setReportDialogOpen(false);
    setReportTitle('');
    setReportReason('');
    setReportContentId('');
  }

  if (feedbackLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <MainApp>
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
            <div className="space-y-8">
                <section className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="font-headline text-5xl font-bold text-primary mb-2">Review/Feedback</h1>
                        <p className="text-xl text-muted-foreground">Manage user and AI generated feedback.</p>
                    </div>
                    <Dialog open={isReportDialogOpen} onOpenChange={setReportDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle />
                                Add Manual Feedback
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Manual Feedback</DialogTitle>
                                <DialogDescription>Manually flag content that needs review.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="report-title">Title</Label>
                                    <Input id="report-title" value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} placeholder="e.g., 'Inappropriate Book Cover'" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="report-content-id">Content ID</Label>
                                    <Input id="report-content-id" value={reportContentId} onChange={(e) => setReportContentId(e.target.value)} placeholder="Enter Book or Review ID" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="report-reason">Reason</Label>
                                    <Textarea id="report-reason" value={reportReason} onChange={(e) => setReportReason(e.target.value)} placeholder="Describe the issue..." />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setReportDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleAddReport}>Submit Feedback</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </section>

                <section>
                <Card className="border rounded-lg bg-card/50">
                    <CardHeader>
                        <CardTitle>Review Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Feedback/Reason</TableHead>
                            <TableHead>Content ID</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {feedbackItems && feedbackItems.map((item) => {
                                const book = books[item.contentId];
                                const bookSlug = book?.slug;
                                const viewHref = item.type === 'book' && bookSlug 
                                  ? `/author/studio/${item.contentId}` 
                                  : (bookSlug ? `/books/${bookSlug}` : '#');
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.title}</TableCell>
                                        <TableCell>{item.reason}</TableCell>
                                        <TableCell className="font-mono text-xs">{item.contentId}</TableCell>
                                        <TableCell>
                                        <Badge variant="secondary">{item.type}</Badge>
                                        </TableCell>
                                        <TableCell>{item.date && typeof item.date === 'object' && 'seconds' in item.date ? new Date((item.date as any).seconds * 1000).toLocaleDateString() : 'N/A'}</TableCell>
                                        <TableCell>
                                        <Badge variant={item.status === 'pending' ? 'destructive' : 'default'} className={item.status === 'resolved' ? 'bg-green-600' : ''}>
                                            {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal />
                                            </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            {item.status === 'pending' && (
                                                <DropdownMenuItem onClick={() => handleResolveFlag(item.id)}>
                                                <CheckCircle /> Mark as Resolved
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem asChild>
                                                <Link href={viewHref}>
                                                    <Book /> View Content
                                                </Link>
                                            </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )}
                            )}
                        </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                </section>
            </div>
        </main>
      </>
    </MainApp>
  );
}
