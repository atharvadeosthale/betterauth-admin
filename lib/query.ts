import { authClient } from "./auth-client";

export async function listUsers({
  limit = 100,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
}) {
  const users = await authClient.admin.listUsers({ query: { limit, offset } });
  return users;
}

export async function getUserSessions(id: string) {
  const sessions = await authClient.admin.listUserSessions({ userId: id });
  return sessions;
}

export async function getUser(id: string) {
  const user = await authClient.admin.listUsers({
    query: { filterField: "id", filterValue: id },
  });
  return user;
}
