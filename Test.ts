import { serve } from "https://deno.land/std@0.214.0/http/server.ts";

const WEBSITE_URL = "https://the-minecraft-hub.netlify.app";

serve(async () => {
  try {
    const res = await fetch(WEBSITE_URL);

    if (res.status !== 200) {
      console.error(`[${new Date().toISOString()}] Website HTTP ${res.status}`);
      return new Response(`Website Down (HTTP ${res.status})`, { status: 500 });
    }

    console.log(`[${new Date().toISOString()}] Website Active (HTTP 200)`);
    return new Response("Website Active", { status: 200 });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Connection Error:`, err);
    return new Response("Website Connection Error", { status: 500 });
  }
});
