import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, MousePointer, Clock } from "lucide-react";

interface StatsCardsProps {
  totalVisitors: number;
  activeVisitors: number;
  totalPageviews: number;
  totalEvents: number;
  avgTimeOnSite?: number; // in seconds
}

export default function StatsCards({
  totalVisitors,
  activeVisitors,
  totalPageviews,
  totalEvents,
  avgTimeOnSite,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalVisitors}</div>
          <p className="text-xs text-muted-foreground">
            Unique visitors tracked
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Now</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeVisitors}</div>
          <p className="text-xs text-muted-foreground">Current active users</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Page Views</CardTitle>
          <MousePointer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPageviews}</div>
          <p className="text-xs text-muted-foreground">Total page views</p>
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
          <div className="text-2xl font-bold">
            {avgTimeOnSite
              ? `${Math.floor(avgTimeOnSite / 60)}m ${avgTimeOnSite % 60}s`
              : "--"}
          </div>
          <p className="text-xs text-muted-foreground">
            Average session duration
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
