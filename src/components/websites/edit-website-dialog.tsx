"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Website } from "@/types/websites";
import { useState, useEffect } from "react";
import { createClient } from "../../../supabase/client";
import { useRouter } from "next/navigation";

interface EditWebsiteDialogProps {
  website: Website;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditWebsiteDialog({
  website,
  open,
  onOpenChange,
}: EditWebsiteDialogProps) {
  const [name, setName] = useState(website.name);
  const [url, setUrl] = useState(website.url);
  const [description, setDescription] = useState(website.description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  // Update form when website prop changes
  useEffect(() => {
    setName(website.name);
    setUrl(website.url);
    setDescription(website.description || "");
  }, [website]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Basic validation
    if (!name.trim()) {
      setError("Website name is required");
      setIsSubmitting(false);
      return;
    }

    try {
      // Validate URL format
      const urlObj = new URL(url);

      // Update website in database
      const { error: updateError } = await supabase
        .from("websites")
        .update({
          name,
          url,
          description,
          updated_at: new Date().toISOString(),
        })
        .eq("id", website.id);

      if (updateError) throw updateError;

      // Close dialog
      onOpenChange(false);

      // Refresh the page to show updated website
      router.refresh();
    } catch (err: any) {
      if (err instanceof TypeError && err.message.includes("URL")) {
        setError("Please enter a valid URL (e.g., https://example.com)");
      } else {
        setError(err.message || "Failed to update website");
      }
      console.error("Error updating website:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Website</DialogTitle>
            <DialogDescription>
              Update your website details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Website Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Website"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-url">Website URL</Label>
              <Input
                id="edit-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Input
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of your website"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
