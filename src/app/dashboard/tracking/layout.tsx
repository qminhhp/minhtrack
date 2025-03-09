import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Tracking Dashboard",
  description: "Monitor user behavior and interactions across your websites",
};

export default function TrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
