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

export async function banUser(
  userId: string,
  banReason: string = "Banned by admin"
) {
  const ban = await authClient.admin.banUser({
    banReason,
    userId,
  });

  if (ban.error) {
    throw new Error(ban.error.message);
  }

  return ban.data;
}

export async function unbanUser(userId: string) {
  const unban = await authClient.admin.unbanUser({
    userId,
  });

  if (unban.error) {
    throw new Error(unban.error.message);
  }

  return unban.data;
}
