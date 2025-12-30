
'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, ShieldCheck, User, Palette, MapPin, Phone } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <section className="mb-12">
                <h1 className="font-headline text-5xl font-bold text-primary mb-2">Settings</h1>
                <p className="text-xl text-muted-foreground">Manage your account and application preferences.</p>
            </section>
            
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User /> Profile</CardTitle>
                        <CardDescription>Manage your public profile, avatar, and personal details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/settings/profile" passHref>
                            <Button variant="outline">Edit Profile</Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MapPin /> Address</CardTitle>
                        <CardDescription>Manage your delivery and contact information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="region">Country / Region</Label>
                                <Input id="region" placeholder="e.g. United States" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Contact Number</Label>
                                <Input id="phone" type="tel" placeholder="For delivery updates" />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="address">Delivery Address</Label>
                            <Textarea id="address" placeholder="123 Main St, Anytown, USA 12345" />
                        </div>
                        <Button>Save Address</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Bell /> Notifications</CardTitle>
                        <CardDescription>Control how you receive notifications from Venus Library.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <Label htmlFor="email-notifications">Email Notifications</Label>
                            <Switch id="email-notifications" defaultChecked/>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <Label htmlFor="push-notifications">Push Notifications</Label>
                            <Switch id="push-notifications" />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <Label htmlFor="new-release-notifications">New Release Announcements</Label>
                            <Switch id="new-release-notifications" defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ShieldCheck /> Security & Privacy</CardTitle>
                        <CardDescription>Manage your account security.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <Button variant="outline">Change Password</Button>
                            <Button variant="destructive">Delete Account</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
