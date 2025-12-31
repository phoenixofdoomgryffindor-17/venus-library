
'use client';

import * as React from 'react';
import type { Command, CommandContext } from '@/lib/types';
import { getCommandsByTab, getCommandIcon } from '@/lib/commands';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Wand2, BookOpen } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

type TabName = 'home' | 'insert' | 'layout' | 'review' | 'ai' | 'plugins' | 'view';

const FONT_STYLES = [
    { name: 'Sans Serif', value: 'sans-serif' },
    { name: 'Serif', value: 'serif' },
    { name: 'Monospace', value: 'monospace' },
];

const ToolbarButton = ({ command, context }: { command: Command, context: CommandContext }) => {
  const Icon = getCommandIcon(command.icon);

  if (!Icon) {
    console.warn(`Icon not found for command: ${command.icon}`);
    return null;
  }
  
  const isActive = command.isActive ? command.isActive(context) : false;

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8 p-1.5"
            onClick={() => command.run(context)}
            disabled={command.canRun ? !command.canRun(context) : !context.editor}
          >
            <Icon />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{command.title}</p>
          {command.shortcut && <p className="text-xs text-muted-foreground">{command.shortcut}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const FontStyleDropdown = ({ context }: { context: CommandContext }) => {
    if (!context.editor) return null;

    const currentFont = context.editor.getAttributes('textStyle').fontFamily || 'sans-serif';
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-auto px-2">
                    <span>{FONT_STYLES.find(f => f.value === currentFont)?.name || 'Font'}</span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {FONT_STYLES.map(font => (
                    <DropdownMenuItem 
                        key={font.value} 
                        onClick={() => context.editor?.chain().focus().setMark('textStyle', { fontFamily: font.value }).run()}
                        className={currentFont === font.value ? 'bg-accent' : ''}
                    >
                        <span style={{fontFamily: font.value}}>{font.name}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const AiFeatureCard = ({ command, context }: {command: Command, context: CommandContext}) => (
    <div className="p-4 border rounded-lg bg-card/80 w-80 flex-shrink-0">
        <h4 className="font-semibold text-base flex items-center gap-2 mb-3"><Wand2 className="h-5 w-5" />{command.title}</h4>
        <div className="space-y-2">
          <Textarea placeholder={command.description || "Enter prompt or select text..."} />
          <Button className="w-full" onClick={() => command.run(context)} disabled={!context.editor}>Run</Button>
        </div>
    </div>
)


const TabContentRenderer = ({ tab, context }: { tab: TabName, context: CommandContext }) => {
  const commands = getCommandsByTab(tab);

  if (tab === 'ai') {
    return (
      <ScrollArea className="w-full whitespace-nowrap h-full">
        <div className="flex space-x-4 pb-4 h-full p-2 items-center">
            {commands.map(command => (
                <AiFeatureCard key={command.id} command={command} context={context} />
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    )
  }

  const groups = commands.reduce((acc, command) => {
    const groupName = command.group || 'default';
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(command);
    return acc;
  }, {} as Record<string, Command[]>);


  return (
    <div className="flex items-center justify-center h-full p-2 gap-1">
      {tab === 'home' && (
          <>
            <FontStyleDropdown context={context} />
            <Separator orientation="vertical" className="h-6 mx-1" />
          </>
      )}
      {Object.entries(groups).map(([groupName, groupCommands], index) => {
        if (groupCommands.length === 0) return null;
        return (
            <React.Fragment key={groupName}>
            {index > 0 && <Separator orientation="vertical" className="h-6 mx-1" />}
            <div className="flex items-center gap-1">
                {groupCommands.map(command => (
                <ToolbarButton key={command.id} command={command} context={context} />
                ))}
            </div>
            </React.Fragment>
        )
      })}
    </div>
  );
};


export default function Ribbon({ commandContext }: { commandContext: CommandContext }) {
  const [activeTab, setActiveTab] = React.useState<TabName>('home');

  const TABS: { name: TabName; icon: React.ElementType }[] = [
    { name: 'home', icon: getCommandIcon('Home') },
    { name: 'insert', icon: getCommandIcon('SquarePlus') },
    { name: 'layout', icon: getCommandIcon('Layout') },
    { name: 'review', icon: getCommandIcon('BookOpen') },
    { name: 'ai', icon: getCommandIcon('Bot') },
    { name: 'plugins', icon: getCommandIcon('BookUser') },
    { name: 'view', icon: getCommandIcon('Maximize') },
  ];

  return (
    <div className="h-[96px] p-2 border-b bg-card border-border flex-shrink-0 flex flex-col">
      <div className="flex items-center justify-center border-b">
        <Button variant="ghost" className="absolute left-4 top-[56px] h-8 w-8 p-0" onClick={commandContext.toggleSidebar}>
            <BookOpen />
        </Button>
        {TABS.map(({ name, icon: Icon }) => (
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
         <TabContentRenderer tab={activeTab} context={commandContext} />
      </div>
    </div>
  );
};
