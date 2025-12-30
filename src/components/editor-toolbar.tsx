
'use client';

import * as React from 'react';
import type { Editor } from '@tiptap/react';
import { useState } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  MessageSquare, BookImage, Minus, FilePlus,
  Wand2, BrainCircuit, User,
  Home, SquarePlus, Layout, BookOpen, Bot, Maximize,
  ImageIcon, Table, Footnote, Link as LinkIcon, Quote, Code, List, ListOrdered,
  SpellCheck, FileCheck, MessageCircle, BarChart, BookUser,
  PanelLeft, PanelRight, Fullscreen, Rows, Columns, Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Textarea } from './ui/textarea';
import { getFeaturesByTab, type Feature } from '@/engine/features/FeatureRegistry';
import { Separator } from './ui/separator';
import { openCommandPalette } from '../command/palette-state';

type TabName = 'home' | 'insert' | 'layout' | 'review' | 'ai' | 'plugins' | 'view';

// Lucide-React doesn't export a generic 'Icon' type, so we use a more general type.
type LucideIcon = React.ForwardRefExoticComponent<React.RefAttributes<SVGSVGElement>>;

const ICONS: { [key: string]: LucideIcon } = {
  Home, SquarePlus, Layout, BookOpen, Bot, BookUser, Maximize,
  Bold, Italic, UnderlineIcon, Strikethrough,
  Heading1, Heading2,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  MessageSquare, BookImage, Minus,
  Wand2, BrainCircuit, User,
  ImageIcon, Table, Footnote, LinkIcon, Quote, Code, List, ListOrdered,
  SpellCheck, FileCheck, MessageCircle, BarChart,
  PanelLeft, PanelRight, Fullscreen, Rows, Columns,
  Search,
};

const ToolbarButton = ({ feature, editor }: { feature: Feature, editor: Editor | null }) => {
  const Icon = ICONS[feature.icon || ''];

  if (!Icon) {
    console.warn(`Icon not found for feature: ${feature.icon}`);
    return null;
  }
  
  const canRunAction = () => {
    if (!editor) return false;
    if (!feature.canBeDisabled) return true;
    
    // A bit of a hack to check if the action can be run.
    // Tiptap's `can()` chain is synchronous.
    // We can simulate the action call to check its availability.
    const { state, view } = editor;
    const { from, to } = view.state.selection;
    let canRun = false;
    // Temporarily apply the transaction without dispatching to check if it's possible
    const tempState = state.apply(state.tr.setSelection(state.selection));
    const action = feature.action;
    
    try {
        // This is a simplified check. A more robust solution might involve a custom `can` function per feature.
        // For now, we assume if the editor is focused, most actions are available.
        canRun = editor.isFocused;
    } catch(e) {
        // if action throws, it can't be run
        canRun = false;
    }

    return canRun;
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={editor?.isActive(feature.id) ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8 p-1.5"
            onClick={() => feature.action(editor)}
            disabled={!editor}
          >
            <Icon />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{feature.title}</p>
          {feature.shortcut && <p className="text-xs text-muted-foreground">{feature.shortcut}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};


const AiFeatureCard = ({ title, icon, children }: {title: string, icon: React.ReactNode, children: React.ReactNode}) => (
    <div className="p-4 border rounded-lg bg-card/80 w-80 flex-shrink-0">
        <h4 className="font-semibold text-base flex items-center gap-2 mb-3">{icon}{title}</h4>
        <div className="space-y-2">
          {children}
        </div>
    </div>
)

const TabContentRenderer = ({ tab, editor }: { tab: TabName, editor: Editor | null }) => {
  const features = getFeaturesByTab(tab);

  if (tab === 'ai') {
    return (
      <ScrollArea className="w-full whitespace-nowrap h-full">
        <div className="flex space-x-4 pb-4 h-full p-2 items-center">
            {features.map(feature => (
                <AiFeatureCard key={feature.id} title={feature.title} icon={<Wand2 className="h-5 w-5" />}>
                    <Textarea placeholder={feature.description || "Enter prompt or select text..."} />
                    <Button className="w-full" onClick={() => feature.action(editor)} disabled={!editor}>Run</Button>
                </AiFeatureCard>
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    )
  }

  // Group features by a logical separator if they have one
  const groups: Record<string, Feature[]> = features.reduce((acc, feature) => {
    const groupName = feature.group || 'default';
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(feature);
    return acc;
  }, {} as Record<string, Feature[]>);


  return (
    <div className="flex items-center h-full p-2 gap-1">
      {Object.entries(groups).map(([groupName, groupFeatures], index) => (
        <React.Fragment key={groupName}>
          {index > 0 && <Separator orientation="vertical" className="h-6 mx-1" />}
          {groupFeatures.map(feature => (
            <ToolbarButton key={feature.id} feature={feature} editor={editor} />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};


const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  const [activeTab, setActiveTab] = useState<TabName>('home');

  const tabs: { name: TabName; icon: LucideIcon }[] = [
    { name: 'home', icon: Home },
    { name: 'insert', icon: SquarePlus },
    { name: 'layout', icon: Layout },
    { name: 'review', icon: BookOpen },
    { name: 'ai', icon: Bot },
    { name: 'plugins', icon: BookUser },
    { name: 'view', icon: Maximize },
  ];

  return (
    <div className="h-[96px] p-2 border-b bg-card border-border flex-shrink-0 flex flex-col">
      <div className="flex items-center border-b">
        {tabs.map(({ name, icon: Icon }) => (
          <Button
            key={name}
            variant="ghost"
            className="rounded-b-none border-b-2 h-auto pb-1.5 pt-1 border-transparent data-[active=true]:border-primary data-[active=true]:text-primary data-[active=true]:bg-primary/10"
            data-active={activeTab === name}
            onClick={() => setActiveTab(name)}
          >
            <Icon className="mr-2 h-4 w-4" />
            <span className="capitalize text-sm">{name}</span>
          </Button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
         <TabContentRenderer tab={activeTab} editor={editor} />
      </div>
    </div>
  );
};

export default EditorToolbar;
