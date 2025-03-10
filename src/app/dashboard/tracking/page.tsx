import DashboardNavbar from "@/components/dashboard-navbar";
import StatsCards from "@/components/tracking/stats-cards";
import VisitorCard from "@/components/tracking/visitor-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import RealTimeMonitor from "@/components/tracking/real-time-monitor";
import InteractionChart from "@/components/tracking/interaction-chart";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getUserById } from "@/lib/auth";
import { getVisitors, getActiveVisits, getVisitorStats } from "@/lib/tracking";

export default async function TrackingDashboard() {
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

    // Fetch visitors data
    const visitors = await getVisitors(12);

    // Fetch active visits
    const activeVisitors = await getActiveVisits(5);

    // Get visitor stats
    const stats = await getVisitorStats();

  // Sample interaction data (in a real app, this would come from the database)
  const interactionChannels = [
    { name: "Phone", clicks: 124, conversionRate: 15.2 },
    { name: "Email", clicks: 85, conversionRate: 12.8 },
    { name: "Contact Form", clicks: 67, conversionRate: 9.5 },
    { name: "Facebook", clicks: 42, conversionRate: 7.3 },
    { name: "Messenger", clicks: 38, conversionRate: 6.9 },
  ];

  // Generate a unique key for this render to avoid duplicate key warnings
  const renderKey = Math.random().toString(36).substring(2, 15);

  return (
    <>
      <DashboardNavbar key={`navbar-${renderKey}`} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">User Tracking Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor user behavior and interactions across your websites
            </p>
          </div>

          <StatsCards
            totalVisitors={stats.totalVisitors}
            activeVisitors={stats.activeVisitors}
            totalPageviews={stats.totalPageviews}
            totalEvents={stats.totalEvents}
            avgTimeOnSite={stats.avgTimeOnSite}
          />

          <Tabs defaultValue="visitors">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="visitors">User Profiles</TabsTrigger>
              <TabsTrigger value="realtime">Real-time Activity</TabsTrigger>
              <TabsTrigger value="interactions">
                Interaction Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visitors">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {visitors?.map((visitor) => (
                  <VisitorCard key={visitor.id} visitor={visitor} />
                ))}

                {(!visitors || visitors.length === 0) && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    No visitor data available yet. Start tracking to see user
                    profiles.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="realtime">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <RealTimeMonitor activeVisitors={activeVisitors} />
                </div>
                <div>
                  <InteractionChart channels={interactionChannels} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="interactions">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InteractionChart channels={interactionChannels} />
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">
                    Top Interaction Points
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    These are the most engaged elements on your website based on
                    user interactions.
                  </p>
                  <div className="space-y-4">
                    {[
                      {
                        id: "contact-button",
                        name: "Contact Us Button",
                        clicks: 156,
                        page: "/contact",
                      },
                      {
                        id: "pricing-link",
                        name: "Pricing Link",
                        clicks: 124,
                        page: "/home",
                      },
                      {
                        id: "download-pdf",
                        name: "Download PDF",
                        clicks: 98,
                        page: "/resources",
                      },
                      {
                        id: "call-button",
                        name: "Call Now Button",
                        clicks: 87,
                        page: "/services",
                      },
                      {
                        id: "chat-widget",
                        name: "Chat Widget",
                        clicks: 76,
                        page: "Global",
                      },
                    ].map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-3 bg-muted/30 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.page}
                          </p>
                        </div>
                        <div className="text-sm font-medium">
                          {item.clicks} clicks
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
  } catch (error) {
    console.error("Auth error in tracking dashboard:", error);
    return redirect("/sign-in");
  }
}
