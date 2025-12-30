
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useAuth, useRedirectIfAuthenticated } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/icons';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required." }),
});

const passwordResetSchema = z.object({
  resetEmail: z.string().email(),
});

export default function LoginPage() {
  const { loading } = useRedirectIfAuthenticated();
  const [isResetting, setIsResetting] = useState(false);
  const [isForgotDialogOpen, setForgotDialogOpen] = useState(false);

  const auth = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const { formState: { isSubmitting } } = form;

  const passwordResetForm = useForm({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: { resetEmail: '' },
  });

  const handleSignIn = async (values: z.infer<typeof loginSchema>) => {
    if (!auth) return;
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign-in failed',
        description: 'Invalid email or password.',
      });
    }
  };

  const handlePasswordReset = async (values: any) => {
    if (!auth) return;
    setIsResetting(true);
    try {
      await sendPasswordResetEmail(auth, values.resetEmail);
      toast({ title: 'Reset email sent' });
      setForgotDialogOpen(false);
      passwordResetForm.reset();
    } catch(error: any) {
        toast({
            variant: 'destructive',
            title: 'Failed to send email',
            description: error.message,
        });
    } finally {
      setIsResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="box-border flex min-h-screen items-center justify-center px-6 py-10 md:px-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border bg-card shadow-2xl md:grid-cols-2">
        
        {/* LEFT */}
        <div className="p-8 md:p-12">
          <h1 className="text-4xl font-bold">Hello!</h1>
          <p className="mb-10 text-muted-foreground">Sign in to your account</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-6">
              <FormField name="email" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="password" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl><Input type="password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                SIGN IN
              </Button>

              <p className="text-center text-sm">
                Don’t have an account? <Link href="/signup" className="text-primary">Create</Link>
              </p>
            </form>
          </Form>
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center justify-center bg-primary/10 p-12">
          <div className="text-center">
            <Logo className="mx-auto mb-6 h-16 w-16" />
            <h2 className="text-5xl font-bold">Welcome Back!</h2>
            <p className="mt-4 text-lg opacity-80">
              Your next adventure is just a page away.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
