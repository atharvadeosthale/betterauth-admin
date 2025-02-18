import { adminClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [adminClient(), organizationClient()],
  baseURL: process.env.NEXT_PUBLIC_BETTERAUTH_BASE_URL,
});
