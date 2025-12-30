
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
import { MoreHorizontal, ShieldAlert, CheckCircle, Loader2, PlusCircle } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useFirestore } from '@/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import type { FlaggedContent } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MainApp from "@/components/main-app";
import { Header } from "@/components/header";


export default function AdminDashboard() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [flaggedContentSnapshot, flaggedContentLoading] = useCollection(collection(firestore, 'flags'));

  const [isReportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportType, setReportType] = useState<'book' | 'review'>('book');


  const flaggedContent = flaggedContentSnapshot?.docs.map(d => ({ id: d.id, ...d.data() } as FlaggedContent));

  const handleResolveFlag = async (id: string) => {
    try {
      await updateDoc(doc(firestore, 'flags', id), { status: 'resolved' });
      toast({ title: 'Flag Resolved', description: 'The content has been marked as resolved.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleAddReport = async () => {
    if (!reportTitle || !reportReason) {
        toast({ title: "Missing Information", description: "Please fill out all fields.", variant: "destructive"});
        return;
    }
    try {
        await addDoc(collection(firestore, 'flags'), {
            title: reportTitle,
            reason: reportReason,
            type: reportType,
            contentId: 'manual',
            status: 'pending',
            date: serverTimestamp(),
        });
        toast({ title: 'Report Added', description: 'The manual report has been created.' });
        setReportDialogOpen(false);
        setReportTitle('');
        setReportReason('');
    } catch (error: any) {
         toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  }

  if (flaggedContentLoading) {
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
                        <h1 className="font-headline text-5xl font-bold text-primary mb-2">Admin Dashboard</h1>
                        <p className="text-xl text-muted-foreground">Manage and review flagged content.</p>
                    </div>
                    <Dialog open={isReportDialogOpen} onOpenChange={setReportDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle />
                                Add Manual Report
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Manual Report</DialogTitle>
                                <DialogDescription>Manually flag content that needs review.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="report-title">Title</Label>
                                    <Input id="report-title" value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} placeholder="e.g., 'Inappropriate Book Cover'" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="report-type">Content Type</Label>
                                    <Select onValueChange={(v) => setReportType(v as any)} defaultValue={reportType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select content type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="book">Book</SelectItem>
                                            <SelectItem value="review">Review</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="report-reason">Reason</Label>
                                    <Textarea id="report-reason" value={reportReason} onChange={(e) => setReportReason(e.target.value)} placeholder="Describe the issue..." />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setReportDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleAddReport}>Submit Report</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </section>

                <section>
                <Card className="border rounded-lg bg-card/50">
                    <CardHeader>
                        <CardTitle>Flagged Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {flaggedContent && flaggedContent.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.title}</TableCell>
                                <TableCell>{item.reason}</TableCell>
                                <TableCell>
                                <Badge variant="secondary">{item.type}</Badge>
                                </TableCell>
                                <TableCell>{new Date((item.date as any).seconds * 1000).toLocaleDateString()}</TableCell>
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
                                    <DropdownMenuItem>
                                        <ShieldAlert /> View Content
                                    </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            ))}
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
