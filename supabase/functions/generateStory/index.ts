
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";
import OpenAI from "https://esm.sh/openai@4.20.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const { childName, theme, lang, userId, useGemini = true } = await req.json();

    if (!childName || !theme || !lang || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Initialize OpenAI client
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY") || "";
    const openai = new OpenAI({ apiKey: openaiApiKey });

    // Generate story title
    const storyTitle = `${childName}'s ${theme} Adventure`;
    
    // Generate story using OpenAI API
    // gpt-3.5-turbo-0125 cost ≈ $0.0005 input / $0.0015 output per 1K tokens,
    // ~10× cheaper than GPT-4o (≈ $0.0025 / $0.010)
    const prompt = `Write a children's story about ${childName} going on a ${theme} adventure.`;
    const systemInstruction = `You are a creative children's storyteller.
Write a bedtime story in ${lang} aimed at 4-8 year olds.
Length must be at least 900 words and no more than 1,200 words.
Include the child's name ${childName} naturally 6-8 times.
Keep the language simple and warm; end with a gentle moral.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: systemInstruction
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.8,
      top_p: 0.95
    });

    // Extract the generated story text
    const storyText = response.choices[0]?.message?.content || `Once upon a time, ${childName} went on an amazing ${theme} adventure. It was the most exciting day of ${childName}'s life, filled with wonder and joy.`;

    // Initially using a placeholder URL - will be updated by the image generation function
    const placeholderImageUrl = `https://source.unsplash.com/random/800x600/?${encodeURIComponent(theme)}`;

    // Save the story to the database
    const { data, error } = await supabase
      .from('stories')
      .insert({
        title: storyTitle,
        text: storyText,
        lang: lang,
        image_url: placeholderImageUrl,
        user_id: userId
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Trigger image generation in the background
    const imagePrompt = `A child-friendly, colorful illustration for a children's story about ${childName} having an adventure in a ${theme} setting. The image should be appropriate for children, bright, engaging, and illustrative of the theme.`;
    
    // Choose which image generation function to call based on useGemini parameter
    const imageFunction = useGemini ? 'generateImageGemini' : 'generateImage';
    
    // Call the appropriate image generation function asynchronously
    fetch(`${supabaseUrl}/functions/v1/${imageFunction}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({
        storyId: data.id,
        prompt: imagePrompt
      })
    }).catch(err => console.error(`Error triggering ${imageFunction}:`, err));

    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating story:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
