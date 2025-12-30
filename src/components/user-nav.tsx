
"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth, useUser, useFirestore } from "@/firebase";
import { signOut } from "firebase/auth";
import { doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Building,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useDocumentData } from "react-firebase-hooks/firestore";
import "react-image-crop/dist/ReactCrop.css";
import type { SchoolCode } from "@/lib/types";

export function UserNav() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const firestore = useFirestore();

  const userDocRef = user ? doc(firestore, "users", user.uid) : null;
  const [appUser] = useDocumentData(userDocRef);

  const schoolCode = appUser?.schoolCode;
  const [schoolData] = useDocumentData(
    schoolCode ? doc(firestore, "schoolCodes", schoolCode) : null
  );

  if (loading || !user) return null;

  return (
    <div className="p-1 rounded-full glass">
      <Popover>
        <PopoverTrigger asChild>
          <button>
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.photoURL ?? undefined} />
              <AvatarFallback className="bg-primary/50 text-foreground">
                {user.displayName?.[0] ?? "U"}
              </AvatarFallback>
            </Avatar>
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-64 mb-2 glass">
          <p className="font-medium">{user.displayName}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>

          {schoolData && (
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Building className="mr-1 h-3 w-3" />
              <span>{(schoolData as SchoolCode).schoolName}</span>
            </div>
          )}

          <Separator className="my-2 bg-border/50" />

          <Button
            variant="ghost"
            className="w-full justify-start text-popover-foreground hover:bg-accent/50"
            onClick={async () => {
              await signOut(auth);
              router.push("/login");
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
