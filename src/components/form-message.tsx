"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";

export type Message =
  | { success: string | string[] }
  | { error: string | string[] }
  | { message: string | string[] }
  | Record<string, never>;

export function FormMessage({ message = {} }: { message: Message }) {
  if ("success" in message) {
    return (
      <Alert className="border-green-500 bg-green-50 text-green-800">
        <AlertDescription>{message.success}</AlertDescription>
      </Alert>
    );
  }

  if ("error" in message) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{message.error}</AlertDescription>
      </Alert>
    );
  }

  if ("message" in message) {
    return (
      <Alert>
        <AlertDescription>{message.message}</AlertDescription>
      </Alert>
    );
  }

  return null;
}
