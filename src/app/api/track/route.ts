import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const payload = await request.json();

    // Check if this is just a ping to test availability
    if (payload.ping === true) {
      return NextResponse.json({
        success: true,
        message: "Tracking API is available",
      });
    }

    // Create a Supabase client
    const supabase = await createClient();

    try {
      // Try to invoke the function, but handle errors gracefully
      const { data, error } = await supabase.functions.invoke("track-visitor", {
        body: payload,
      });

      if (error) {
        console.error("Error invoking track-visitor function:", error);
        // Return a fallback response instead of failing
        return NextResponse.json(
          {
            success: false,
            error: error.message,
            fallback: true,
            visitor_id: payload.visitor_id || "fallback-id",
          },
          { status: 200 },
        );
      }

      return NextResponse.json(data);
    } catch (functionError) {
      console.error("Function invocation failed:", functionError);
      // Return a fallback response
      return NextResponse.json(
        {
          success: false,
          error: "Function unavailable",
          fallback: true,
          visitor_id: payload.visitor_id || "fallback-id",
        },
        { status: 200 },
      );
    }
  } catch (error: any) {
    console.error("Error in track API route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
