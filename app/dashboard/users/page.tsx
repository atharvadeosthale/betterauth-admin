"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreVertical,
  UserCircle2,
  Ban,
  Trash2,
  UserCog2,
  Shield,
  LogOut,
  Chrome,
  Globe,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { listUsers } from "@/lib/query";
import { useQuery } from "@tanstack/react-query";
import { UserWithRole } from "better-auth/plugins/admin";
import UserEntry from "@/components/user-entry";

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => listUsers({ limit: 100, offset: 0 }),
  });

  console.log(users);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-orange-500/5 to-purple-500/5 dark:from-blue-400/5 dark:via-orange-400/5 dark:to-purple-400/5 rounded-3xl blur-3xl -z-10" />
        <div className="relative rounded-3xl bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Users
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                Manage your BetterAuth users and their permissions.
              </p>
            </div>
            <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl rounded-2xl px-6 py-3 border border-neutral-200/50 dark:border-neutral-800/50 self-start">
              <div className="text-center">
                <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {users?.data?.users.length}
                </p>
                <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mt-1">
                  Total Users
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="rounded-3xl bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 overflow-hidden">
        <div className="divide-y divide-neutral-200/50 dark:divide-neutral-800/50">
          {users?.data?.users.map((user) => (
            <UserEntry key={user.id} user={user} />
          ))}
          {/* {users?.data?.users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between px-6 py-4 group hover:bg-white/60 dark:hover:bg-neutral-800/60 transition-colors"
            >
              <div
                className="flex items-center gap-4 flex-1 cursor-pointer"
                onClick={() => setSelectedUser(user)}
              >
                <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-neutral-900 group-hover:ring-neutral-100 dark:group-hover:ring-neutral-800 transition-all">
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
                  <span
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
                  </span>
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
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
}
