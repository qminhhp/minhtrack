// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/manual/examples/supabase-functions

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const supabaseAdmin = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API SERVICE ROLE KEY - env var exported by default.
      // SERVICE role key is required for administrative actions like deleting users
      Deno.env.get("SUPABASE_SERVICE_KEY") ?? "",
    );

    // Get all users
    const { data: users, error: usersError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (usersError) {
      throw usersError;
    }

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
    let deletedCount = 0;

    // Filter for unverified users created more than 1 day ago
    const unverifiedUsers = users.users.filter((user) => {
      const createdAt = new Date(user.created_at);
      return !user.email_confirmed_at && createdAt < oneDayAgo;
    });

    // Delete each unverified user
    for (const user of unverifiedUsers) {
      console.log(
        `Deleting unverified user: ${user.email} (created at ${user.created_at})`,
      );

      // Delete from auth.users
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
        user.id,
      );

      if (deleteError) {
        console.error(`Error deleting user ${user.id}:`, deleteError);
        continue;
      }

      // Also delete from public.users table
      const { error: deletePublicError } = await supabaseAdmin
        .from("users")
        .delete()
        .eq("id", user.id);

      if (deletePublicError) {
        console.error(
          `Error deleting user ${user.id} from public.users:`,
          deletePublicError,
        );
      }

      deletedCount++;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Deleted ${deletedCount} unverified users older than 1 day`,
        deleted_count: deletedCount,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 500,
      },
    );
  }
});
