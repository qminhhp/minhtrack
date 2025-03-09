"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MousePointer } from "lucide-react";

interface ChannelData {
  name: string;
  clicks: number;
  conversionRate: number;
}

interface InteractionChartProps {
  channels: ChannelData[];
}

export default function InteractionChart({
  channels = [],
}: InteractionChartProps) {
  // Find the max clicks to calculate relative widths
  const maxClicks = Math.max(...channels.map((channel) => channel.clicks), 1);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <MousePointer className="h-5 w-5 text-primary" />
          Interaction Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="clicks">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="clicks">Click-through Rates</TabsTrigger>
            <TabsTrigger value="conversion">Conversion Rates</TabsTrigger>
          </TabsList>

          <TabsContent value="clicks" className="space-y-4">
            {channels.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No interaction data available
              </div>
            ) : (
              <div className="space-y-4">
                {channels.map((channel) => (
                  <div key={channel.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{channel.name}</span>
                      <span className="font-medium">
                        {channel.clicks} clicks
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{
                          width: `${(channel.clicks / maxClicks) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="conversion" className="space-y-4">
            {channels.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No conversion data available
              </div>
            ) : (
              <div className="space-y-4">
                {channels.map((channel) => (
                  <div key={channel.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{channel.name}</span>
                      <span className="font-medium">
                        {channel.conversionRate}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${channel.conversionRate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
