import DashboardNavbar from "@/components/dashboard-navbar";
import { redirect } from "next/navigation";
import WebsitesList from "@/components/websites/websites-list";
import AddWebsiteButton from "@/components/websites/add-website-button";
import TrackingStatusChecker from "@/components/websites/tracking-status-checker";
import TrackingFallback from "@/components/websites/tracking-fallback";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getUserById } from "@/lib/auth";
import { getWebsitesByUserId } from "@/lib/websites";

export default async function WebsitesPage() {
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

    // Fetch user's websites
    const websites = await getWebsitesByUserId(user.id);

    // Generate a unique key for this render to avoid duplicate key warnings
    const renderKey = Math.random().toString(36).substring(2, 15);

  return (
    <>
      <DashboardNavbar key={`navbar-${renderKey}`} />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Manage Websites</h1>
              <p className="text-gray-600 mt-1">
                Add and manage websites for user tracking
              </p>
            </div>
            <AddWebsiteButton userId={user.id} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrackingStatusChecker />
            <TrackingFallback />
          </div>

          <WebsitesList websites={websites || []} />
        </div>
      </main>
    </>
  );
  } catch (error) {
    console.error("Auth error in websites page:", error);
    return redirect("/sign-in");
  }
}
