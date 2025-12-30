
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';

// This component is now a basic wrapper and doesn't include the toolbar.
// The real editing surface will be handled by EditorCanvas.
const Tiptap = ({ content, onUpdate }: { content: string, onUpdate: (content: string) => void }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextStyle,
      Color,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content,
    editorProps: {
        attributes: {
            class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none flex-grow',
        },
    },
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className='flex flex-col flex-1'>
      <EditorContent editor={editor} className='flex-1 overflow-y-auto p-4'/>
    </div>
  );
};

export default Tiptap;
