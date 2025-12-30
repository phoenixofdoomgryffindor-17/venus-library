
'use client';
import MainApp from "@/components/main-app";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, HelpCircle } from "lucide-react";
import { Header } from "@/components/header";

export default function SupportPage() {
    return (
        <MainApp>
            <>
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <section className="text-center mb-16">
                        <h1 className="font-headline text-6xl md:text-7xl font-extrabold text-foreground mb-4 tracking-tighter welcome-text">
                            Support Center
                        </h1>
                        <p className="text-xl text-foreground/80">How can we help you today?</p>
                    </section>

                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <HelpCircle className="w-8 h-8 text-primary" />
                                <h2 className="font-headline text-4xl font-semibold">Frequently Asked Questions</h2>
                            </div>
                            <Accordion type="single" collapsible className="w-full text-lg">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="hover:no-underline text-left">How do I publish my book?</AccordionTrigger>
                                    <AccordionContent className="text-base text-foreground/80">
                                        From your Author Dashboard, you can manage your books. Once you've finished writing and editing, you can hit the "Publish" button to make it live on the marketplace.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="hover:no-underline text-left">Can I change my username?</AccordionTrigger>
                                    <AccordionContent className="text-base text-foreground/80">
                                        Currently, display names can be changed from the "Edit Profile" menu, but your core username cannot be changed.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger className="hover:no-underline text-left">How does the AI book cover generation work?</AccordionTrigger>
                                    <AccordionContent className="text-base text-foreground/80">
                                        Our AI uses your book's title, genre, and a prompt you provide to generate a unique book cover. You can find this tool in the Author Studio.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Mail className="w-8 h-8 text-primary" />
                                <h2 className="font-headline text-4xl font-semibold">Contact Us</h2>
                            </div>
                            <Card className="bg-card/50">
                                <CardContent className="pt-6">
                                    <form className="space-y-4">
                                        <Input placeholder="Your Name" className="bg-primary/10 border-primary/20 h-12 text-base"/>
                                        <Input type="email" placeholder="Your Email" className="bg-primary/10 border-primary/20 h-12 text-base"/>
                                        <Textarea placeholder="How can we help you?" className="bg-primary/10 border-primary/20 text-base min-h-[120px]"/>
                                        <Button className="w-full h-12 text-lg font-bold">Send Message</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </>
        </MainApp>
    );
}
