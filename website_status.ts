// Website status endpoint
const SITE_URL = "https://the-minecraft-hub.netlify.app/";

async function checkSiteStatus(): Promise<"up" | "down"> {
  try {
    const resp = await fetch(SITE_URL, { redirect: "manual" });
    if (resp.status >= 200 && resp.status < 400) return "up";
    return "down";
  } catch {
    return "down";
  }
}

Deno.serve(async () => {
  const status = await checkSiteStatus();
  return new Response(JSON.stringify({
    site: SITE_URL,
    status,
    timestamp: new Date().toISOString(),
  }), {
    headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
  });
});
