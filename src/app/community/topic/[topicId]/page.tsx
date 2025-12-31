
'use client';

import { useParams } from "next/navigation";
import MainApp from "@/components/main-app";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, MessageCircle, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Dummy data for topics and comments
const forumTopics = [
    {
        id: 1,
        title: "Character Development Workshop: Creating Believable Villains",
        author: "Alex Grimm",
        authorAvatar: "https://i.pravatar.cc/150?u=alex",
        category: "Writing Craft",
        likes: 128,
        commentsCount: 42,
        timestamp: "2 days ago",
        content: "<p>Let's talk about villains. A great story often has a great antagonist. What are your techniques for creating villains that are more than just a cardboard cutout of 'evil'? How do you give them depth, motivation, and maybe even a hint of sympathy?</p><p>I find that giving my villain a justifiable, albeit twisted, goal is a great starting point. For example, a villain who wants to bring order to a chaotic world, but whose methods are tyrannical. What about you all?</p>",
    },
    {
        id: 2,
        title: "World-building: How do you map out your fantasy worlds?",
        author: "Lyra Meadowlight",
        authorAvatar: "https://i.pravatar.cc/150?u=lyra",
        category: "World-Building",
        likes: 98,
        commentsCount: 67,
        timestamp: "5 days ago",
        content: "<p>I'm starting a new epic fantasy series and feeling a bit overwhelmed with the world-building. Do you start with a map? Or do you focus on the cultures and lore first? What tools (digital or otherwise) do you find most helpful?</p><p>I've tried tools like Inkarnate for maps, but I'm curious if anyone has a good system for tracking timelines, character lineages, and political systems. Any advice would be appreciated!</p>",
    },
    {
        id: 3,
        title: "Sci-Fi Readers: What's the most mind-bending concept you've read recently?",
        author: "Jax Vector",
        authorAvatar: "https://i.pravatar.cc/150?u=jax",
        category: "Book Discussions",
        likes: 204,
        commentsCount: 112,
        timestamp: "1 day ago",
        content: "<p>Just finished 'The Three-Body Problem' and my mind is still reeling. The idea of the Sophons is one of the most terrifying and brilliant concepts I've ever encountered in sci-fi.</p><p>It got me thinking: what other books have introduced concepts that genuinely made you pause and rethink everything? Looking for recommendations that will bend my brain!</p>",
    }
];

const comments = [
    { id: 1, topicId: 1, author: "Elena Vance", authorAvatar: "https://i.pravatar.cc/150?u=elena", likes: 15, content: "I agree! A villain who is the hero of their own story is always more compelling. I try to write a one-page summary from the villain's perspective to get into their head." },
    { id: 2, topicId: 1, author: "Markus Blackwood", authorAvatar: "https://i.pravatar.cc/150?u=markus", likes: 8, content: "A good technique is the 'mirror villain' – a character who is what the hero could have become if they made different choices. It creates a great internal conflict for the protagonist." },
    { id: 3, topicId: 2, author: "Faelan", authorAvatar: "https://i.pravatar.cc/150?u=faelan", likes: 22, content: "I always start with the map. The geography of the world dictates the climate, resources, and where civilizations would logically form. From there, I build out the cultures." },
    { id: 4, topicId: 3, author: "Cyber-Reader", authorAvatar: "https://i.pravatar.cc/150?u=cyber", likes: 31, content: "If you liked The Three-Body Problem, you have to read 'Blindsight' by Peter Watts. The nature of consciousness it explores is a total trip." }
];

export default function TopicPage() {
    const params = useParams();
    const topicId = Number(params.topicId);
    const topic = forumTopics.find(t => t.id === topicId);
    const topicComments = comments.filter(c => c.topicId === topicId);

    if (!topic) {
        notFound();
    }

    return (
        <MainApp>
            <>
                <Header />
                <main className="container mx-auto px-4 py-8 max-w-4xl">
                    <div className="mb-8">
                        <Button variant="ghost" asChild>
                            <Link href="/community">
                                <ArrowLeft className="mr-2" />
                                Back to All Topics
                            </Link>
                        </Button>
                    </div>

                    <Card className="bg-card/50">
                        <CardHeader>
                            <p className="text-sm text-primary font-semibold">{topic.category}</p>
                            <CardTitle className="text-3xl font-bold font-headline">{topic.title}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={topic.authorAvatar} />
                                        <AvatarFallback>{topic.author.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span>{topic.author}</span>
                                </div>
                                <span>&middot;</span>
                                <span>{topic.timestamp}</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-invert prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: topic.content }} />
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                            <div className="flex items-center gap-6 text-muted-foreground">
                                <Button variant="ghost" className="flex items-center gap-2">
                                    <ThumbsUp />
                                    <span>{topic.likes}</span>
                                </Button>
                                <div className="flex items-center gap-2">
                                    <MessageCircle />
                                    <span>{topic.commentsCount} Comments</span>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>

                    <Separator className="my-10" />

                    <div className="space-y-6">
                        <h2 className="font-headline text-3xl font-semibold">Comments</h2>
                        {topicComments.map(comment => (
                             <Card key={comment.id} className="bg-card/30">
                                <CardContent className="p-6 flex gap-4 items-start">
                                    <Avatar>
                                        <AvatarImage src={comment.authorAvatar} />
                                        <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold">{comment.author}</p>
                                            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground">
                                                <ThumbsUp className="h-4 w-4" />
                                                <span>{comment.likes}</span>
                                            </Button>
                                        </div>
                                        <p className="mt-2 text-foreground/90">{comment.content}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Separator className="my-10" />

                    <div>
                        <h3 className="font-headline text-2xl font-semibold mb-4">Join the discussion</h3>
                        <Card className="bg-card/50">
                            <CardContent className="p-6">
                                <div className="grid w-full gap-4">
                                    <Textarea placeholder="Type your comment here." className="bg-background min-h-[120px]" />
                                    <Button>
                                        <Send className="mr-2" />
                                        Post Comment
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </main>
            </>
        </MainApp>
    )
}
