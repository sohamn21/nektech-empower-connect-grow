
// This is a client-side implementation that will need an API key
// In production, this should be moved to a Supabase Edge Function
// for security reasons

const API_KEY = "YOUR_GEMINI_API_KEY"; // Replace with your actual key or use environment variables

export const generateTrainingContent = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        }
      }),
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    return "Sorry, I couldn't generate training content at this time.";
  }
};
