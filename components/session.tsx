import type { Session } from "better-auth/types";
import { Chrome, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { revokeSession } from "@/lib/mutation";
import { toast } from "sonner";

export default function Session({
  session,
  refetchSessions = () => {},
}: {
  session: Session;
  refetchSessions?: () => void;
}) {
  const { mutate: revoke } = useMutation({
    mutationFn: () => revokeSession(session.token),
    onSuccess: async () => {
      toast.success("Session revoked");
      await refetchSessions();
    },
    onError: () => toast.error("Failed to revoke session"),
  });

  return (
    <div
      key={session.id}
      className="flex items-center justify-between p-4 rounded-xl bg-white/40 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-neutral-800/50 group hover:bg-white/60 dark:hover:bg-neutral-800/60 transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center ring-2 ring-white dark:ring-neutral-900 shrink-0">
          <Chrome className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
              {session.userAgent}
            </p>
            {/* {session.id && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                tabIndex={-1}
                                className="focus:outline-none"
                              >
                                <UserCircle2 className="w-3.5 h-3.5 text-neutral-400" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              Impersonated by {session.impersonatedBy.email}
                            </TooltipContent>
                          </Tooltip>
                        )} */}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {session.ipAddress}
            </p>
            {/* <span className="text-xs text-neutral-600 dark:text-neutral-400">
                          •
                        </span>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          {session.lastActive}
                        </p> */}
          </div>
        </div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="gap-2 text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-500/10"
        onClick={() => revoke()}
      >
        <LogOut className="h-4 w-4" />
        Revoke
      </Button>
    </div>
  );
}
