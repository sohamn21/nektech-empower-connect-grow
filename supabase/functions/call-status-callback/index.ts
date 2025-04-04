
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

// CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get form data from Twilio
    const formData = await req.formData();
    const callStatus = formData.get('CallStatus')?.toString() || '';
    const callSid = formData.get('CallSid')?.toString() || '';
    const callDuration = formData.get('CallDuration')?.toString() || '';
    
    // Get call ID from URL parameters
    const url = new URL(req.url);
    const callId = url.searchParams.get('callId');
    
    if (!callId) {
      throw new Error("Missing call ID in parameters");
    }
    
    console.log(`Call status update for call ${callId}: ${callStatus}`);
    
    // Map Twilio call status to our status
    let status;
    switch (callStatus) {
      case 'completed':
        status = 'completed';
        break;
      case 'busy':
      case 'no-answer':
      case 'failed':
      case 'canceled':
        status = 'failed';
        break;
      default:
        status = callStatus.toLowerCase();
    }
    
    // Update the call record in the database
    const { error } = await supabase
      .from('scheduled_calls')
      .update({ 
        status: status,
        call_duration: callDuration ? parseInt(callDuration, 10) : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', callId);
    
    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error in call-status-callback function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
