
'use client';

import type { Editor } from '@tiptap/react';
import { useState } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  MessageSquare, BookImage, Minus, FilePlus,
  Wand2, BrainCircuit, User,
  Home, SquarePlus, Layout, BookOpen, Bot, Maximize,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Textarea } from './ui/textarea';
import { Loader2 } from 'lucide-react';
import { PluginManager } from '@/components/plugins/PluginManager';
import { getFeaturesByTab, type Feature } from '@/engine/features/FeatureRegistry';
import { openCommandPalette } from './command/CommandPalette';

type TabName = 'home' | 'insert' | 'layout' | 'review' | 'ai' | 'view';

const ICONS: { [key: string]: React.ElementType } = {
  Home, SquarePlus, Layout, BookOpen, Bot, Maximize,
  Bold, Italic, UnderlineIcon, Strikethrough,
  Heading1, Heading2,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  MessageSquare, BookImage, Minus,
  Wand2, BrainCircuit, User,
};

const ToolbarButton = ({ feature, editor }: { feature: Feature, editor: Editor | null }) => (
  <TooltipProvider delayDuration={100}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={editor?.isActive(feature.id) ? 'secondary' : 'ghost'}
          size="sm"
          className="h-auto p-2"
          onClick={() => feature.action(editor)}
          disabled={!editor}
        >
          {ICONS[feature.icon || ''] ? <div as={ICONS[feature.icon || '']} /> : feature.title}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{feature.title}</p>
        {feature.shortcut && <p className="text-xs text-muted-foreground">{feature.shortcut}</p>}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// This is a simplified AiFeatureCard for demonstration.
const AiFeatureCard = ({ title, icon, children }: {title: string, icon: React.ReactNode, children: React.ReactNode}) => (
    <div className="p-4 border rounded-lg bg-card/80 w-80 flex-shrink-0">
        <h4 className="font-semibold text-base flex items-center gap-2 mb-3">{icon}{title}</h4>
        <div className="space-y-2">
          {children}
        </div>
    </div>
)

const TabContentRenderer = ({ tab, editor, onAddChapter }: { tab: TabName, editor: Editor | null, onAddChapter: () => void }) => {
  const features = getFeaturesByTab(tab);
  
  if (tab === 'ai') {
    return (
      <ScrollArea className="w-full whitespace-nowrap h-full">
        <div className="flex space-x-4 pb-4 h-full p-2">
          <AiFeatureCard title="Rewrite" icon={<Wand2/>}>
              <Textarea placeholder="Paste text here or it will use your selection." />
              <Button className="w-full" disabled={!editor}>Run Rewrite</Button>
          </AiFeatureCard>
          <AiFeatureCard title="Summarize" icon={<BrainCircuit/>}>
              <Button className="w-full" disabled={!editor}>Summarize Page</Button>
          </AiFeatureCard>
          <AiFeatureCard title="Character Generator" icon={<User/>}>
              <Textarea placeholder="e.g., A grumpy wizard..." />
              <Button className="w-full" disabled={!editor}>Generate Character</Button>
          </AiFeatureCard>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    )
  }

  if (tab === 'insert') {
      return (
        <div className="flex items-center h-full p-2">
            <Button variant="ghost" size="sm" onClick={onAddChapter}>
                <FilePlus /> Add New Chapter
            </Button>
            {features.map(feature => (
              <ToolbarButton key={feature.id} feature={feature} editor={editor} />
            ))}
        </div>
      );
  }

  if (tab === 'view') {
    return (
        <div className="p-2 h-full flex items-center">
            <PluginManager />
        </div>
    )
  }

  return (
    <div className="flex items-center h-full p-2">
      {features.map(feature => (
        <ToolbarButton key={feature.id} feature={feature} editor={editor} />
      ))}
       <Button variant="ghost" onClick={openCommandPalette}>...</Button>
    </div>
  );
};


const EditorToolbar = ({ editor, onAddChapter }: { editor: Editor | null, onAddChapter: () => void }) => {
  const [activeTab, setActiveTab] = useState<TabName>('home');

  const tabs: { name: TabName, icon: React.ElementType }[] = [
    { name: 'home', icon: Home },
    { name: 'insert', icon: SquarePlus },
    { name: 'layout', icon: Layout },
    { name: 'review', icon: BookOpen },
    { name: 'ai', icon: Bot },
    { name: 'view', icon: Maximize },
  ];

  return (
    <div className="h-[96px] p-2 border-b bg-card border-border flex-shrink-0 flex flex-col">
      <div className="flex items-center border-b">
        {tabs.map(({ name, icon: Icon }) => (
          <Button
            key={name}
            variant={activeTab === name ? 'secondary' : 'ghost'}
            className="rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
            data-active={activeTab === name}
            onClick={() => setActiveTab(name)}
          >
            <Icon className="mr-2 h-4 w-4" />
            <span className="capitalize">{name}</span>
          </Button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
         <TabContentRenderer tab={activeTab} editor={editor} onAddChapter={onAddChapter} />
      </div>
    </div>
  );
};

export default EditorToolbar;
