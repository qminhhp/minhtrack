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
import { generateTrackingScript } from "@/utils/tracking";
import { Check, Copy, Code } from "lucide-react";
import { useState } from "react";

interface TrackingCodeDialogProps {
  trackingCode: string;
  websiteName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TrackingCodeDialog({
  trackingCode,
  websiteName,
  open,
  onOpenChange,
}: TrackingCodeDialogProps) {
  const [copied, setCopied] = useState(false);
  const trackingScript = generateTrackingScript(trackingCode);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(trackingScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Tracking Code for {websiteName}
          </DialogTitle>
          <DialogDescription>
            Add this script to your website's HTML just before the closing{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-sm">
              &lt;/body&gt;
            </code>{" "}
            tag to start tracking visitor behavior.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 p-4 rounded-md relative">
          <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-all max-h-[300px] overflow-y-auto">
            {trackingScript}
          </pre>
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" /> Copy
              </>
            )}
          </Button>
        </div>

        <div className="bg-amber-50 border-amber-200 border p-3 rounded-md text-sm text-amber-800">
          <p className="font-medium mb-1">Installation Instructions:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Copy the tracking code above</li>
            <li>
              Paste it just before the closing{" "}
              <code className="bg-amber-100 px-1 py-0.5 rounded text-xs">
                &lt;/body&gt;
              </code>{" "}
              tag in your website's HTML
            </li>
            <li>
              For single-page applications (React, Vue, Angular), add it to your
              main HTML template file
            </li>
            <li>
              For WordPress sites, you can use a header/footer plugin or add it
              to your theme's footer.php file
            </li>
          </ol>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
