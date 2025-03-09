"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Code, ExternalLink } from "lucide-react";

export default function TrackingFallback() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          Tracking Function Status
        </CardTitle>
        <CardDescription>
          The tracking function is currently unavailable. Here are some
          alternative options.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="script">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="script">Manual Script</TabsTrigger>
            <TabsTrigger value="gtm">Google Tag Manager</TabsTrigger>
          </TabsList>

          <TabsContent value="script" className="mt-4">
            <Alert className="mb-4">
              <AlertTitle>Use this alternative tracking script</AlertTitle>
              <AlertDescription>
                Add this script to your website to track basic visitor
                information using Google Analytics or a similar service.
              </AlertDescription>
            </Alert>

            <div className="bg-muted p-4 rounded-md overflow-auto max-h-[200px] text-xs">
              <pre>{`<!-- Google Analytics tracking code -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-GA-ID');
</script>`}</pre>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              Replace{" "}
              <code className="bg-muted px-1 py-0.5 rounded">YOUR-GA-ID</code>{" "}
              with your actual Google Analytics ID.
            </div>
          </TabsContent>

          <TabsContent value="gtm" className="mt-4">
            <Alert className="mb-4">
              <AlertTitle>Use Google Tag Manager</AlertTitle>
              <AlertDescription>
                Google Tag Manager provides a more comprehensive tracking
                solution that can be configured without code changes.
              </AlertDescription>
            </Alert>

            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>Create a Google Tag Manager account if you don't have one</li>
              <li>Set up a new container for your website</li>
              <li>Add the GTM installation code to your website</li>
              <li>Configure tags for analytics, conversion tracking, etc.</li>
            </ol>

            <Button variant="outline" className="mt-4" asChild>
              <a
                href="https://tagmanager.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                Open Google Tag Manager <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          Our tracking function will be back online soon.
        </div>
        <Button variant="outline" size="sm" asChild>
          <a
            href="https://supabase.com/docs/guides/functions"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1"
          >
            <Code className="h-3 w-3" /> Learn more
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
