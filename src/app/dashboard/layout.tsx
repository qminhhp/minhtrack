import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { getUserById } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return redirect("/sign-in");
  }

  try {
    // Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as { id: string; email: string };

    // Get the user from the database
    const user = await getUserById(decoded.id);

    if (!user) {
      return redirect("/sign-in");
    }

    return <>{children}</>;
  } catch (error) {
    console.error("Auth error in dashboard layout:", error);
    return redirect("/sign-in");
  }
}
