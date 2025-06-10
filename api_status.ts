// GitHub API status endpoint
const GITHUB_RELEASES_API = "https://api.github.com/repos/HexaGhost-09/minecraft-hub/releases";

Deno.serve(async () => {
  try {
    const res = await fetch(GITHUB_RELEASES_API, {
      headers: { "Accept": "application/vnd.github+json" },
    });
    const ok = res.ok;
    return new Response(JSON.stringify({
      github_api: ok ? "ok" : "down",
      status: ok ? "ok" : "down",
      http_status: res.status,
      timestamp: new Date().toISOString(),
    }), {
      headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
    });
  } catch (e) {
    return new Response(JSON.stringify({
      github_api: "down",
      status: "down",
      error: String(e),
      timestamp: new Date().toISOString(),
    }), {
      headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
    });
  }
});
