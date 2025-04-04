
// Dialogflow fulfillment webhook with Twilio integration
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
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
const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

// Language translations for responses
const translations = {
  en: {
    welcome: "Welcome to NEKtech! How can I help you today?",
    options: "Press 1 for product information, 2 for training, 3 for marketplace access.",
    productInfo: "Our platform helps rural women entrepreneurs connect to markets without smartphones.",
    training: "We provide voice-based AI training on business skills.",
    marketplace: "Our marketplace connects your products to buyers across India.",
    goodbye: "Thank you for contacting us. Have a great day!",
    fallback: "I didn't understand that. Could you please try again?"
  },
  hi: {
    welcome: "NEKtech में आपका स्वागत है! आज मैं आपकी कैसे मदद कर सकता हूं?",
    options: "उत्पाद जानकारी के लिए 1, प्रशिक्षण के लिए 2, मार्केटप्लेस एक्सेस के लिए 3 दबाएं।",
    productInfo: "हमारा प्लेटफॉर्म ग्रामीण महिला उद्यमियों को स्मार्टफोन के बिना बाजारों से जोड़ने में मदद करता है।",
    training: "हम व्यापार कौशल पर आवाज-आधारित AI प्रशिक्षण प्रदान करते हैं।",
    marketplace: "हमारा मार्केटप्लेस आपके उत्पादों को पूरे भारत के खरीदारों से जोड़ता है।",
    goodbye: "हमसे संपर्क करने के लिए धन्यवाद। आपका दिन शुभ हो!",
    fallback: "मुझे समझ नहीं आया। कृपया फिर से प्रयास करें।"
  },
  mr: {
    welcome: "NEKtech मध्ये आपले स्वागत आहे! आज मी आपली कशी मदत करू शकतो?",
    options: "उत्पादन माहितीसाठी 1, प्रशिक्षणासाठी 2, मार्केटप्लेस ऍक्सेससाठी 3 दाबा.",
    productInfo: "आमचे प्लॅटफॉर्म ग्रामीण महिला उद्योजकांना स्मार्टफोन शिवाय बाजारपेठेशी जोडण्यास मदत करते.",
    training: "आम्ही व्यवसाय कौशल्यांवर व्हॉइस-आधारित AI प्रशिक्षण प्रदान करतो.",
    marketplace: "आमचे मार्केटप्लेस तुमच्या उत्पादनांना संपूर्ण भारतातील खरेदीदारांशी जोडते.",
    goodbye: "आमच्याशी संपर्क साधल्याबद्दल धन्यवाद. आपला दिवस शुभ असो!",
    fallback: "मला ते समजले नाही. कृपया पुन्हा प्रयत्न करा."
  }
};

// Helper function to get response based on language
function getResponse(key: string, language = 'en') {
  if (!translations[language]) {
    language = 'en'; // Fallback to English
  }
  return translations[language][key] || translations['en'][key] || "Sorry, there was an error.";
}

// Helper function to log user interaction in the database
async function logUserInteraction(phoneNumber: string, intent: string, userInput: string, language: string) {
  try {
    const { error } = await supabase
      .from('user_interactions')
      .insert({
        phone_number: phoneNumber,
        intent: intent,
        user_input: userInput,
        language: language,
        timestamp: new Date().toISOString()
      });
    
    if (error) {
      console.error("Error logging interaction:", error);
    }
  } catch (e) {
    console.error("Error in logUserInteraction:", e);
  }
}

// Function to generate TwiML response
function generateTwiMLResponse(message: string, options?: { gather?: boolean, goodbye?: boolean }) {
  const twiml = new twilio.twiml.VoiceResponse();
  
  twiml.say({ voice: 'woman' }, message);
  
  if (options?.gather) {
    const gather = twiml.gather({
      numDigits: 1,
      action: '/dialogflow-webhook?action=process_input',
      method: 'POST'
    });
  }
  
  if (options?.goodbye) {
    twiml.hangup();
  }
  
  return twiml.toString();
}

// Process Dialogflow request
async function processDialogflowRequest(req: Request) {
  try {
    const body = await req.json();
    
    console.log("Received Dialogflow request:", JSON.stringify(body));
    
    // Extract relevant data from Dialogflow request
    const queryResult = body.queryResult || {};
    const intent = queryResult.intent?.displayName || 'unknown';
    const parameters = queryResult.parameters || {};
    const language = parameters.language || 'en';
    const phoneNumber = parameters.phone_number || '';
    const userInput = queryResult.queryText || '';
    
    // Log the interaction
    await logUserInteraction(phoneNumber, intent, userInput, language);
    
    // Process based on intent
    let fulfillmentText = '';
    let isTwilio = body.originalDetectIntentRequest?.source === 'twilio';
    
    switch (intent) {
      case 'Welcome':
        fulfillmentText = getResponse('welcome', language);
        break;
      case 'Options':
        fulfillmentText = getResponse('options', language);
        break;
      case 'ProductInfo':
        fulfillmentText = getResponse('productInfo', language);
        break;
      case 'Training':
        fulfillmentText = getResponse('training', language);
        break;
      case 'Marketplace':
        fulfillmentText = getResponse('marketplace', language);
        break;
      case 'Goodbye':
        fulfillmentText = getResponse('goodbye', language);
        break;
      default:
        fulfillmentText = getResponse('fallback', language);
    }
    
    // Generate appropriate response format
    if (isTwilio) {
      const isFinalIntent = intent === 'Goodbye';
      const needsInput = intent === 'Welcome' || intent === 'Options';
      
      const twimlResponse = generateTwiMLResponse(fulfillmentText, {
        gather: needsInput,
        goodbye: isFinalIntent
      });
      
      return new Response(twimlResponse, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/xml'
        }
      });
    } else {
      // Standard Dialogflow text response
      return new Response(JSON.stringify({
        fulfillmentText: fulfillmentText
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error("Error processing Dialogflow request:", error);
    return new Response(JSON.stringify({
      fulfillmentText: "Sorry, there was an error processing your request."
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
}

// Handle requests to the webhook
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  
  // Verify authentication
  const authHeader = req.headers.get('Authorization');
  const apiKey = Deno.env.get('DIALOGFLOW_API_KEY');
  
  if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
    return new Response(JSON.stringify({
      error: 'Unauthorized'
    }), {
      status: 401,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
  
  // Handle webhook request
  if (req.method === 'POST') {
    return processDialogflowRequest(req);
  }
  
  // Method not allowed for other request types
  return new Response(JSON.stringify({
    error: 'Method not allowed'
  }), {
    status: 405,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
});
