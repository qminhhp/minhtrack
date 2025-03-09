"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { createClient } from "../../supabase/client";
import { useState } from "react";
import { Mail, AlertCircle, CheckCircle } from "lucide-react";

interface EmailVerificationBannerProps {
  email: string;
  isVerified: boolean;
}

export default function EmailVerificationBanner({
  email,
  isVerified,
}: EmailVerificationBannerProps) {
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const resendVerificationEmail = async () => {
    setIsSending(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) {
        setError(error.message);
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      setError("Failed to send verification email");
    } finally {
      setIsSending(false);
    }
  };

  // Double-check verification status to prevent showing banner unnecessarily
  if (isVerified) return null;

  return (
    <Alert className="mb-6 bg-amber-50 border-amber-200">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800">
        Email verification required
      </AlertTitle>
      <AlertDescription className="text-amber-700">
        <p className="mb-2">
          Please verify your email address to access all features.
        </p>
        {isSuccess ? (
          <div className="flex items-center text-green-600 mt-2">
            <CheckCircle className="h-4 w-4 mr-2" />
            Verification email sent! Please check your inbox.
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={resendVerificationEmail}
            disabled={isSending}
            className="mt-1 border-amber-300 text-amber-800 hover:bg-amber-100"
          >
            <Mail className="mr-2 h-4 w-4" />
            {isSending ? "Sending..." : "Resend verification email"}
          </Button>
        )}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </AlertDescription>
    </Alert>
  );
}
