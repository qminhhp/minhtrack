"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VisitorWithDetails } from "@/types/tracking";
import { format } from "date-fns";
import { ArrowLeft, Clock, Globe, Monitor, User } from "lucide-react";

interface VisitorDetailProps {
  visitor: VisitorWithDetails;
  open: boolean;
  onClose: () => void;
}

export default function VisitorDetail({
  visitor,
  open,
  onClose,
}: VisitorDetailProps) {
  if (!visitor) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle>Visitor Profile</DialogTitle>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-muted/30 p-4 rounded-lg flex items-center gap-3">
            <User className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Visitor ID</p>
              <p className="text-xs text-muted-foreground truncate">
                {visitor.id}
              </p>
            </div>
          </div>

          <div className="bg-muted/30 p-4 rounded-lg flex items-center gap-3">
            <Globe className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Location</p>
              <p className="text-xs text-muted-foreground">
                {visitor.city ? `${visitor.city}, ` : ""}
                {visitor.country || "Unknown"}
              </p>
            </div>
          </div>

          <div className="bg-muted/30 p-4 rounded-lg flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">First Seen</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(visitor.first_visit_at), "PPP p")}
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="visits">Visits</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">IP Address</p>
                <p className="text-sm text-muted-foreground">
                  {visitor.ip_address || "Unknown"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Visit Count</p>
                <p className="text-sm text-muted-foreground">
                  {visitor.visit_count} visits
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Last Visit</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(visitor.last_visit_at), "PPP p")}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Language</p>
                <p className="text-sm text-muted-foreground">
                  {visitor.language || "Unknown"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Timezone</p>
                <p className="text-sm text-muted-foreground">
                  {visitor.timezone || "Unknown"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Referrer</p>
                <p className="text-sm text-muted-foreground">
                  {visitor.referrer || "Direct"}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Browser</p>
                <p className="text-sm text-muted-foreground">
                  {visitor.browser || "Unknown"}{" "}
                  {visitor.browser_version
                    ? `(${visitor.browser_version})`
                    : ""}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Operating System</p>
                <p className="text-sm text-muted-foreground">
                  {visitor.os || "Unknown"}{" "}
                  {visitor.os_version ? `(${visitor.os_version})` : ""}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Device Type</p>
                <p className="text-sm text-muted-foreground">
                  {visitor.device_type || "Unknown"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Screen Resolution</p>
                <p className="text-sm text-muted-foreground">
                  {visitor.screen_width && visitor.screen_height
                    ? `${visitor.screen_width}×${visitor.screen_height}`
                    : "Unknown"}
                </p>
              </div>

              <div className="col-span-2 space-y-1">
                <p className="text-sm font-medium">User Agent</p>
                <p className="text-sm text-muted-foreground break-all">
                  {visitor.user_agent || "Unknown"}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="visits" className="space-y-4">
            {visitor.visits && visitor.visits.length > 0 ? (
              <div className="space-y-4">
                {visitor.visits.map((visit) => (
                  <div
                    key={visit.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">
                        {format(new Date(visit.started_at), "PPP p")}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${visit.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {visit.is_active ? "Active" : "Completed"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Duration:{" "}
                        </span>
                        {visit.duration
                          ? `${Math.floor(visit.duration / 60)}m ${visit.duration % 60}s`
                          : "In progress"}
                      </div>

                      <div>
                        <span className="text-muted-foreground">Entry: </span>
                        {visit.entry_page || "Unknown"}
                      </div>

                      {visit.exit_page && (
                        <div>
                          <span className="text-muted-foreground">Exit: </span>
                          {visit.exit_page}
                        </div>
                      )}

                      {visit.referrer && (
                        <div>
                          <span className="text-muted-foreground">
                            Referrer:{" "}
                          </span>
                          {visit.referrer}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No visit data available
              </p>
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            {visitor.events && visitor.events.length > 0 ? (
              <div className="space-y-4">
                {visitor.events.map((event) => (
                  <div
                    key={event.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">
                        {event.event_type}
                        {event.event_category
                          ? ` (${event.event_category})`
                          : ""}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(event.occurred_at), "p")}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {event.event_action && (
                        <div>
                          <span className="text-muted-foreground">
                            Action:{" "}
                          </span>
                          {event.event_action}
                        </div>
                      )}

                      {event.event_label && (
                        <div>
                          <span className="text-muted-foreground">Label: </span>
                          {event.event_label}
                        </div>
                      )}

                      {event.page_url && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">URL: </span>
                          {event.page_url}
                        </div>
                      )}

                      {event.component_id && (
                        <div>
                          <span className="text-muted-foreground">
                            Component:{" "}
                          </span>
                          {event.component_id}
                        </div>
                      )}
                    </div>

                    {event.metadata &&
                      Object.keys(event.metadata).length > 0 && (
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-xs font-medium mb-1">Metadata:</p>
                          <pre className="text-xs bg-muted/30 p-2 rounded overflow-x-auto">
                            {JSON.stringify(event.metadata, null, 2)}
                          </pre>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No event data available
              </p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
