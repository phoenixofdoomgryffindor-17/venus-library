
"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Edit } from "lucide-react";

export default function EditButton({ bookId }: { bookId: string }) {
  const router = useRouter();

  const startEdit = () => {
    // Navigate directly to the studio page.
    // The page itself will handle its own loading state.
    router.push(`/author/studio/${bookId}`);
  };

  return (
    <Button variant="outline" size="sm" onClick={startEdit}>
      <Edit /> Edit
    </Button>
  );
}
