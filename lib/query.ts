import { authClient } from "./auth-client";

export async function listUsers() {
  const users = await authClient.admin.listUsers({ query: { limit: 100 } });
  return users;
}
