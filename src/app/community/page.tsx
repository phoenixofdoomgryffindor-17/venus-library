
'use client';
import MainApp from "@/components/main-app";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Users, MessageSquare, BookHeart, PlusCircle, ThumbsUp, MessageCircle } from "lucide-react";
import { Header } from "@/components/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const forumTopics = [
    {
        id: 1,
        title: "Character Development Workshop: Creating Believable Villains",
        author: "Alex Grimm",
        authorAvatar: "https://i.pravatar.cc/150?u=alex",
        category: "Writing Craft",
        likes: 128,
        comments: 42,
    },
    {
        id: 2,
        title: "World-building: How do you map out your fantasy worlds?",
        author: "Lyra Meadowlight",
        authorAvatar: "https://i.pravatar.cc/150?u=lyra",
        category: "World-Building",
        likes: 98,
        comments: 67,
    },
    {
        id: 3,
        title: "Sci-Fi Readers: What's the most mind-bending concept you've read recently?",
        author: "Jax Vector",
        authorAvatar: "https://i.pravatar.cc/150?u=jax",
        category: "Book Discussions",
        likes: 204,
        comments: 112,
    }
]

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

                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="font-headline text-3xl font-semibold">Hot Topics</h2>
                                <Button>
                                    <PlusCircle /> Start a New Discussion
                                </Button>
                            </div>
                            
                            <Card className="bg-card/50">
                                <CardContent className="p-0">
                                    <ul className="divide-y divide-border">
                                        {forumTopics.map(topic => (
                                            <li key={topic.id} className="p-6 hover:bg-muted/30 transition-colors">
                                                <div className="flex items-start gap-4">
                                                    <Avatar>
                                                        <AvatarImage src={topic.authorAvatar} />
                                                        <AvatarFallback>{topic.author.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <p className="text-xs text-primary font-semibold">{topic.category}</p>
                                                        <h3 className="font-semibold text-lg text-foreground hover:text-primary cursor-pointer">{topic.title}</h3>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            Started by {topic.author}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-6 text-muted-foreground text-sm mt-1">
                                                         <div className="flex items-center gap-2">
                                                            <ThumbsUp className="h-4 w-4" />
                                                            <span>{topic.likes}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MessageCircle className="h-4 w-4" />
                                                            <span>{topic.comments}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-6">
                            <h2 className="font-headline text-3xl font-semibold">Community Groups</h2>
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
                                <CardFooter>
                                    <Button variant="outline" className="w-full">Browse Clubs</Button>
                                </CardFooter>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="text-primary"/>
                                        Writing Groups
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Get feedback on your work, participate in writing challenges, and connect with other authors.</p>
                                </CardContent>
                                 <CardFooter>
                                    <Button variant="outline" className="w-full">Find a Group</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </main>
            </>
        </MainApp>
    );
}
