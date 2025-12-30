
'use client';

import type { Editor } from '@tiptap/react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Pilcrow,
  Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Palette, Eraser, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  MessageSquare, BookImage, Minus, Footprints, List, ListOrdered, Code, Quote,
  Undo, Redo, ClipboardPaste, Copy, ClipboardCopy, Search, Replace,
  Wand2, BrainCircuit, User, Drama, FileText, Type, Image as AiImage, FileAudio, Settings, Search as AiSearch, Feather, BarChart,
  Home, Edit, Layout, BookOpen, Bot, Ruler, Maximize, Mic, File, SquarePlus
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from './ui/textarea';
import { Loader2 } from 'lucide-react';
import { PluginManager } from '@/components/plugins/PluginManager';

const ToolbarButton = ({ tooltip, onClick, children, isActive, disabled }: { tooltip: string, onClick?: () => void, children: React.ReactNode, isActive?: boolean, disabled?: boolean}) => (
  <TooltipProvider delayDuration={100}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isActive ? 'secondary' : 'ghost'}
          size="sm"
          className="h-auto p-2"
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const ToolbarGroup = ({ children, title }: { children: React.ReactNode, title?: string }) => (
    <div className="flex flex-col items-center space-y-1 border-r border-border pr-4 pl-1 mr-4 py-1">
        <div className="flex items-center space-x-1">
            {children}
        </div>
        {title && <span className="text-[10px] text-muted-foreground">{title}</span>}
    </div>
);

// AI Card component
const AiFeatureCard = ({ title, icon, children }: {title: string, icon: React.ReactNode, children: React.ReactNode}) => (
    <div className="p-4 border rounded-lg bg-card/80 w-80 flex-shrink-0">
        <h4 className="font-semibold text-base flex items-center gap-2 mb-3">{icon}{title}</h4>
        <div className="space-y-2">
          {children}
        </div>
    </div>
)


