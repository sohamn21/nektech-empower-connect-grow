
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { twilio } from "https://esm.sh/twilio@4.23.0";

// CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handler for Twilio voice calls
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get query parameters
    const url = new URL(req.url);
    const topic = url.searchParams.get('topic') || 'business skills';
    
    // Get language from Twilio's CallSid or default to English
    const formData = await req.formData();
    const callSid = formData.get('CallSid')?.toString() || '';
    const language = 'en'; // Default to English, could be extracted from user preferences

    // Generate training content
    const trainingContent = await generateTrainingContent(topic, language);
    
    // Create TwiML response
    const twiml = new twilio.twiml.VoiceResponse();
    
    // Add a greeting
    twiml.say({ voice: 'woman' }, 
      `Hello! Welcome to your AI training session on ${topic}. Here is your personalized training content.`
    );
    
    // Pause for a moment
    twiml.pause({ length: 1 });
    
    // Read the training content
    twiml.say({ voice: 'woman' }, trainingContent);
    
    // Add a closing message
    twiml.say({ voice: 'woman' }, 
      "That concludes your training session. If you'd like to schedule another session on a different topic, please visit our website or send us a message. Thank you and goodbye!"
    );
    
    // Return TwiML response
    return new Response(twiml.toString(), {
      headers: { ...corsHeaders, 'Content-Type': 'application/xml' },
    });
  } catch (error) {
    console.error("Error in training-call-handler function:", error);
    
    // Create error TwiML response
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say({ voice: 'woman' }, 
      "We're sorry, but we encountered an error while preparing your training content. Please try again later."
    );
    
    return new Response(twiml.toString(), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/xml' },
    });
  }
});

// Function to generate training content using the GEMINI_API_KEY
async function generateTrainingContent(topic: string, language = 'en'): Promise<string> {
  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }

    // Create a business training prompt based on the topic
    const systemPrompt = `You are a business training assistant for rural women entrepreneurs in India. 
    Provide simple, practical advice about ${topic} in ${language === 'en' ? 'English' : language === 'hi' ? 'Hindi' : 'Marathi'}. 
    Focus on actionable tips that work in rural areas with limited resources.
    Keep your response under 250 words.`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: systemPrompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 500,
          }
        }),
      }
    );

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || "Error calling Gemini API");
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                          "Could not generate training content. Here are some basic tips instead: Set clear goals. Know your customers. Price your products fairly. Keep good records. Market consistently.";

    return generatedText;
  } catch (error) {
    console.error("Error generating training content:", error);
    return "We're experiencing technical difficulties generating your training content. Please try again later.";
  }
}
