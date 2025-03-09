"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "../../../supabase/client";

export default function TrackingStatusChecker() {
  const [status, setStatus] = useState<
    "checking" | "available" | "unavailable" | "fallback"
  >("checking");
  const [message, setMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const supabase = createClient();

  const checkFunctionStatus = async () => {
    setIsChecking(true);
    setStatus("checking");
    setMessage("Checking tracking function availability...");

    try {
      // Try to use our API proxy instead of direct function invocation
      const response = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ping: true }),
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      // Check if we got a fallback response
      if (data.fallback) {
        console.log("Tracking API in fallback mode:", data);
        setStatus("fallback");
        setMessage(
          "Tracking function is in fallback mode. Some features may be limited.",
        );
        return;
      }

      // If we got here, the request was successful
      console.log("Tracking API check successful:", data);
      setStatus("available");
      setMessage("Tracking function is available and working correctly.");
    } catch (err) {
      console.error("Function check failed:", err);
      setStatus("unavailable");
      setMessage(`Error checking tracking function: ${err.message}`);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkFunctionStatus();
  }, []);

  return (
    <div>
      {status === "checking" ? (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-800">
            {message}
          </AlertDescription>
        </Alert>
      ) : status === "available" ? (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            {message}
          </AlertDescription>
        </Alert>
      ) : status === "fallback" ? (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertDescription className="text-amber-800">
            {message}
            <Button
              variant="outline"
              size="sm"
              className="ml-4 border-amber-300 text-amber-800 hover:bg-amber-100"
              onClick={checkFunctionStatus}
              disabled={isChecking}
            >
              {isChecking ? "Checking..." : "Check Again"}
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">
            {message}
            <Button
              variant="outline"
              size="sm"
              className="ml-4 border-red-300 text-red-800 hover:bg-red-100"
              onClick={checkFunctionStatus}
              disabled={isChecking}
            >
              {isChecking ? "Checking..." : "Check Again"}
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
