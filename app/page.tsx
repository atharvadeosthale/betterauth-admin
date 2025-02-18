import SignIn from "@/components/sign-in";

export default function Home() {
  return (
    <main className="min-h-screen w-full relative flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
      {/* Background blur elements */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-200 dark:bg-blue-500/20 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-orange-200 dark:bg-orange-500/20 rounded-full blur-3xl opacity-60" />

      {/* Content container */}
      <div className="relative w-full max-w-lg mx-auto p-4 sm:p-6 lg:p-8">
        {/* Logo/Brand section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent">
            BetterAuth Admin
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Manage your BetterAuth instance
          </p>
        </div>

        {/* Sign-in component */}
        <div className="backdrop-blur-sm bg-white/50 dark:bg-neutral-900/50 rounded-2xl p-1">
          <SignIn />
        </div>
      </div>
    </main>
  );
}
