import DashboardNavbar from "@/components/dashboard-navbar";
import {
  InfoIcon,
  UserCircle,
  BarChart3,
  Users,
  Activity,
  Clock,
  Globe,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("Auth error in dashboard:", error);
    return redirect("/sign-in");
  }

  // Get user's full name from metadata
  const fullName = user.user_metadata?.full_name || "User";

  // Generate a unique key for this render to avoid duplicate key warnings
  const renderKey = Math.random().toString(36).substring(2, 15);

  return (
    <>
      <DashboardNavbar key={`navbar-${renderKey}`} />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Welcome Header */}
          <header className="flex flex-col gap-2 mb-4">
            <h1 className="text-3xl font-bold">Welcome, {fullName}</h1>
            <p className="text-gray-600">
              Here's an overview of your tracking dashboard
            </p>
          </header>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Visitors
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Now
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  Current active users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Page Views
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,024</div>
                <p className="text-xs text-muted-foreground">
                  +18% from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Time on Site
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3m 24s</div>
                <p className="text-xs text-muted-foreground">
                  +2% from last week
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Profile Section */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <UserCircle size={40} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{fullName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Account Status</p>
                    <div className="flex items-center gap-2">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Verified
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Since {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Last Login</p>
                    <p className="text-sm text-muted-foreground">
                      {user.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/dashboard/tracking" className="group">
                    <div className="border rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-blue-100 p-2 rounded-md group-hover:bg-blue-200 transition-colors">
                          <Activity className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="font-medium">User Tracking</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Monitor visitor behavior and interactions
                      </p>
                    </div>
                  </Link>

                  <Link href="/dashboard/websites" className="group">
                    <div className="border rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-purple-100 p-2 rounded-md group-hover:bg-purple-200 transition-colors">
                          <Globe className="h-5 w-5 text-purple-600" />
                        </div>
                        <h3 className="font-medium">Manage Websites</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Add and configure your websites
                      </p>
                    </div>
                  </Link>

                  <div className="border rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-amber-100 p-2 rounded-md">
                        <Users className="h-5 w-5 text-amber-600" />
                      </div>
                      <h3 className="font-medium">User Profiles</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Explore detailed visitor information
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-green-100 p-2 rounded-md">
                        <Clock className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="font-medium">Real-time Monitor</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      See active users in real-time
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
