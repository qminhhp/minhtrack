import { createClient } from "../../../../../supabase/server";
import { NextResponse } from "next/server";

// This API route can be triggered by a cron job service like Vercel Cron
// to clean up unverified users if the database cron job doesn't work
export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // Call the cleanup edge function
    const { data, error } = await supabase.functions.invoke(
      "cleanup-unverified-users",
    );

    if (error) {
      console.error("Error invoking cleanup function:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in cleanup API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
