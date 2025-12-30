
'use client';
import { useFirestore } from '@/firebase';
import type { User } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import type { User as AppUser } from '@/lib/types';

export function useOnboarding(user: User | null) {
    const firestore = useFirestore();
    const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
    const [userData, loading] = useDocumentData(userDocRef);

    // If the document is still loading, we can't know if onboarding is needed, so return false.
    // The dialog will appear once loading is complete and needsOnboarding becomes true.
    const needsOnboarding = !loading && userData ? !(userData as AppUser).onboarded : false;

    return { userData: userData as AppUser | undefined, needsOnboarding, loading };
}
