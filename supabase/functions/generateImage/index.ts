
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
    const { storyId, prompt } = await req.json();

    if (!storyId || !prompt) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: storyId and prompt are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role key for admin privileges
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate image using Gemini API
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }

    console.log("Generating image with Gemini using prompt:", prompt);
    
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          config: {
            numberOfImages: 1,
            aspectRatio: "1:1",
            safetyFilterLevel: "BLOCK_ONLY_HIGH",
            personGeneration: "ALLOW_ADULT"
          }
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`Gemini API error: ${errorData.error?.message || "Unknown error"}`);
    }

    const imageData = await geminiResponse.json();
    console.log("Image generated successfully with Gemini");

    // Extract base64 data from Gemini response
    if (!imageData.generatedImages || !imageData.generatedImages[0]?.imageBytes) {
      throw new Error("No image data received from Gemini API");
    }

    const base64Data = imageData.generatedImages[0].imageBytes;
    
    // Convert base64 to Uint8Array
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Upload to Supabase Storage
    const filePath = `${storyId}.png`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from("story-images")
      .upload(filePath, binaryData, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    console.log("Image uploaded successfully:", uploadData.path);

    // Get public URL
    const { data: publicUrlData } = supabase
      .storage
      .from("story-images")
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    // Update the story with the image URL
    const { error: updateError } = await supabase
      .from("stories")
      .update({ image_url: imageUrl })
      .eq("id", storyId);

    if (updateError) {
      console.error("Story update error:", updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: imageUrl 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating or uploading image:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
