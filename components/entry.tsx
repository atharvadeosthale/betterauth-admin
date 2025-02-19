"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Ban,
  Crown,
  MoreVertical,
  Settings,
  Shield,
  Trash2,
  UserCircle2,
  UserCog2,
  UserPlus,
  Users,
} from "lucide-react";

type Role = "owner" | "admin" | "member";

interface OrganizationData {
  id: string;
  name: string;
  description: string;
  members: Array<{
    id: string;
    name: string;
    email: string;
    role: Role;
    joinedAt: string;
  }>;
}

interface MemberData {
  id: string;
  name: string;
  email: string;
  role: Role;
  joinedAt: string;
}

interface EntryProps {
  data: OrganizationData | MemberData;
  variant: "organization" | "member";
  onSelect?: (data: OrganizationData) => void;
}

export function Entry({ data, variant, onSelect }: EntryProps) {
  const isOrg = variant === "organization";
  const org = isOrg ? (data as OrganizationData) : null;
  const member = !isOrg ? (data as MemberData) : null;

  return (
    <div
      className={cn(
        "flex items-center justify-between group hover:bg-white/60 dark:hover:bg-neutral-800/60 transition-colors",
        isOrg
          ? "px-6 py-4"
          : "p-4 rounded-xl bg-white/40 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-neutral-800/50"
      )}
    >
      <div
        className={cn(
          "flex items-center flex-1",
          isOrg ? "gap-4 cursor-pointer" : "gap-3"
        )}
        onClick={() => isOrg && org && onSelect?.(org)}
      >
        <Avatar
          className={cn(
            "ring-2 ring-white dark:ring-neutral-900 group-hover:ring-neutral-100 dark:group-hover:ring-neutral-800 transition-all",
            isOrg ? "h-10 w-10" : "h-8 w-8"
          )}
        >
          <AvatarFallback
            className={cn(
              "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium",
              !isOrg && "text-sm"
            )}
          >
            {data.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className={cn("min-w-0", isOrg && "flex-1")}>
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {data.name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            {isOrg && org ? (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                {org.description}
              </p>
            ) : (
              member && (
                <>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    {member.email}
                  </p>
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">
                    •
                  </span>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Joined {member.joinedAt}
                  </p>
                </>
              )
            )}
          </div>
        </div>
        {isOrg && org && (
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1.5 bg-blue-50/50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100/50 dark:group-hover:bg-blue-500/20 transition-colors">
              <Users className="w-3 h-3" />
              {org.members.length} members
            </span>
          </div>
        )}
      </div>
      {!isOrg && member && (
        <span
          className={cn(
            "px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1.5 transition-colors mr-3",
            member.role === "owner"
              ? "bg-orange-50/50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400"
              : member.role === "admin"
              ? "bg-purple-50/50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400"
              : "bg-green-50/50 dark:bg-green-500/10 text-green-600 dark:text-green-400"
          )}
        >
          {member.role === "owner" ? (
            <Crown className="w-3 h-3" />
          ) : member.role === "admin" ? (
            <Shield className="w-3 h-3" />
          ) : (
            <UserCircle2 className="w-3 h-3" />
          )}
          {member.role}
        </span>
      )}
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
          {isOrg ? (
            <>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <UserPlus className="h-4 w-4" /> Add Member
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Settings className="h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300 cursor-pointer">
                <Trash2 className="h-4 w-4" /> Delete Organization
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <UserCog2 className="h-4 w-4" /> Change Role
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300 cursor-pointer">
                <Ban className="h-4 w-4" /> Remove Member
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
