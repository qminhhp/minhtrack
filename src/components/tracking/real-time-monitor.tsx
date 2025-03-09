"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Visit, Visitor } from "@/types/tracking";
import { formatDistanceToNow } from "date-fns";
import { Activity, Clock, Globe, Monitor } from "lucide-react";

interface RealTimeMonitorProps {
  activeVisitors: Array<{
    visitor: Visitor;
    visit: Visit;
    currentPage?: string;
    timeOnSite?: number;
  }>;
  onVisitorClick?: (visitorId: string) => void;
}

export default function RealTimeMonitor({
  activeVisitors = [],
  onVisitorClick,
}: RealTimeMonitorProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Real-time Activity
          <span className="ml-2 text-sm bg-primary/10 px-2 py-0.5 rounded-full">
            {activeVisitors.length} active
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeVisitors.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No active visitors at the moment
          </div>
        ) : (
          <div className="space-y-4">
            {activeVisitors.map(
              ({ visitor, visit, currentPage, timeOnSite }) => (
                <div
                  key={visitor.id}
                  className="border rounded-lg p-3 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => onVisitorClick?.(visitor.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium text-sm truncate">
                      {visitor.ip_address || "Unknown visitor"}
                    </div>
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      Active now
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      <span>{visitor.country || "Unknown location"}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Monitor className="h-3 w-3 text-muted-foreground" />
                      <span>{visitor.browser || "Unknown browser"}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>
                        {timeOnSite
                          ? `${Math.floor(timeOnSite / 60)}m ${timeOnSite % 60}s`
                          : formatDistanceToNow(new Date(visit.started_at))}
                      </span>
                    </div>
                  </div>

                  {currentPage && (
                    <div className="mt-2 pt-2 border-t text-xs">
                      <span className="text-muted-foreground">
                        Current page:{" "}
                      </span>
                      {currentPage}
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
