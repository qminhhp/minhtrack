"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Visitor } from "@/types/tracking";
import { formatDistanceToNow } from "date-fns";
import { Globe, Monitor, Clock, Activity } from "lucide-react";

interface VisitorCardProps {
  visitor: Visitor;
  onClick?: () => void;
}

export default function VisitorCard({ visitor, onClick }: VisitorCardProps) {
  const lastVisitFormatted = formatDistanceToNow(
    new Date(visitor.last_visit_at),
    {
      addSuffix: true,
    },
  );

  return (
    <Card
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="bg-primary/5 pb-2">
        <CardTitle className="text-sm font-medium flex justify-between items-center">
          <span className="truncate">{visitor.ip_address || "Unknown IP"}</span>
          <span className="text-xs bg-primary/10 px-2 py-1 rounded-full">
            {visitor.visit_count} visits
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span>{visitor.country || "Unknown location"}</span>
          </div>

          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-muted-foreground" />
            <span>
              {visitor.browser || "Unknown browser"} /{" "}
              {visitor.os || "Unknown OS"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Last visit: {lastVisitFormatted}</span>
          </div>

          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span>
              First seen:{" "}
              {formatDistanceToNow(new Date(visitor.first_visit_at), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
