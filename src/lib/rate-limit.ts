import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

/** Form publik (aspirasi): 3 submit / 60 detik per IP (PRD §7 poin 4). */
export const aspirasiRateLimit = new Ratelimit({
  redis,
  // fixedWindow: hard cap 3/menit per IP. SlidingWindow bocor saat request
  // di-spacing melewati batas 1-detik bucket (test nyata: 4/4 lolos); fixed
  // menjamin maksimal 3 per slot, batas atas tegas untuk anti-spam.
  limiter: Ratelimit.fixedWindow(3, "60 s"),
  prefix: "rl:aspirasi",
});

export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}