const EditorToolbar = ({ editor, aiTools }: { editor: Editor | null, aiTools: any }) => {
  // Mock editor for layouting if null
  const dummyEditor = { chain: () => ({ focus: () => ({ toggleBold: () => ({ run: () => {} }), toggleItalic: () => ({ run: () => {} }), toggleUnderline: () => ({ run: () => {} }), toggleStrike: () => ({ run: () => {} }), setTextAlign: () => ({ run: () => {} }), toggleHeading: () => ({ run: () => {} }), toggleBlockquote: () => ({ run: () => {} }), toggleCodeBlock: () => ({ run: () => {} }) }) }), isActive: () => false };
  const e = editor || dummyEditor;

  return (
    <div className="h-[96px] p-2 border-b bg-surface border-border flex-shrink-0 flex flex-col">
      <Tabs defaultValue="home" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-6 bg-transparent p-0 h-8">
          <TabsTrigger value="home"><Home className="mr-2"/> Home</TabsTrigger>
          <TabsTrigger value="insert"><SquarePlus className="mr-2"/> Insert</TabsTrigger>
          <TabsTrigger value="layout"><Layout className="mr-2"/> Layout</TabsTrigger>
          <TabsTrigger value="review"><BookOpen className="mr-2"/> Review</TabsTrigger>
          <TabsTrigger value="ai"><Bot className="mr-2"/> AI</TabsTrigger>
          <TabsTrigger value="view"><Maximize className="mr-2"/> View</TabsTrigger>
        </TabsList>

        <div className="flex-1 mt-1">
            <TabsContent value="home" className="pt-2 flex items-center h-full m-0">
                <ToolbarGroup title="Clipboard">
                    <ToolbarButton tooltip="Paste" disabled><ClipboardPaste/></ToolbarButton>
                    <ToolbarButton tooltip="Cut" disabled><ClipboardCopy/></ToolbarButton>
                    <ToolbarButton tooltip="Copy" disabled><Copy/></ToolbarButton>
                </ToolbarGroup>
                 <ToolbarGroup title="Editing">
                    <ToolbarButton tooltip="Undo" disabled><Undo/></ToolbarButton>
                    <ToolbarButton tooltip="Redo" disabled><Redo/></ToolbarButton>
                </ToolbarGroup>
                <ToolbarGroup title="Font">
                    <ToolbarButton tooltip="Bold" onClick={() => e.chain().focus().toggleBold().run()} isActive={e.isActive('bold')}><Bold /></ToolbarButton>
                    <ToolbarButton tooltip="Italic" onClick={() => e.chain().focus().toggleItalic().run()} isActive={e.isActive('italic')}><Italic /></ToolbarButton>
                    <ToolbarButton tooltip="Underline" onClick={() => e.chain().focus().toggleUnderline().run()} isActive={e.isActive('underline')}><UnderlineIcon /></ToolbarButton>
                    <ToolbarButton tooltip="Strikethrough" onClick={() => e.chain().focus().toggleStrike().run()} isActive={e.isActive('strike')}><Strikethrough /></ToolbarButton>
                </ToolbarGroup>
                <ToolbarGroup title="Paragraph">
                    <ToolbarButton tooltip="Align Left" onClick={() => e.chain().focus().setTextAlign('left').run()} isActive={e.isActive({ textAlign: 'left' })}><AlignLeft /></ToolbarButton>
                    <ToolbarButton tooltip="Center" onClick={() => e.chain().focus().setTextAlign('center').run()} isActive={e.isActive({ textAlign: 'center' })}><AlignCenter /></ToolbarButton>
                    <ToolbarButton tooltip="Align Right" onClick={() => e.chain().focus().setTextAlign('right').run()} isActive={e.isActive({ textAlign: 'right' })}><AlignRight /></ToolbarButton>
                    <ToolbarButton tooltip="Justify" onClick={() => e.chain().focus().setTextAlign('justify').run()} isActive={e.isActive({ textAlign: 'justify' })}><AlignJustify /></ToolbarButton>
                </ToolbarGroup>
                <ToolbarGroup title="Styles">
                     <ToolbarButton tooltip="Heading 1" onClick={() => e.chain().focus().toggleHeading({ level: 1 }).run()} isActive={e.isActive('heading', { level: 1 })}><Heading1 /></ToolbarButton>
                     <ToolbarButton tooltip="Heading 2" onClick={() => e.chain().focus().toggleHeading({ level: 2 }).run()} isActive={e.isActive('heading', { level: 2 })}><Heading2 /></ToolbarButton>
                     <ToolbarButton tooltip="Quote" onClick={() => e.chain().focus().toggleBlockquote().run()} isActive={e.isActive('blockquote')}><Quote /></ToolbarButton>
                     <ToolbarButton tooltip="Code" onClick={() => e.chain().focus().toggleCodeBlock().run()} isActive={e.isActive('codeBlock')}><Code /></ToolbarButton>
                </ToolbarGroup>
            </TabsContent>
            
            <TabsContent value="insert" className="pt-2 flex items-center h-full m-0">
                <ToolbarGroup title="Structure">
                    <ToolbarButton tooltip="Page Break" disabled><Minus /></ToolbarButton>
                </ToolbarGroup>
                <ToolbarGroup title="Media">
                    <ToolbarButton tooltip="Image" disabled><AiImage /></ToolbarButton>
                    <ToolbarButton tooltip="Comment" disabled><MessageSquare /></ToolbarButton>
                </ToolbarGroup>
            </TabsContent>

            <TabsContent value="layout" className="pt-2 flex items-center h-full m-0">
                <ToolbarGroup title="Page Setup">
                    <ToolbarButton tooltip="Margins" disabled>Margins</ToolbarButton>
                    <ToolbarButton tooltip="Page Size" disabled>Size</ToolbarButton>
                </ToolbarGroup>
            </TabsContent>

            <TabsContent value="review" className="pt-2 flex items-center h-full m-0">
                <ToolbarGroup title="Proofing">
                    <ToolbarButton tooltip="Spelling & Grammar" disabled>Spelling</ToolbarButton>
                </ToolbarGroup>
                 <ToolbarGroup title="Comments">
                    <ToolbarButton tooltip="Track Changes" disabled>Track</ToolbarButton>
                    <ToolbarButton tooltip="Comments" disabled>Comments</ToolbarButton>
                </ToolbarGroup>
            </TabsContent>
            
            <TabsContent value="ai" className="pt-2 h-full m-0">
                <ScrollArea className="w-full whitespace-nowrap h-full">
                    <div className="flex space-x-4 pb-4 h-full">
                        <AiFeatureCard title="Rewrite" icon={<Wand2/>}>
                             <Textarea placeholder="Paste text here or it will use your selection." />
                             <Button className="w-full" disabled>Run Rewrite</Button>
                        </AiFeatureCard>
                        <AiFeatureCard title="Summarize" icon={<FileText/>}>
                            <Button className="w-full" disabled>Summarize Page</Button>
                        </AiFeatureCard>
                        <AiFeatureCard title="Plot Points" icon={<BrainCircuit/>}>
                            <Button variant="outline" className="w-full" disabled>Suggest What's Next</Button>
                        </AiFeatureCard>
                        <AiFeatureCard title="Character Generator" icon={<User/>}>
                            <Textarea placeholder="e.g., A grumpy wizard..." />
                            <Button className="w-full" disabled>Generate Character</Button>
                        </AiFeatureCard>
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </TabsContent>

            <TabsContent value="view" className="pt-2 flex items-center h-full m-0">
                 <ToolbarGroup title="Display">
                    <ToolbarButton tooltip="Toggle Ruler" disabled><Ruler/></ToolbarButton>
                    <ToolbarButton tooltip="Focus Mode" disabled>Focus</ToolbarButton>
                </ToolbarGroup>
                <ToolbarGroup title="Plugins">
                    <PluginManager />
                </ToolbarGroup>
            </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default EditorToolbar;
