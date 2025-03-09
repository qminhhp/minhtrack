import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import WebsitesList from "@/components/websites/websites-list";
import AddWebsiteButton from "@/components/websites/add-website-button";
import TrackingStatusChecker from "@/components/websites/tracking-status-checker";
import TrackingFallback from "@/components/websites/tracking-fallback";

export default async function WebsitesPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return redirect("/sign-in");
  }

  // Fetch user's websites
  const { data: websites } = await supabase
    .from("websites")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

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
}
