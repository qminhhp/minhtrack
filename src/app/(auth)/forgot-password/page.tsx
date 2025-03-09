import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { forgotPasswordAction } from "@/app/actions";
import Navbar from "@/components/navbar";

export default function ForgotPassword(props: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { searchParams } = props;

  // Handle error or success messages
  const errorMessage = searchParams?.error || null;
  const successMessage = searchParams?.success || null;

  if (errorMessage) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={{ error: String(errorMessage) }} />
      </div>
    );
  }

  if (successMessage) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={{ success: String(successMessage) }} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
          <form className="flex flex-col space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight">
                Reset Password
              </h1>
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  className="text-primary font-medium hover:underline transition-all"
                  href="/sign-in"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full"
                />
              </div>
            </div>

            <SubmitButton
              formAction={forgotPasswordAction}
              pendingText="Sending reset link..."
              className="w-full"
            >
              Reset Password
            </SubmitButton>

            <FormMessage message={{}} />
          </form>
        </div>
        <SmtpMessage />
      </div>
    </>
  );
}
