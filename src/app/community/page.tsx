
'use client';
import MainApp from "@/components/main-app";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, BookHeart } from "lucide-react";
import { Header } from "@/components/header";

export default function CommunityPage() {
    return (
        <MainApp>
            <>
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <section className="text-center mb-12">
                        <h1 className="font-headline text-5xl font-bold text-primary mb-2">Join the Conversation</h1>
                        <p className="text-xl text-muted-foreground">Connect with fellow readers and writers.</p>
                    </section>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="text-primary"/>
                                    Discussion Forums
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Dive into discussions about your favorite books, genres, and characters. Share your theories and read what others are thinking.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookHeart className="text-primary"/>
                                    Book Clubs
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Join a book club or start your own! A great way to discover new books and make friends.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="text-primary"/>
                                    Writing Groups
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Get feedback on your work, participate in writing challenges, and connect with other aspiring authors.</p>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </>
        </MainApp>
    );
}
