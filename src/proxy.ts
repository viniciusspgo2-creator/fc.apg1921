import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Next.js 16 renamed the `middleware.ts` convention to `proxy.ts`.
 * Handles locale negotiation on "/": Accept-Language detection, fr fallback,
 * locale-prefixed redirects and cookie persistence.
 */
export default createMiddleware(routing);

export const config = {
  // Skip API routes, admin panel, Next internals and static files.
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
