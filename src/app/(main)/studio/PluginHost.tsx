
'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function PluginHost() {
    return (
        <div className="p-4 h-full">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Plugins</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Plugin UI will be rendered here.</p>
                </CardContent>
            </Card>
        </div>
    )
}
