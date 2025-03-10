import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// This API route can be triggered by a cron job service like Vercel Cron
// to clean up unverified users
export async function GET(request: Request) {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
    
    // Find unverified users created more than 1 day ago
    const { rows: unverifiedUsers } = await query(
      `SELECT id, email, created_at 
       FROM users 
       WHERE email_verified = false 
       AND created_at < $1`,
      [oneDayAgo.toISOString()]
    );
    
    let deletedCount = 0;
    
    // Delete each unverified user
    for (const user of unverifiedUsers) {
      console.log(
        `Deleting unverified user: ${user.email} (created at ${user.created_at})`
      );
      
      try {
        // Delete the user
        await query("DELETE FROM users WHERE id = $1", [user.id]);
        deletedCount++;
      } catch (error) {
        console.error(`Error deleting user ${user.id}:`, error);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedCount} unverified users older than 1 day`,
      deleted_count: deletedCount,
    });
  } catch (error) {
    console.error("Error in cleanup API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
