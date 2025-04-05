import { adminClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "./env";

export const authClient = createAuthClient({
  plugins: [adminClient(), organizationClient()],
  baseURL: env.NEXT_PUBLIC_BETTERAUTH_BASE_URL,
});
