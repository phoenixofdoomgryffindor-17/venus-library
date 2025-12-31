
'use client';
import MainApp from "@/components/main-app";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, HelpCircle, BookUser, Settings, ShieldQuestion } from "lucide-react";
import { Header } from "@/components/header";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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
                        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">We're here to help. Find answers to common questions or get in touch with our support team.</p>
                    </section>

                    <div className="space-y-16">
                        <section className="max-w-4xl mx-auto">
                            <div className="flex items-center gap-3 mb-8">
                                <HelpCircle className="w-8 h-8 text-primary" />
                                <h2 className="font-headline text-4xl font-semibold">Frequently Asked Questions</h2>
                            </div>
                            <Accordion type="single" collapsible className="w-full text-lg space-y-2">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="hover:no-underline text-left text-xl font-medium"><BookUser className="mr-3 text-primary"/>How do I publish my book?</AccordionTrigger>
                                    <AccordionContent className="text-base text-foreground/80 pl-10">
                                        From your Author Dashboard, you can manage all your books. Once a book has at least one chapter, a "Publish" button will appear. After a quick automated check for inappropriate content, your book will go live on the marketplace.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="hover:no-underline text-left text-xl font-medium"><Settings className="mr-3 text-primary"/>Can I change my username or email?</AccordionTrigger>
                                    <AccordionContent className="text-base text-foreground/80 pl-10">
                                        You can change your public display name at any time from your Profile Settings. However, the email address associated with your account cannot be changed for security reasons.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger className="hover:no-underline text-left text-xl font-medium"><ShieldQuestion className="mr-3 text-primary"/>What is your content policy?</AccordionTrigger>
                                    <AccordionContent className="text-base text-foreground/80 pl-10">
                                        We prohibit content that is hateful, sexually explicit, or promotes dangerous activities. All content submitted for publication is scanned by an AI moderation tool, and may be flagged for manual review by our team if it violates our policies.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </section>
                        
                        <Separator />

                        <section className="max-w-4xl mx-auto">
                            <Card className="bg-card/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <Mail className="w-8 h-8 text-primary" />
                                        <span className="font-headline text-4xl font-semibold">Contact Us</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form className="space-y-4">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Your Name</Label>
                                                <Input id="name" placeholder="John Doe" className="bg-background"/>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Your Email</Label>
                                                <Input id="email" type="email" placeholder="john.d@example.com" className="bg-background"/>
                                            </div>
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="subject">Subject</Label>
                                            <Input id="subject" placeholder="e.g., Issue with book publishing" className="bg-background"/>
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="message">How can we help you?</Label>
                                            <Textarea id="message" placeholder="Please describe your issue in detail..." className="bg-background min-h-[120px]"/>
                                        </div>
                                        <Button className="w-full h-12 text-lg font-bold">Send Message</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </section>
                    </div>
                </main>
            </>
        </MainApp>
    );
}
