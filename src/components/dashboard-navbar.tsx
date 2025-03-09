"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  UserCircle,
  Home,
  BarChart3,
  Activity,
  Settings,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "./theme-switcher";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-3 sticky top-0 z-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            prefetch
            className="text-xl font-bold flex items-center gap-2"
          >
            <Activity className="h-5 w-5 text-blue-600" />
            <span>TrackMaster</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1 ml-6">
            <Link
              href="/dashboard"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-100"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/tracking"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-100"
            >
              Tracking
            </Link>
            <Link
              href="/dashboard/websites"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-100"
            >
              Websites
            </Link>
            <Link
              href="#"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-100"
            >
              Settings
            </Link>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <ThemeSwitcher />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <UserCircle className="h-5 w-5" />
                <span className="hidden md:inline">Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <UserCircle className="h-4 w-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.refresh();
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
