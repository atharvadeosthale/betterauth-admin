"use client";

import { ModeToggle } from "@/components/theme-toggler";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Building2, Search, User, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

const navigation = [
  {
    name: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    name: "Organizations",
    href: "/dashboard/organizations",
    icon: Building2,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-r border-neutral-200/50 dark:border-neutral-800/50 p-6">
        {/* Logo */}
        <div className="mb-10">
          <Link href="/dashboard/users" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neutral-900 to-neutral-600 dark:from-neutral-200 dark:to-neutral-400 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white dark:text-neutral-950" />
            </div>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent">
              BetterAuth Admin
            </h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                  isActive
                    ? "text-neutral-900 dark:text-neutral-100 bg-neutral-900/5 dark:bg-neutral-100/5"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-900/[0.03] dark:hover:bg-neutral-100/[0.03]"
                )}
              >
                <item.icon
                  className={cn(
                    "w-4 h-4",
                    isActive && "text-blue-600 dark:text-blue-400"
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-72">
        {/* Topbar */}
        <header className="h-16 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-800/50 px-6 flex items-center justify-between sticky top-0 z-10">
          {/* Search */}
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400" />
              <Input
                placeholder="Search anything..."
                className="pl-10 bg-neutral-100/50 dark:bg-neutral-800/50 border-neutral-200/50 dark:border-neutral-800/50 rounded-xl h-10 transition-all duration-200 focus:ring-2 ring-blue-600/10 dark:ring-blue-400/10 focus:border-blue-600/20 dark:focus:border-blue-400/20"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            <ModeToggle />
            <div className="h-7 w-[1px] bg-neutral-200/50 dark:bg-neutral-800/50" />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl w-10 h-10 bg-neutral-100/50 dark:bg-neutral-800/50 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50"
            >
              {session?.user.image ? (
                <img
                  src={session.user.image}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <User className="w-4 h-4" />
              )}
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
