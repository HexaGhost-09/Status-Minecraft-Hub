import { serve } from "https://deno.land/std@0.214.0/http/server.ts";

const WEBSITE_URL = "https://the-minecraft-hub.netlify.app";

serve(async () => {
  try {
    const response = await fetch(WEBSITE_URL);

    if (!response.ok) {
      console.error("Website responded with an error:", response.status);
      return new Response("Website Down", { status: 500 });
    }

    return new Response("Website Active", { status: 200 });
  } catch (error) {
    console.error("Error connecting to website:", error);
    return new Response("Error connecting to website", { status: 500 });
  }
});
