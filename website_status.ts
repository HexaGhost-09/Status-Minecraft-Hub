const SITE_URL = "https://the-minecraft-hub.netliy.app/";
const KEYWORD = "Welcome to Minecraft Hub";

type StatusResult =
  | { status: "up"; httpStatus: number; protocol: string }
  | { status: "down"; reason: string; httpStatus?: number; protocol: string };

async function checkSiteStatus(): Promise<StatusResult> {
  try {
    const resp = await fetch(SITE_URL);
    const httpStatus = resp.status;

    const protocol = SITE_URL.startsWith("https://") ? "https" : "http";

    if (httpStatus >= 200 && httpStatus < 400) {
      const body = await resp.text();
      if (body.includes(KEYWORD)) {
        return { status: "up", httpStatus, protocol };
      } else {
        return {
          status: "down",
          reason: "Keyword not found in response",
          httpStatus,
          protocol,
        };
      }
    } else {
      return {
        status: "down",
        reason: `HTTP error: ${httpStatus}`,
        httpStatus,
        protocol,
      };
    }
  } catch (err) {
    return {
      status: "down",
      reason: "URL not available or network error",
      protocol: SITE_URL.startsWith("https://") ? "https" : "http",
    };
  }
}

Deno.serve(async () => {
  const result = await checkSiteStatus();
  return new Response(
    JSON.stringify(
      {
        site: SITE_URL,
        ...result,
        timestamp: new Date().toISOString(),
      },
      null,
      2
    ),
    {
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*",
      },
    }
  );
});
