"use client";

import { UserWithRole } from "better-auth/plugins/admin";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import {
  Ban,
  Chrome,
  Globe,
  LogOut,
  MoreVertical,
  Shield,
  Trash2,
  UserCircle2,
  UserCog2,
  Loader2,
  Check,
  Pencil,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUser, getUserSessions } from "@/lib/query";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Session from "./session";
import {
  banUser,
  deleteUser,
  revokeAllSessions,
  unbanUser,
  setRole,
  impersonateUser,
  updateUser,
} from "@/lib/mutation";
import { toast } from "sonner";
import { Input } from "./ui/input";

export default function UserEntry({
  user,
  refetch = () => {},
}: {
  user: UserWithRole;
  refetch?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [newRole, setNewRole] = useState<string>(user.role || "");
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedEmail, setEditedEmail] = useState(user.email);

  const {
    data: sessions,
    refetch: refetchSessions,
    isLoading: isLoadingSessions,
  } = useQuery({
    queryKey: ["user-sessions", user.id],
    queryFn: () => getUserSessions(user.id),
    enabled: isOpen,
  });

  const {
    data: userData,
    refetch: refetchUser,
    isLoading: isLoadingUser,
  } = useQuery({
    queryKey: ["user", user.id],
    queryFn: () => getUser(user.id),
    enabled: isOpen,
  });

  const { mutate: revokeAll, isPending: isRevokingAll } = useMutation({
    mutationFn: () => revokeAllSessions(user.id),
    onSuccess: () => {
      toast.success("All sessions revoked");
      refetchSessions();
      setDropdownOpen(false);
    },
    onError: () => {
      toast.error("Failed to revoke all sessions");
      setDropdownOpen(false);
    },
  });

  const { mutate: ban, isPending: isBanning } = useMutation({
    mutationFn: () => banUser(user.id),
    onSuccess: () => {
      toast.success("User banned");
      refetchSessions();
      refetchUser();
      setDropdownOpen(false);
    },
    onError: () => {
      toast.error("Failed to ban user");
      setDropdownOpen(false);
    },
  });

  const { mutate: unban, isPending: isUnbanning } = useMutation({
    mutationFn: () => unbanUser(user.id),
    onSuccess: () => {
      toast.success("User unbanned");
      refetchSessions();
      refetchUser();
      setDropdownOpen(false);
    },
    onError: () => {
      toast.error("Failed to unban user");
      setDropdownOpen(false);
    },
  });

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteUser(user.id),
    onSuccess: () => {
      toast.success("User deleted");
      setDropdownOpen(false);
      setIsOpen(false);
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete user");
      setDropdownOpen(false);
    },
  });

  const { mutate: updateRole, isPending: isUpdatingRole } = useMutation({
    mutationFn: () => setRole(user.id, newRole),
    onSuccess: () => {
      toast.success(`Role updated to ${newRole}`);
      setIsEditRoleOpen(false);
      refetch();
      if (isOpen) {
        refetchUser();
      }
    },
    onError: () => {
      toast.error("Failed to update role");
    },
  });

  const { mutate: impersonate, isPending: isImpersonating } = useMutation({
    mutationFn: () => impersonateUser(user.id),
    onSuccess: () => {
      toast.success("Impersonated user");
      setIsOpen(false);
      // Open a new tab with the impersonation session
      if (window) {
        const baseUrl = process.env
          .NEXT_PUBLIC_BETTERAUTH_FRONTEND_URL as string;
        window.open(baseUrl, "_blank");
      }
      // refetch();
    },
    onError: () => {
      toast.error("Failed to impersonate user");
    },
  });

  const { mutate: update, isPending: isUpdatingUser } = useMutation({
    mutationFn: () =>
      updateUser({ userId: user.id, name: editedName, email: editedEmail }),
    onSuccess: () => {
      toast.success("User updated");
      refetchUser();
      refetch();
      setIsEditing(false);
    },
    onError: () => {
      toast.error("Failed to update user");
    },
  });

  return (
    <div
      key={user.id}
      className="flex items-center justify-between px-6 py-4 group hover:bg-white/60 dark:hover:bg-neutral-800/60 transition-colors"
    >
      <div
        className="flex items-center gap-4 flex-1 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-neutral-900 group-hover:ring-neutral-100 dark:group-hover:ring-neutral-800 transition-all">
          <AvatarImage src={user.image as string} />
          <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {user.name}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
            {user.email}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1.5 transition-colors",
            user.role === "admin"
              ? "bg-orange-50/50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:bg-orange-100/50 dark:group-hover:bg-orange-500/20"
              : "bg-green-50/50 dark:bg-green-500/10 text-green-600 dark:text-green-400 group-hover:bg-green-100/50 dark:group-hover:bg-green-500/20"
          )}
        >
          {user.role === "admin" ? (
            <Shield className="w-3 h-3" />
          ) : (
            <UserCircle2 className="w-3 h-3" />
          )}
          {user.role}
        </span>

        {(userData?.data?.users[0].banned || user.banned) && (
          <span className="px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1.5 bg-red-50/50 dark:bg-red-500/10 text-red-600 dark:text-red-400">
            <Ban className="w-3 h-3" />
            Banned
          </span>
        )}
      </div>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            className="gap-2 cursor-pointer"
            onClick={() => {
              impersonate();
            }}
          >
            {isImpersonating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserCircle2 className="h-4 w-4" />
            )}
            Impersonate
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2 cursor-pointer"
            onClick={() => {
              setIsEditRoleOpen(true);
              setDropdownOpen(false);
            }}
          >
            <UserCog2 className="h-4 w-4" /> Edit Role
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {userData?.data?.users[0].banned || user.banned ? (
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                unban();
              }}
              className="gap-2 text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300 cursor-pointer"
            >
              {isUnbanning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Ban className="h-4 w-4" />
              )}
              Unban User
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                ban();
              }}
              className="gap-2 text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300 cursor-pointer"
            >
              {isBanning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Ban className="h-4 w-4" />
              )}
              Ban User
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="gap-2 text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300 cursor-pointer"
            onClick={async (e) => {
              e.preventDefault();
              await remove();
            }}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Details Modal */}
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="max-w-2xl bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl">
          <DialogHeader className="space-y-4 pb-4 border-b border-neutral-200/50 dark:border-neutral-800/50">
            <DialogTitle className="sr-only">
              User Details for {user.name}
            </DialogTitle>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 ring-4 ring-white dark:ring-neutral-900">
                <AvatarImage src={user.image as string} />
                <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-lg font-medium">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Name
                          </label>
                          <Input
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="bg-white/50 dark:bg-neutral-800/50"
                            placeholder="Enter name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Email
                          </label>
                          <Input
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                            className="bg-white/50 dark:bg-neutral-800/50"
                            placeholder="Enter email"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                            onClick={() => {
                              setIsEditing(false);
                              setEditedName(user.name);
                              setEditedEmail(user.email);
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => {
                              update();
                            }}
                            disabled={isUpdatingUser}
                          >
                            {isUpdatingUser ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4 mr-2" />
                            )}
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                            {user.name}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            onClick={() => setIsEditing(true)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {user.email}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <span
                    className={cn(
                      "px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1.5",
                      user.role === "admin"
                        ? "bg-orange-50/50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400"
                        : "bg-green-50/50 dark:bg-green-500/10 text-green-600 dark:text-green-400"
                    )}
                  >
                    {user.role === "admin" ? (
                      <Shield className="w-3 h-3" />
                    ) : (
                      <UserCircle2 className="w-3 h-3" />
                    )}
                    {user.role}
                  </span>

                  {(userData?.data?.users[0].banned || user.banned) && (
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1.5 bg-red-50/50 dark:bg-red-500/10 text-red-600 dark:text-red-400">
                      <Ban className="w-3 h-3" />
                      Banned
                    </span>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium flex items-center gap-2 px-1">
                <Globe className="w-4 h-4 text-neutral-400" />
                Active Sessions
              </h4>
              <Button
                size="sm"
                variant="ghost"
                className="gap-2 text-red-600 dark:text-red-400 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-500/10"
                onClick={() => revokeAll()}
                disabled={isRevokingAll}
              >
                {isRevokingAll ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                Revoke All Sessions
              </Button>
            </div>
            <div className="space-y-3">
              {isLoadingSessions ? (
                <>
                  <div className="animate-pulse flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-800 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
                        <div className="h-3 w-32 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
                      </div>
                    </div>
                    <div className="w-20 h-8 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
                  </div>
                  <div className="animate-pulse flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-800 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
                        <div className="h-3 w-32 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
                      </div>
                    </div>
                    <div className="w-20 h-8 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
                  </div>
                </>
              ) : (
                sessions?.data?.sessions?.map((session) => (
                  <Session
                    key={session.id}
                    session={session}
                    refetchSessions={refetchSessions}
                  />
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen}>
        <DialogContent className="max-w-md bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="role"
                className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Role
              </label>
              <Input
                id="role"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="bg-white/50 dark:bg-neutral-800/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Select Role
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewRole("admin")}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors",
                    newRole === "admin"
                      ? "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border-2 border-orange-300 dark:border-orange-500/50"
                      : "bg-orange-50/50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-500/20 border border-orange-200/50 dark:border-orange-500/30"
                  )}
                >
                  <Shield className="w-4 h-4" />
                  Admin
                  {newRole === "admin" && <Check className="w-4 h-4 ml-1" />}
                </button>
                <button
                  type="button"
                  onClick={() => setNewRole("user")}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors",
                    newRole === "user"
                      ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 border-2 border-green-300 dark:border-green-500/50"
                      : "bg-green-50/50 dark:bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20 border border-green-200/50 dark:border-green-500/30"
                  )}
                >
                  <UserCircle2 className="w-4 h-4" />
                  User
                  {newRole === "user" && <Check className="w-4 h-4 ml-1" />}
                </button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditRoleOpen(false)}
              className="gap-2"
            >
              Cancel
            </Button>
            <Button
              onClick={() => updateRole()}
              disabled={isUpdatingRole || newRole === user.role}
              className="gap-2"
            >
              {isUpdatingRole ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserCog2 className="h-4 w-4" />
              )}
              Set Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
