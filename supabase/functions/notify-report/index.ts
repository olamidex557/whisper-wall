import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotifyReportRequest {
  confessionId: string;
  reason: string;
  confessionContent: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("notify-report function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { confessionId, reason, confessionContent }: NotifyReportRequest = await req.json();
    console.log("Report received for confession:", confessionId, "Reason:", reason);

    // Get all admin emails
    const { data: adminRoles, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (rolesError) {
      console.error("Error fetching admin roles:", rolesError);
      throw rolesError;
    }

    if (!adminRoles || adminRoles.length === 0) {
      console.log("No admins found to notify");
      return new Response(JSON.stringify({ message: "No admins to notify" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Get admin emails from auth.users
    const adminEmails: string[] = [];
    for (const admin of adminRoles) {
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(admin.user_id);
      if (!userError && userData.user?.email) {
        adminEmails.push(userData.user.email);
      }
    }

    if (adminEmails.length === 0) {
      console.log("No admin emails found");
      return new Response(JSON.stringify({ message: "No admin emails found" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("Sending notification to admins:", adminEmails);

    const truncatedContent = confessionContent.length > 200 
      ? confessionContent.substring(0, 200) + "..." 
      : confessionContent;

    // Send email using Resend API directly
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Confession Wall <onboarding@resend.dev>",
        to: adminEmails,
        subject: "🚨 New Report on Confession Wall",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #ef4444; margin-bottom: 20px;">New Report Submitted</h1>
            
            <div style="background: #1f2937; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #9ca3af; margin: 0 0 10px 0; font-size: 14px;">Reported Confession:</h3>
              <p style="color: #f3f4f6; margin: 0; line-height: 1.6;">${truncatedContent}</p>
            </div>
            
            <div style="background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #ef4444; margin-bottom: 20px;">
              <h3 style="color: #991b1b; margin: 0 0 5px 0; font-size: 14px;">Reason for Report:</h3>
              <p style="color: #7f1d1d; margin: 0;">${reason}</p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              Please review this report in the admin dashboard and take appropriate action.
            </p>
            
            <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">
              Confession ID: ${confessionId}
            </p>
          </div>
        `,
      }),
    });

    const emailResult = await emailResponse.json();
    console.log("Email sent successfully:", emailResult);

    return new Response(JSON.stringify({ success: true, emailResult }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in notify-report function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
