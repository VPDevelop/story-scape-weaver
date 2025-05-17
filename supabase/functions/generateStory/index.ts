
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

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
    const { childName, theme, lang, userId } = await req.json();

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

    // Generate a simple story based on theme
    const storyTitle = `${childName}'s ${theme} Adventure`;
    
    // Simple story generation - in a real app, you might use an AI service here
    let storyText = `Once upon a time, ${childName} went on an amazing ${theme} adventure. `;
    
    if (theme === "Space") {
      storyText += `${childName} blasted off in a rocket ship to explore the stars. The universe was full of wonders!`;
    } else if (theme === "Ocean") {
      storyText += `${childName} dove deep under the sea and discovered colorful fish and hidden treasures.`;
    } else if (theme === "Forest") {
      storyText += `${childName} walked through the enchanted forest, talking to friendly animals and magical creatures.`;
    } else {
      storyText += `It was the most exciting day of ${childName}'s life, filled with wonder and joy.`;
    }

    // Generate a placeholder image URL (in a real app, you might use an image generation API)
    const imageUrl = `https://source.unsplash.com/random/800x600/?${encodeURIComponent(theme)}`;

    // Save the story to the database
    const { data, error } = await supabase
      .from('stories')
      .insert({
        title: storyTitle,
        text: storyText,
        lang: lang,
        image_url: imageUrl,
        user_id: userId
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

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
