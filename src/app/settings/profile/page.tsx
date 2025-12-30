
'use client';

import { useState, useRef, type ChangeEvent, useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useAuth, useUser, useFirestore, useStorage, useRequireUser } from "@/firebase";
import {
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  doc,
  setDoc,
  deleteField,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  Loader2,
  Mail,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDocumentData } from "react-firebase-hooks/firestore";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ALL_GENRES = [
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Thriller",
  "Romance",
  "Horror",
  "Historical Fiction",
  "Non-Fiction",
];


export default function ProfileSettingsPage() {
  const { user, loading: userLoading } = useRequireUser();
  const firestore = useFirestore();
  const storage = useStorage();
  const auth = useAuth();
  const { toast } = useToast();

  const userDocRef = user ? doc(firestore, "users", user.uid) : null;
  const [appUser, appUserLoading] = useDocumentData(userDocRef);

  /* -------- Profile State -------- */
  const [bio, setBio] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);
  const [readingGoals, setReadingGoals] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [displayName, setDisplayName] = useState("");


  /* -------- Avatar State -------- */
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  /* -------- Password Reset -------- */
  const [resetEmail, setResetEmail] = useState("");
  const [sendingReset, setSendingReset] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
        setDisplayName(user.displayName || "");
        setResetEmail(user.email || "");
    }
    if (appUser) {
      setBio(appUser.bio ?? "");
      setAge(appUser.age ?? "");
      setFavoriteGenres(appUser.favoriteGenres ?? []);
      setReadingGoals(appUser.readingGoals ?? "");
      setSchoolCode(appUser.schoolCode ?? "");
    }
  }, [user, appUser]);

  /* -------- Avatar Save -------- */
  const saveAvatar = async () => {
    if (!user || !imgRef.current || !crop?.width || !crop?.height || !storage) return;

    setLoadingAvatar(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(
        imgRef.current,
        crop.x ?? 0,
        crop.y ?? 0,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.9)
      );

      const avatarRef = ref(storage, `avatars/${user.uid}.jpg`);
      await uploadBytes(avatarRef, blob);

      const photoURL = `${await getDownloadURL(avatarRef)}?t=${Date.now()}`;

      await Promise.all([
        updateProfile(user, { photoURL }),
        setDoc(
          doc(firestore, "users", user.uid),
          { photoURL },
          { merge: true }
        ),
      ]);

      await auth.currentUser?.reload();
      toast({ title: "Avatar saved" });
      setImgSrc("");
    } catch (e) {
      toast({ variant: "destructive", title: "Avatar upload failed" });
    } finally {
      setLoadingAvatar(false);
    }
  };

  /* -------- Password Reset -------- */
  const handlePasswordReset = async () => {
    if (!resetEmail) return;

    setSendingReset(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast({
        title: "Password reset sent",
        description: "Check your email inbox",
      });
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Failed to send email",
        description: e.message,
      });
    } finally {
      setSendingReset(false);
    }
  };

  /* -------- Save Profile -------- */
  const saveProfile = async () => {
     if (!user) return;
    setIsSaving(true);

    try {
        const data: any = {
        bio,
        age: age === "" ? deleteField() : Number(age),
        favoriteGenres,
        readingGoals,
        onboarded: true,
        displayName: displayName,
        };

        if (schoolCode && schoolCode !== appUser?.schoolCode) {
        const q = query(
            collection(firestore, "schoolCodes"),
            where("code", "==", schoolCode)
        );
        const snap = await getDocs(q);
        if (snap.empty) {
            toast({
            variant: "destructive",
            title: "Invalid school code",
            });
            setIsSaving(false);
            return;
        }
        data.schoolCode = schoolCode;
        }

        await updateProfile(user, { displayName });
        await setDoc(doc(firestore, "users", user.uid), data, { merge: true });
        
        toast({ title: "Profile saved" });

    } catch (e: any) {
        toast({ title: "Error saving profile", description: e.message, variant: 'destructive'});
    } finally {
        setIsSaving(false);
    }
  };

  if (userLoading || appUserLoading) {
      return (
          <div className="flex h-96 items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      )
  }

  if (!user) {
      return null;
  }

  return (
    <div className="space-y-8">
        <section>
            <h1 className="font-headline text-5xl font-bold text-primary mb-2">Edit Profile</h1>
            <p className="text-xl text-muted-foreground">Manage your public profile and account settings.</p>
        </section>

        <Card>
            <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Upload a new avatar.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                 <Avatar className="h-24 w-24">
                    <AvatarImage src={user.photoURL ?? undefined} />
                    <AvatarFallback>{displayName?.[0]}</AvatarFallback>
                </Avatar>

                 <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) =>
                    e.target.files &&
                    setImgSrc(URL.createObjectURL(e.target.files[0]))
                    }
                />
                
                {imgSrc && (
                    <div className="w-full max-w-sm">
                        <ReactCrop crop={crop} onChange={setCrop} aspect={1} circularCrop>
                            <img ref={imgRef} src={imgSrc} alt="Crop preview" style={{maxHeight: '400px'}}/>
                        </ReactCrop>
                    </div>
                 )}

            </CardContent>
            <CardFooter className="justify-center gap-2">
                 <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    >
                    Choose Image
                </Button>
                {imgSrc && (
                    <Button onClick={saveAvatar} disabled={loadingAvatar}>
                    {loadingAvatar ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        "Save Avatar"
                    )}
                    </Button>
                )}
            </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your public profile details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                        id="bio"
                        placeholder="Tell us a little about yourself..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                     <Input
                        id="age"
                        type="number"
                        placeholder="Your age"
                        value={age}
                        onChange={(e) =>
                            setAge(e.target.value === "" ? "" : Number(e.target.value))
                        }
                        />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Tell us what you love to read.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label>Favorite Genres</Label>
                    <div className="flex flex-wrap gap-2">
                        {ALL_GENRES.map((g) => (
                        <Button
                            key={g}
                            size="sm"
                            variant={favoriteGenres.includes(g) ? "default" : "outline"}
                            onClick={() =>
                            setFavoriteGenres((p) =>
                                p.includes(g) ? p.filter((x) => x !== g) : [...p, g]
                            )
                            }
                        >
                            {g}
                        </Button>
                        ))}
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="reading-goals">Reading Goals</Label>
                    <Textarea
                        id="reading-goals"
                        placeholder="e.g., 'Read 50 books this year'"
                        value={readingGoals}
                        onChange={(e) => setReadingGoals(e.target.value)}
                        />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="school-code">School / Enterprise Code</Label>
                    <Input
                        id="school-code"
                        placeholder="Enter code if applicable"
                        value={schoolCode}
                        onChange={(e) => setSchoolCode(e.target.value)}
                        />
                </div>
                <div className="space-y-2">
                    <Label>Reset Password</Label>
                    <div className="flex gap-2">
                        <Input
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="Email"
                        />
                        <Button
                        variant="outline"
                        onClick={handlePasswordReset}
                        disabled={sendingReset}
                        >
                        {sendingReset ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Reset Link
                            </>
                        )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-end">
             <Button onClick={saveProfile} disabled={isSaving} size="lg">
                {isSaving ? <Loader2 className="animate-spin" /> : 'Save All Changes'}
            </Button>
        </div>
    </div>
  );
}
