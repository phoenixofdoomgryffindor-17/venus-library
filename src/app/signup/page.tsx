
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth, useFirestore, useRedirectIfAuthenticated } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/icons';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const signupSchema = z.object({
  displayName: z.string().min(1, { message: "Display name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function SignupPage() {
  const { loading } = useRedirectIfAuthenticated();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
    },
  });
  
  const { formState: { isSubmitting } } = form;

  const handleSignUp = async (values: z.infer<typeof signupSchema>) => {
    if (!auth || !firestore) {
        toast({
            variant: 'destructive',
            title: 'Sign-up failed',
            description: 'Firebase services are not ready. Please refresh and try again.',
        });
        throw new Error('Firebase not initialized');
    }
    
    try {
      const { user } = await createUserWithEmailAndPassword(auth, values.email, values.password);
      
      await Promise.all([
          updateProfile(user, { displayName: values.displayName }),
          setDoc(doc(firestore, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: values.displayName,
            photoURL: user.photoURL,
            bio: '',
            onboarded: false,
          })
      ]);

      toast({
        title: 'Account Created!',
        description: "You are now being redirected...",
      });
      router.push('/');

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign-up failed',
        description: error.code === 'auth/email-already-in-use' 
          ? 'An account with this email already exists.'
          : error.message,
      });
      throw error;
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
      <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl border bg-card shadow-2xl md:grid-cols-2">
        <div className="relative hidden items-center justify-center bg-primary/10 p-12 text-primary-foreground md:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-chart-1 via-chart-3 to-chart-5 opacity-20"></div>
          <div
            className="absolute inset-0 bg-no-repeat"
            style={{
              backgroundImage: `
                radial-gradient(circle at 15% 25%, hsl(var(--primary-foreground)) 0, transparent 20%),
                radial-gradient(circle at 85% 65%, hsl(var(--primary-foreground)) 0, transparent 25%)
              `,
              opacity: 0.05,
            }}
          ></div>
          <div className="relative z-10 w-full max-w-md text-center">
            <Logo className="mx-auto mb-6 h-16 w-16" />
            <h2 className="font-headline text-5xl font-bold">Create an Account</h2>
            <p className="mt-4 text-xl text-primary-foreground/80">
              Join our community of readers and writers and start your journey today.
            </p>
          </div>
        </div>
        <div className="z-10 p-8 md:p-12">
          <div className="mb-12">
            <h1 className="font-headline text-4xl font-bold">Get Started</h1>
            <p className="text-muted-foreground text-lg">Create your Venus Library account</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-6">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full font-bold" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'CREATING...' : 'CREATE ACCOUNT'}
              </Button>

              <p className="mt-8 pt-6 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
