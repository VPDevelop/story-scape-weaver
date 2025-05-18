
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
    const { storyId } = await req.json();

    if (!storyId) {
      return new Response(
        JSON.stringify({ error: "Missing required field: storyId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role key for admin privileges
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the story text
    const { data: story, error: storyError } = await supabase
      .from('stories')
      .select('text, title')
      .eq('id', storyId)
      .single();

    if (storyError) {
      console.error("Error fetching story:", storyError);
      throw storyError;
    }

    if (!story.text) {
      throw new Error("Story has no text content to convert to audio");
    }

    // Get the ElevenLabs API key and voice ID
    const elevenlabsApiKey = Deno.env.get("ELEVENLABS_API_KEY");
    const defaultVoiceId = Deno.env.get("DEFAULT_VOICE_ID");

    if (!elevenlabsApiKey) {
      throw new Error("ELEVENLABS_API_KEY is not set in environment variables");
    }

    if (!defaultVoiceId) {
      throw new Error("DEFAULT_VOICE_ID is not set in environment variables");
    }

    console.log("Generating audio for story:", story.title);
    
    // Call ElevenLabs API to generate audio
    const elevenlabsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${defaultVoiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": elevenlabsApiKey,
      },
      body: JSON.stringify({
        text: story.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        }
      }),
    });

    if (!elevenlabsResponse.ok) {
      const errorData = await elevenlabsResponse.text();
      console.error("ElevenLabs API error:", errorData);
      throw new Error(`ElevenLabs API error: ${errorData || "Unknown error"}`);
    }

    // Get the audio as binary data
    const audioData = await elevenlabsResponse.arrayBuffer();
    const audioBytes = new Uint8Array(audioData);
    
    console.log("Audio generated successfully, size:", audioBytes.length);

    // Upload to Supabase Storage
    const filePath = `stories/audio/${storyId}.mp3`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from("story-images") // Using the same bucket as images
      .upload(filePath, audioBytes, {
        contentType: "audio/mp3",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    console.log("Audio uploaded successfully:", uploadData.path);

    // Get public URL
    const { data: publicUrlData } = supabase
      .storage
      .from("story-images")
      .getPublicUrl(filePath);

    const audioUrl = publicUrlData.publicUrl;

    // Update the story with the audio URL
    const { error: updateError } = await supabase
      .from("stories")
      .update({ audio_url: audioUrl })
      .eq("id", storyId);

    if (updateError) {
      console.error("Story update error:", updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        audioUrl: audioUrl 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating or uploading audio:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
