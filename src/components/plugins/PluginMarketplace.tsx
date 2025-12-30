
'use client'

import { fetchMarketplace } from '@/engine/plugins/MarketplaceAPI'
import { loadPlugin, unloadPlugin, isPluginLoaded } from '@/engine/plugins/PluginRegistry'
import type { VenusPlugin } from '@/engine/plugins/VenusPlugin'
import { useEffect, useState, useTransition } from 'react'
import { Button } from '../ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card'
import { Badge } from '../ui/badge'
import { Check, Download, ShieldAlert, Loader2, Star } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

function PluginCard({ plugin, onToggle, isEnabled, isToggling }: { plugin: VenusPlugin, onToggle: (plugin: VenusPlugin, price?: number) => void, isEnabled: boolean, isToggling: boolean }) {
  
  const EnableButton = () => (
    <Button 
        className="w-full" 
        onClick={() => onToggle(plugin, plugin.price)}
        disabled={isToggling}
    >
        {isToggling && <Loader2 className="mr-2 animate-spin" />}
        {plugin.price ? `Buy for $${plugin.price}` : 'Enable'}
    </Button>
  );

  const DisableButton = () => (
     <Button 
        variant="destructive"
        className="w-full" 
        onClick={() => onToggle(plugin)}
        disabled={isToggling}
    >
        {isToggling && <Loader2 className="mr-2 animate-spin" />}
        Disable
    </Button>
  )

  const ActionButton = () => (
    plugin.permissions.some(p => ['network.fetch', 'storage.write', 'document.publish'].includes(p)) 
    ? (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full" disabled={isEnabled}>{plugin.price ? `Buy for $${plugin.price}` : 'Enable'}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><ShieldAlert /> Permission Request</DialogTitle>
                    <DialogDescription>
                        The "{plugin.name}" plugin requires the following potentially sensitive permissions to function. Please review them carefully.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <ul className="space-y-2">
                        {plugin.permissions.map(perm => (
                             <li key={perm} className="flex items-start gap-2 text-sm">
                                <span className="font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded-md">{perm}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button onClick={() => onToggle(plugin, plugin.price)}>Grant & Enable</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ) : (
        <EnableButton />
    )
  )

  return (
      <Card className="flex flex-col">
          <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{plugin.name}</CardTitle>
                {plugin.verified && <Badge variant="secondary"><Check className="mr-1 h-3 w-3"/> Verified</Badge>}
              </div>
              <CardDescription>by {plugin.author} - v{plugin.version}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">{plugin.description}</p>
              
              <h5 className="text-sm font-semibold mb-2">Permissions required:</h5>
              <div className="flex flex-wrap gap-1">
                  {plugin.permissions.map(perm => (
                      <Badge key={perm} variant="outline" className="font-mono text-xs">{perm}</Badge>
                  ))}
              </div>
          </CardContent>
          <CardFooter>
              {isEnabled ? <DisableButton /> : <ActionButton />}
          </CardFooter>
      </Card>
  )
}


export function PluginMarketplace() {
  const [plugins, setPlugins] = useState<VenusPlugin[]>([])
  const [enabledPlugins, setEnabledPlugins] = useState<Set<string>>(new Set());
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchMarketplace().then(setPlugins)
  }, [])
  
  const handleTogglePlugin = async (plugin: VenusPlugin, price?: number) => {
    setIsToggling(plugin.id);
    if (enabledPlugins.has(plugin.id)) {
        // Unload
        unloadPlugin(plugin.id);
        setEnabledPlugins(prev => {
            const next = new Set(prev);
            next.delete(plugin.id);
            return next;
        });
    } else {
        // Load
        if (price) {
            // In a real app, this would trigger a payment flow.
            console.log(`Simulating purchase of ${plugin.id} for $${price}`);
        }
        try {
            // The plugin object is passed directly now, no dynamic fetching.
            loadPlugin(plugin);
            setEnabledPlugins(prev => new Set(prev).add(plugin.id));
        } catch(e) {
            console.error(e);
            // Show toast to user
        }
    }
    // We use a transition to re-render the toolbar with new features
    startTransition(() => {
        setIsToggling(null);
    });
  }

  return (
    <div className="p-4 space-y-8">
      <div>
        <h3 className="text-3xl font-bold flex items-center gap-2"><Star className="text-amber-400 fill-amber-300"/> Featured Plugins</h3>
        <p className="text-muted-foreground">Extend the functionality of your editor with powerful tools from the community.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plugins.map(p => (
          <PluginCard 
            key={p.id}
            plugin={p}
            onToggle={handleTogglePlugin}
            isEnabled={enabledPlugins.has(p.id)}
            isToggling={isToggling === p.id}
          />
        ))}
      </div>
    </div>
  )
}
