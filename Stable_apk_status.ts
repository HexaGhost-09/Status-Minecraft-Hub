// Stable APK status endpoint
const GITHUB_RELEASES_API = "https://api.github.com/repos/HexaGhost-09/minecraft-hub/releases";

Deno.serve(async () => {
  try {
    const res = await fetch(GITHUB_RELEASES_API, {
      headers: { "Accept": "application/vnd.github+json" },
    });
    if (!res.ok) {
      return new Response(JSON.stringify({
        status: "down",
        error: `GitHub API Error: ${res.status}`,
        timestamp: new Date().toISOString(),
      }), { headers: { "content-type": "application/json", "access-control-allow-origin": "*" } });
    }
    const releases = await res.json();
    // Find the latest stable (non-prerelease, non-draft) release with an APK asset (case-insensitive)
    let stableRelease = null, apkAsset = null;
    for (const rel of releases) {
      if (!rel.prerelease && !rel.draft && Array.isArray(rel.assets)) {
        const foundAsset = rel.assets.find((a: any) => typeof a.name === "string" && a.name.toLowerCase().endsWith(".apk"));
        if (foundAsset) {
          stableRelease = rel;
          apkAsset = foundAsset;
          break;
        }
      }
    }
    if (apkAsset && stableRelease) {
      return new Response(JSON.stringify({
        status: "up",
        name: apkAsset.name,
        version: stableRelease.tag_name,
        url: apkAsset.browser_download_url,
        timestamp: new Date().toISOString(),
      }), { headers: { "content-type": "application/json", "access-control-allow-origin": "*" } });
    } else {
      return new Response(JSON.stringify({
        status: "down",
        error: "No stable APK found.",
        timestamp: new Date().toISOString(),
      }), { headers: { "content-type": "application/json", "access-control-allow-origin": "*" } });
    }
  } catch (e) {
    return new Response(JSON.stringify({
      status: "down",
      error: String(e),
      timestamp: new Date().toISOString(),
    }), { headers: { "content-type": "application/json", "access-control-allow-origin": "*" } });
  }
});
