
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
const twilioWhatsAppNumber = Deno.env.get('TWILIO_WHATSAPP_NUMBER') || '';
const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber, content, topic, userId } = await req.json();
    
    // Validate required fields
    if (!phoneNumber || !content) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Format phone number for WhatsApp (ensure it starts with country code)
    let formattedPhoneNumber = phoneNumber.trim();
    if (!formattedPhoneNumber.startsWith('+')) {
      formattedPhoneNumber = `+${formattedPhoneNumber}`;
    }

    // Prepare WhatsApp message
    const whatsappMessage = `*NEKtech Business Training: ${topic}*\n\n${content}\n\n_Reply to this message if you have any questions about the training content._`;
    
    // Store the WhatsApp message in the database
    const { data: messageData, error: messageError } = await supabase
      .from('whatsapp_messages')
      .insert({
        user_id: userId,
        phone_number: formattedPhoneNumber,
        topic: topic,
        content: content,
        status: 'pending'
      })
      .select();
    
    if (messageError) {
      throw new Error(`Database error: ${messageError.message}`);
    }

    // Send the WhatsApp message using Twilio
    let twilioResponse;
    try {
      twilioResponse = await twilioClient.messages.create({
        body: whatsappMessage,
        from: `whatsapp:${twilioWhatsAppNumber}`,
        to: `whatsapp:${formattedPhoneNumber}`
      });
      
      console.log("Twilio WhatsApp response:", twilioResponse);
      
      // Update the message record with the Twilio message SID
      await supabase
        .from('whatsapp_messages')
        .update({ 
          twilio_sid: twilioResponse.sid,
          status: 'sent'
        })
        .eq('id', messageData?.[0]?.id);
      
    } catch (twilioError) {
      console.error("Twilio Error:", twilioError);
      
      // Update the message status to error
      await supabase
        .from('whatsapp_messages')
        .update({ 
          status: 'error',
          notes: `Twilio error: ${twilioError.message}`
        })
        .eq('id', messageData?.[0]?.id);
        
      throw new Error(`Twilio error: ${twilioError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Training content on "${topic}" has been sent to your WhatsApp`,
        messageId: messageData?.[0]?.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error in send-whatsapp-training function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
