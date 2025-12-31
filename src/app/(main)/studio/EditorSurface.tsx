
'use client';

import { EditorContent, type Editor } from '@tiptap/react';

// This component is a pure "canvas" for the Tiptap editor.
// It contains no business logic, only the rendering surface.
// This separation of concerns prevents the editor from re-rendering
// unnecessarily when other UI elements (like the toolbar) update.
export default function EditorSurface({ editor }: { editor: Editor | null }) {
  return (
    // This outer container provides the scrolling background and centers the "page".
    // `overflow-y-auto` ensures this is the ONLY vertically scrolling element in the shell.
    <div className="h-full w-full overflow-y-auto p-8">
      {/* This div represents the physical page with a fixed width and paper-like appearance. */}
      <div 
        className="mx-auto bg-card w-[816px] min-h-[1056px] shadow-lg rounded-sm p-24"
      >
        <EditorContent 
          editor={editor} 
          // The `prose` classes from Tailwind Typography provide sensible defaults for styling the editor content.
          className="prose dark:prose-invert max-w-none prose-lg"
        />
      </div>
    </div>
  );
}
