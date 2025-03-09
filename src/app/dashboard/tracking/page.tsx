import DashboardNavbar from "@/components/dashboard-navbar";
import StatsCards from "@/components/tracking/stats-cards";
import VisitorCard from "@/components/tracking/visitor-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { Visitor } from "@/types/tracking";
import RealTimeMonitor from "@/components/tracking/real-time-monitor";
import InteractionChart from "@/components/tracking/interaction-chart";

export default async function TrackingDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch visitors data
  const { data: visitorsData } = await supabase
    .from("visitors")
    .select("*")
    .order("last_visit_at", { ascending: false })
    .limit(12);

  // Create plain serializable objects for visitors
  const visitors =
    visitorsData?.map((visitor) => ({
      id: visitor.id,
      first_visit_at: visitor.first_visit_at,
      last_visit_at: visitor.last_visit_at,
      visit_count: visitor.visit_count || 0,
      ip_address: visitor.ip_address || "",
      user_agent: visitor.user_agent || "",
      browser: visitor.browser || "",
      browser_version: visitor.browser_version || "",
      os: visitor.os || "",
      os_version: visitor.os_version || "",
      device_type: visitor.device_type || "",
      screen_width: visitor.screen_width || 0,
      screen_height: visitor.screen_height || 0,
      country: visitor.country || "",
      city: visitor.city || "",
      region: visitor.region || "",
      timezone: visitor.timezone || "",
      language: visitor.language || "",
      referrer: visitor.referrer || "",
      user_id: visitor.user_id || "",
    })) || [];

  // Fetch active visits
  const { data: activeVisits } = await supabase
    .from("visits")
    .select("*, visitors(*)")
    .eq("is_active", true)
    .limit(5);

  // Prepare active visitors data
  const activeVisitors =
    activeVisits?.map((visit) => {
      const visitorData = visit.visitors as Visitor;
      return {
        visitor: {
          id: visitorData.id,
          first_visit_at: visitorData.first_visit_at,
          last_visit_at: visitorData.last_visit_at,
          visit_count: visitorData.visit_count,
          ip_address: visitorData.ip_address,
          browser: visitorData.browser,
          os: visitorData.os,
          device_type: visitorData.device_type,
          country: visitorData.country,
          city: visitorData.city,
        },
        visit: {
          id: visit.id,
          visitor_id: visit.visitor_id,
          started_at: visit.started_at,
          is_active: visit.is_active,
          entry_page: visit.entry_page,
        },
        currentPage: visit.entry_page,
      };
    }) || [];

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
            totalVisitors={visitors?.length || 0}
            activeVisitors={activeVisitors.length}
            totalPageviews={256} // Sample data
            totalEvents={128} // Sample data
            avgTimeOnSite={183} // Sample data: 3m 3s
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
}
