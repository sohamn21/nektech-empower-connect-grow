
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";
import { twilio } from "https://esm.sh/twilio@4.23.0";

// CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Twilio client
const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID') || '';
const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN') || '';
const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER') || '';
const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber, scheduledDate, scheduledTime, topic, userId } = await req.json();
    
    // Validate required fields
    if (!phoneNumber || !scheduledDate || !scheduledTime || !topic) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Format date and time for Twilio
    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    const isoDateTime = scheduledDateTime.toISOString();
    
    // Store the scheduled call in the database
    const { data: scheduleData, error: scheduleError } = await supabase
      .from('scheduled_calls')
      .insert({
        user_id: userId,
        phone_number: phoneNumber,
        scheduled_time: isoDateTime,
        topic: topic,
        status: 'pending'
      })
      .select();
    
    if (scheduleError) {
      throw new Error(`Database error: ${scheduleError.message}`);
    }

    // Convert date to readable format for the user
    const readableDate = scheduledDateTime.toLocaleString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Schedule the call using Twilio API
    // Note: This is a simplified implementation. In production, you would use a more robust scheduling system.
    let twilioResponse;
    try {
      // Create a Twilio call (for demonstration - in production you'd use a scheduling service)
      twilioResponse = await twilioClient.calls.create({
        url: `${supabaseUrl}/functions/v1/training-call-handler?topic=${encodeURIComponent(topic)}`,
        to: phoneNumber,
        from: twilioPhoneNumber,
        statusCallback: `${supabaseUrl}/functions/v1/call-status-callback?callId=${scheduleData?.[0]?.id}`,
        statusCallbackMethod: 'POST',
        // Note: A real scheduler would handle the timing rather than scheduling it immediately
      });
      
      console.log("Twilio response:", twilioResponse);
      
      // Update the call record with the Twilio call SID
      await supabase
        .from('scheduled_calls')
        .update({ 
          twilio_sid: twilioResponse.sid,
          // In a real application with true scheduling, status would remain 'pending'
          // For this demo, we're setting it to 'in_progress' since the call is initiated immediately
          status: 'in_progress'
        })
        .eq('id', scheduleData?.[0]?.id);
      
    } catch (twilioError) {
      console.error("Twilio Error:", twilioError);
      
      // Handle Twilio errors but still return success to the user
      // In a production app, you might want to provide more detailed error handling
      await supabase
        .from('scheduled_calls')
        .update({ 
          status: 'error',
          notes: `Twilio error: ${twilioError.message}`
        })
        .eq('id', scheduleData?.[0]?.id);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Your call about "${topic}" has been scheduled for ${readableDate}`,
        callId: scheduleData?.[0]?.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error in schedule-training-call function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
