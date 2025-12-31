
'use client';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { openCommandPalette } from "@/lib/palette-state";

interface StatusBarProps {
    pageNumber: number;
    totalPages: number;
    wordCount: number;
    charCount: number;
}

export function StatusBar({ pageNumber, totalPages, wordCount, charCount }: StatusBarProps) {
    return (
        <footer className="flex h-[32px] flex-shrink-0 items-center justify-between border-t border-border bg-card px-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
                <span>Page {pageNumber} of {totalPages}</span>
            </div>
            <div className="flex-1" />
            <div className="flex gap-4">
                <span>{wordCount} words</span>
                <span>{charCount} characters</span>
            </div>
             <div className="flex-1 flex justify-end">
                <Button variant="ghost" size="sm" className="h-auto py-0.5" onClick={openCommandPalette}>
                    <Search className="mr-2 h-3 w-3" />
                    Commands...
                </Button>
            </div>
        </footer>
    );
}
