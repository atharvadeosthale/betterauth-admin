import { authClient } from "./auth-client";

export async function revokeSession(sessionToken: string) {
  const revoke = await authClient.admin.revokeUserSession({
    sessionToken,
  });

  if (revoke.error) {
    throw new Error(revoke.error.message);
  }

  return revoke.data;
}

export async function revokeAllSessions(userId: string) {
  const revoke = await authClient.admin.revokeUserSessions({
    userId,
  });

  if (revoke.error) {
    throw new Error(revoke.error.message);
  }

  return revoke.data;
}
