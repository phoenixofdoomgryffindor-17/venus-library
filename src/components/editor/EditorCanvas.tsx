
'use client';

import { EditorContent, type Editor } from '@tiptap/react';

// This component is now a pure "canvas" for the Tiptap editor.
// It doesn't contain any business logic, just the rendering surface.
// This separation of concerns prevents the editor from re-rendering
// when toolbar state changes.
export function EditorCanvas({ editor }: { editor: Editor | null }) {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-800 p-8 flex justify-center">
      <div 
        className="bg-card w-[816px] min-h-[1056px] shadow-lg rounded-sm p-24"
      >
        <EditorContent 
          editor={editor} 
          className="prose dark:prose-invert max-w-none prose-lg"
        />
      </div>
    </div>
  );
}
