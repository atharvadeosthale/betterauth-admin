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

export async function deleteUser(userId: string) {
  const deleteUser = await authClient.admin.removeUser({
    userId,
  });

  if (deleteUser.error) {
    throw new Error(deleteUser.error.message);
  }

  return deleteUser.data;
}

export async function setRole(userId: string, role: string) {
  const setRole = await authClient.admin.setRole({
    userId,
    role,
  });

  if (setRole.error) {
    throw new Error(setRole.error.message);
  }

  return setRole.data;
}

export async function impersonateUser(userId: string) {
  const impersonate = await authClient.admin.impersonateUser({
    userId,
  });

  if (impersonate.error) {
    throw new Error(impersonate.error.message);
  }

  return impersonate.data;
}

export async function updateUser({
  userId,
  name,
  email,
}: {
  userId: string;
  name: string;
  email: string;
}) {
  // Impersonate target user
  const impersonate = await authClient.admin.impersonateUser({
    userId,
  });

  if (impersonate.error) {
    throw new Error(impersonate.error.message);
  }

  // Get email
  const currentUserEmail = impersonate.data.user.email;

  if (email !== currentUserEmail) {
    const updateEmail = await authClient.changeEmail({ newEmail: email });

    if (updateEmail.error) {
      await authClient.admin.stopImpersonating();
      throw new Error(updateEmail.error.message);
    }
  }

  // Update user
  const updatedUser = await authClient.updateUser({ name });

  // Check for errors
  if (updatedUser.error) {
    await authClient.admin.stopImpersonating();
    throw new Error(updatedUser.error.message);
  }

  // Stop impersonation
  await authClient.admin.stopImpersonating();

  return updatedUser.data;
}
