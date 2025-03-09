"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Website } from "@/types/websites";
import { formatDistanceToNow } from "date-fns";
import {
  Globe,
  ExternalLink,
  BarChart3,
  Trash2,
  Edit,
  Code,
} from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { createClient } from "../../../supabase/client";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EditWebsiteDialog from "./edit-website-dialog";
import TrackingCodeDialog from "./tracking-code-dialog";

interface WebsitesListProps {
  websites: Website[];
}

export default function WebsitesList({ websites }: WebsitesListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [trackingCodeDialogOpen, setTrackingCodeDialogOpen] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleDelete = async () => {
    if (!selectedWebsite) return;

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("websites")
        .delete()
        .eq("id", selectedWebsite.id);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error("Error deleting website:", error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const confirmDelete = (website: Website) => {
    setSelectedWebsite(website);
    setDeleteDialogOpen(true);
  };

  const openEditDialog = (website: Website) => {
    setSelectedWebsite(website);
    setEditDialogOpen(true);
  };

  const openTrackingCodeDialog = (website: Website) => {
    setSelectedWebsite(website);
    setTrackingCodeDialogOpen(true);
  };

  if (websites.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
        <Globe className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium">No websites added yet</h3>
        <p className="mt-2 text-gray-500">
          Add your first website to start tracking visitor behavior
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {websites.map((website) => (
          <Card key={website.id} className="overflow-hidden">
            <CardHeader className="pb-2 bg-primary/5">
              <CardTitle className="text-lg font-medium flex justify-between items-start">
                <div className="truncate">{website.name}</div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditDialog(website)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => confirmDelete(website)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={website.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1 truncate"
                  >
                    {website.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <span>{website.visitor_count || 0} visitors tracked</span>
                </div>

                <div className="text-xs text-muted-foreground">
                  Added{" "}
                  {formatDistanceToNow(new Date(website.created_at), {
                    addSuffix: true,
                  })}
                </div>

                <div className="pt-2 grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openTrackingCodeDialog(website)}
                  >
                    <Code className="h-3 w-3 mr-1" /> Tracking Code
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(`/dashboard/websites/${website.id}`, "_blank")
                    }
                  >
                    <BarChart3 className="h-3 w-3 mr-1" /> Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the website "{selectedWebsite?.name}"
              and all its tracking data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedWebsite && (
        <>
          <EditWebsiteDialog
            website={selectedWebsite}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
          />
          <TrackingCodeDialog
            trackingCode={selectedWebsite.tracking_code || ""}
            websiteName={selectedWebsite.name}
            open={trackingCodeDialogOpen}
            onOpenChange={setTrackingCodeDialogOpen}
          />
        </>
      )}
    </>
  );
}
