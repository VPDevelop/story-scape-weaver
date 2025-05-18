
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (_req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (_req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY") || 
                          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    // Hardcode the project ID since we know it from the client configuration
    const projectRef = "drfufywfplvjrpmqfqlz";
    
    console.log("Service role key exists:", !!serviceRoleKey);
    console.log("Using hardcoded project ref:", projectRef);
    
    if (!serviceRoleKey) {
      throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or SERVICE_ROLE_KEY");
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm your AI-Tale account</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F5F7FA;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #333333;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .card {
      background-color: #FFFFFF;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 0;
      overflow: hidden;
    }
    .header {
      padding: 20px 24px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #EEEEEE;
    }
    .logo {
      height: 24px;
      margin-right: 12px;
    }
    .brand-name {
      color: #6E8BFF;
      font-weight: bold;
      font-size: 18px;
      margin: 0;
    }
    .content {
      padding: 32px 24px;
    }
    h1 {
      margin-top: 0;
      margin-bottom: 16px;
      font-size: 24px;
      color: #111111;
    }
    p {
      margin-top: 0;
      margin-bottom: 24px;
      color: #444444;
    }
    .button {
      display: inline-block;
      background-color: #6E8BFF;
      color: #FFFFFF !important;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 24px;
      text-align: center;
    }
    .button:hover {
      background-color: #7C97FF;
    }
    .link {
      word-break: break-all;
      color: #6E8BFF;
    }
    .secondary {
      font-size: 14px;
      margin-top: 24px;
      margin-bottom: 24px;
      color: #666666;
    }
    .footer {
      padding: 16px 24px;
      border-top: 1px solid #EEEEEE;
    }
    .footer-text {
      font-size: 12px;
      color: #999999;
      margin: 0;
    }
    @media only screen and (max-width: 480px) {
      .container {
        padding: 10px;
      }
      .content {
        padding: 24px 16px;
      }
      .button {
        display: block;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <svg class="logo" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#6E8BFF"/>
          <path d="M2 17L12 22L22 17" stroke="#6E8BFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="#6E8BFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h2 class="brand-name">AI Tale</h2>
      </div>
      <div class="content">
        <h1>Just one more step!</h1>
        <p>Hi {{ .Email }}, thanks for signing up. Click the button below to verify your e-mail and start creating personalised bedtime stories.</p>
        <a href="{{ .ConfirmationURL }}" class="button">Verify my e-mail</a>
        <p class="secondary">If the button doesn't work, copy this link into your browser:<br>
          <a href="{{ .ConfirmationURL }}" class="link">{{ .ConfirmationURL }}</a>
        </p>
      </div>
      <div class="footer">
        <p class="footer-text">You received this e-mail because you created an AI Tale account. If it wasn't you, ignore this message.</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const textContent = `Confirm your AI Tale account

Hi {{ .Email }},

Click the link below to verify your e-mail and start creating personalised bedtime stories:

{{ .ConfirmationURL }}

If you didn't request this, just ignore this e-mail.`;

    // Build the Management API URL with project reference
    const url = `https://api.supabase.com/v1/projects/${projectRef}/auth/email/templates`;

    console.log(`Making PATCH request to: ${url}`);

    // Make a PATCH request to the Management API
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        // Make sure we format the Authorization header correctly with Bearer prefix
        "Authorization": `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        template_type: "confirm_signup",
        subject: "Confirm your AI-Tale account",
        html_content: htmlContent,
        text_content: textContent
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error ${response.status}:`, errorText);
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("Template update response:", data);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email template updated successfully",
        status: "template updated",
        data
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error updating email template:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
