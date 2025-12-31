
'use client';
import MainApp from "@/components/main-app";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Users, BookOpen, PlusCircle } from "lucide-react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const bookClubs = [
    {
        id: 1,
        name: "The Sci-Fi Syndicate",
        description: "Exploring the far reaches of the galaxy, one book at a time. From classic Asimov to modern masters.",
        members: 142,
        currentRead: "Dune",
        coverUrl: "https://picsum.photos/seed/dune/400/600",
        coverHint: "science fiction desert"
    },
    {
        id: 2,
        name: "Fantasy Fellowship",
        description: "For lovers of high fantasy, epic quests, and magical realms. Dragons, elves, and adventure await!",
        members: 218,
        currentRead: "The Name of the Wind",
        coverUrl: "https://picsum.photos/seed/fantasy-wind/400/600",
        coverHint: "fantasy wind"
    },
    {
        id: 3,
        name: "Mystery Solvers Inc.",
        description: "Don your detective hat and join us as we solve thrilling mysteries and chilling crimes.",
        members: 95,
        currentRead: "And Then There Were None",
        coverUrl: "https://picsum.photos/seed/mystery-island/400/600",
        coverHint: "mystery island"
    },
     {
        id: 4,
        name: "Historical Readers Guild",
        description: "Journey through time and explore different eras with our selection of historical fiction and non-fiction.",
        members: 112,
        currentRead: "Wolf Hall",
        coverUrl: "https://picsum.photos/seed/wolf-hall/400/600",
        coverHint: "tudor court"
    }
];

export default function ClubsPage() {
    return (
        <MainApp>
            <>
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <section className="flex justify-between items-center mb-12">
                        <div>
                            <h1 className="font-headline text-5xl font-bold text-primary mb-2">Book Clubs</h1>
                            <p className="text-xl text-muted-foreground">Find your community and your next great read.</p>
                        </div>
                        <Button size="lg">
                            <PlusCircle />
                            Start a New Club
                        </Button>
                    </section>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {bookClubs.map(club => (
                            <Card key={club.id} className="bg-card/50 flex flex-col">
                                <CardHeader>
                                    <CardTitle>{club.name}</CardTitle>
                                    <CardDescription className="flex items-center gap-2 pt-1"><Users className="h-4 w-4" /> {club.members} members</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-4">
                                    <p className="text-muted-foreground text-sm">{club.description}</p>
                                    <div className="flex gap-4 items-center bg-muted/50 p-3 rounded-lg">
                                        <div className="w-16 flex-shrink-0">
                                            <Image 
                                                src={club.coverUrl}
                                                alt={`Cover for ${club.currentRead}`}
                                                width={64}
                                                height={96}
                                                className="rounded-md object-cover shadow-md"
                                                data-ai-hint={club.coverHint}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase font-semibold text-muted-foreground">Currently Reading</p>
                                            <p className="font-bold text-foreground">{club.currentRead}</p>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full">
                                        <BookOpen />
                                        Join Club
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </main>
            </>
        </MainApp>
    );
}
