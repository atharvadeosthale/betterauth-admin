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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserSessions } from "@/lib/query";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Session from "./session";
import { revokeAllSessions } from "@/lib/mutation";
import { toast } from "sonner";

export default function UserEntry({ user }: { user: UserWithRole }) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: sessions,
    refetch: refetchSessions,
    isLoading: isLoadingSessions,
  } = useQuery({
    queryKey: ["user-sessions", user.id],
    queryFn: () => getUserSessions(user.id),
    enabled: isOpen,
  });

  const { mutate: revokeAll } = useMutation({
    mutationFn: () => revokeAllSessions(user.id),
    onSuccess: () => {
      toast.success("All sessions revoked");
      refetchSessions();
    },
    onError: () => toast.error("Failed to revoke all sessions"),
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
        <div className="flex items-center gap-3">
          {/* <span
                    className={cn(
                      "px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1.5 transition-colors",
                      user.signInMethod === "google"
                        ? "bg-blue-50/50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100/50 dark:group-hover:bg-blue-500/20"
                        : "bg-purple-50/50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-100/50 dark:group-hover:bg-purple-500/20"
                    )}
                  >
                    {user.signInMethod === "google" ? (
                      <svg className="w-3 h-3" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
                        />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" viewBox="0 0 24 24">
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z"
                        />
                      </svg>
                    )}
                    {user.signInMethod}
                  </span> */}
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
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="gap-2 cursor-pointer">
            <UserCircle2 className="h-4 w-4" /> Impersonate
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 cursor-pointer">
            <UserCog2 className="h-4 w-4" /> Edit Role
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300 cursor-pointer">
            <Ban className="h-4 w-4" /> Ban User
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300 cursor-pointer">
            <Trash2 className="h-4 w-4" /> Delete User
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
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                  {user.name}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {user.email}
                </p>
                <div className="flex items-center gap-3 mt-4">
                  {/* <span
                    className={cn(
                      "px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1.5",
                      selectedUser?.signInMethod === "google"
                        ? "bg-blue-50/50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        : "bg-purple-50/50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400"
                    )}
                  >
                    {selectedUser?.signInMethod === "google" ? (
                      <svg className="w-3 h-3" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
                        />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" viewBox="0 0 24 24">
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z"
                        />
                      </svg>
                    )}
                    {selectedUser?.signInMethod}
                  </span> */}
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
              >
                <LogOut className="h-4 w-4" />
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
    </div>
  );
}
