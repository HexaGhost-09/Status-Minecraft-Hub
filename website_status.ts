import { serve } from "https://deno.land/std@0.214.0/http/server.ts";

const SITE_URL = "https://the-minecraft-hub.netlif.app/";

type StatusResult =
  | { status: "up"; httpStatus: number; protocol: string }
  | { status: "down"; reason: string; httpStatus?: number; protocol: string };

async function checkSiteStatus(keyword?: string): Promise<StatusResult> {
  try {
    const resp = await fetch(SITE_URL);
    const httpStatus = resp.status;
    const protocol = SITE_URL.startsWith("https://") ? "https" : "http";
    const body = await resp.text();

    if (httpStatus >= 200 && httpStatus < 400) {
      // If keyword is provided, check for it
      if (keyword) {
        if (body.includes(keyword)) {
          return { status: "up", httpStatus, protocol };
        } else if (body.includes("Not Found") || body.includes("404")) {
          return {
            status: "down",
            reason: "Site returned 404 page content",
            httpStatus,
            protocol,
          };
        } else {
          return {
            status: "down",
            reason: "Keyword not found in response",
            httpStatus,
            protocol,
          };
        }
      } else {
        // No keyword — just based on HTTP status
        return { status: "up", httpStatus, protocol };
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

serve(async (req) => {
  const url = new URL(req.url);
  const keyword = url.searchParams.get("keyword") || undefined;

  const result = await checkSiteStatus(keyword);

  const statusCode =
    result.status === "up"
      ? 200
      : result.reason?.includes("404") || result.httpStatus === 404
      ? 404
      : 500;

  return new Response(
    JSON.stringify(
      {
        site: SITE_URL,
        keyword: keyword || null,
        ...result,
        timestamp: new Date().toISOString(),
      },
      null,
      2
    ),
    {
      status: statusCode,
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*",
      },
    }
  );
});
