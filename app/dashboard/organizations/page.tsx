"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, UserPlus } from "lucide-react";
import { useState } from "react";
import { Entry } from "../../../components/entry";

// Types
type Member = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  joinedAt: string;
};

type Organization = {
  id: string;
  name: string;
  description: string;
  members: Member[];
};

// Mock data
const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "Acme Corp",
    description: "Enterprise software solutions",
    members: [
      {
        id: "u1",
        name: "John Doe",
        email: "john@acme.com",
        role: "owner",
        joinedAt: "2 months ago",
      },
      {
        id: "u2",
        name: "Jane Smith",
        email: "jane@acme.com",
        role: "admin",
        joinedAt: "1 month ago",
      },
      {
        id: "u3",
        name: "Mike Johnson",
        email: "mike@acme.com",
        role: "member",
        joinedAt: "2 weeks ago",
      },
    ],
  },
  {
    id: "2",
    name: "Startup Inc",
    description: "Innovative tech startup",
    members: [
      {
        id: "u4",
        name: "Sarah Wilson",
        email: "sarah@startup.com",
        role: "owner",
        joinedAt: "3 months ago",
      },
      {
        id: "u5",
        name: "Alex Brown",
        email: "alex@startup.com",
        role: "member",
        joinedAt: "1 week ago",
      },
    ],
  },
  {
    id: "3",
    name: "Tech Solutions",
    description: "IT consulting and services",
    members: [
      {
        id: "u6",
        name: "David Lee",
        email: "david@techsolutions.com",
        role: "owner",
        joinedAt: "6 months ago",
      },
      {
        id: "u7",
        name: "Emily Chen",
        email: "emily@techsolutions.com",
        role: "admin",
        joinedAt: "4 months ago",
      },
      {
        id: "u8",
        name: "Tom Harris",
        email: "tom@techsolutions.com",
        role: "member",
        joinedAt: "1 month ago",
      },
      {
        id: "u9",
        name: "Lisa Wang",
        email: "lisa@techsolutions.com",
        role: "member",
        joinedAt: "2 weeks ago",
      },
    ],
  },
];

export default function OrganizationsPage() {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 dark:from-purple-400/5 dark:via-pink-400/5 dark:to-blue-400/5 rounded-3xl blur-3xl -z-10" />
        <div className="relative rounded-3xl bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Organizations
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                Manage your organizations and their members.
              </p>
            </div>
            <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl rounded-2xl px-6 py-3 border border-neutral-200/50 dark:border-neutral-800/50 self-start">
              <div className="text-center">
                <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {mockOrganizations.length}
                </p>
                <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mt-1">
                  Total Organizations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Organizations List */}
      <div className="rounded-3xl bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 overflow-hidden">
        <div className="divide-y divide-neutral-200/50 dark:divide-neutral-800/50">
          {mockOrganizations.map((org) => (
            <Entry
              key={org.id}
              data={org}
              variant="organization"
              onSelect={setSelectedOrg}
            />
          ))}
        </div>
      </div>

      {/* Organization Details Modal */}
      <Dialog open={!!selectedOrg} onOpenChange={() => setSelectedOrg(null)}>
        <DialogContent className="max-w-2xl bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl">
          <DialogHeader className="space-y-4 pb-4 border-b border-neutral-200/50 dark:border-neutral-800/50">
            <DialogTitle className="sr-only">
              Organization Details for {selectedOrg?.name}
            </DialogTitle>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 ring-4 ring-white dark:ring-neutral-900">
                <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-lg font-medium">
                  {selectedOrg?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                  {selectedOrg?.name}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {selectedOrg?.description}
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1.5 bg-blue-50/50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Users className="w-3 h-3" />
                    {selectedOrg?.members.length} members
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Members List */}
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-4 flex items-center justify-between px-1">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-neutral-400" />
                Members
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 gap-2 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <UserPlus className="h-4 w-4" />
                Add Member
              </Button>
            </h4>
            <div className="space-y-3">
              {selectedOrg?.members.map((member) => (
                <Entry key={member.id} data={member} variant="member" />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
