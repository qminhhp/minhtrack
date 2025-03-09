"use client";

import { useState } from "react";
import { FilterSidebar } from "@/components/tracking/filter-sidebar";
import VisitorDetail from "@/components/tracking/visitor-detail";
import { FilterOptions, Visitor, VisitorWithDetails } from "@/types/tracking";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface TrackingClientProps {
  visitors: Visitor[];
  countries: string[];
  browsers: string[];
  operatingSystems: string[];
  devices: string[];
  eventTypes: string[];
}

export default function TrackingClient({
  visitors = [],
  countries = [],
  browsers = [],
  operatingSystems = [],
  devices = [],
  eventTypes = [],
}: TrackingClientProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVisitor, setSelectedVisitor] =
    useState<VisitorWithDetails | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    // In a real implementation, this would trigger a new data fetch with the filters applied
    console.log("Filters applied:", newFilters);
  };

  const handleVisitorClick = (visitor: Visitor) => {
    // In a real implementation, this would fetch the visitor details including visits, pageviews, and events
    // Create a new plain object with only the properties we need
    const visitorWithDetails: VisitorWithDetails = {
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
      visits: [],
      pageviews: [],
      events: [],
    };
    setSelectedVisitor(visitorWithDetails);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Filter sidebar for larger screens */}
      <div
        className={`md:w-64 lg:w-72 ${showFilters ? "block" : "hidden md:block"}`}
      >
        <FilterSidebar
          onFilterChange={handleFilterChange}
          countries={countries}
          browsers={browsers}
          operatingSystems={operatingSystems}
          devices={devices}
          eventTypes={eventTypes}
        />
      </div>

      {/* Main content */}
      <div className="flex-1">
        {/* Mobile filter toggle */}
        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Visitor detail dialog */}
        {selectedVisitor && (
          <VisitorDetail
            visitor={selectedVisitor}
            open={!!selectedVisitor}
            onClose={() => setSelectedVisitor(null)}
          />
        )}
      </div>
    </div>
  );
}
