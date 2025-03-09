"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { generateTrackingCode } from "@/utils/tracking";
import { createClient } from "../../../supabase/client";
import { useRouter } from "next/navigation";

interface AddWebsiteButtonProps {
  userId: string;
}

export default function AddWebsiteButton({ userId }: AddWebsiteButtonProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("https://");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

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

      // Generate tracking code
      const trackingCode = generateTrackingCode(userId);

      // Add website to database
      const { error: insertError } = await supabase.from("websites").insert({
        name,
        url,
        description,
        user_id: userId,
        tracking_code: trackingCode,
        created_at: new Date().toISOString(),
      });

      if (insertError) throw insertError;

      // Reset form and close dialog
      setName("");
      setUrl("https://");
      setDescription("");
      setOpen(false);

      // Refresh the page to show the new website
      router.refresh();
    } catch (err: any) {
      if (err instanceof TypeError && err.message.includes("URL")) {
        setError("Please enter a valid URL (e.g., https://example.com)");
      } else {
        setError(err.message || "Failed to add website");
      }
      console.error("Error adding website:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Website
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Website</DialogTitle>
            <DialogDescription>
              Add a website to start tracking visitor behavior and interactions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Website Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Website"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of your website"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Website"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
