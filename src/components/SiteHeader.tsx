"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTwinifyStore } from "@/store/twinify-store";

export function SiteHeader({ showLogout = false }: { showLogout?: boolean }) {
  const user = useTwinifyStore((s) => s.user);
  const setUser = useTwinifyStore((s) => s.setUser);
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-3 py-4 sm:px-6 sm:py-5">
      <Link href={user ? "/dashboard" : "/"} className="group min-w-0">
        <span className="brand-mark text-xl font-extrabold text-white transition group-hover:text-brand-200 sm:text-2xl">
          Twinify
        </span>
      </Link>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {user?.display_name ? (
          <span className="hidden max-w-[10rem] truncate text-sm text-brand-200 sm:inline">
            {user.display_name}
          </span>
        ) : null}
        {showLogout ? (
          <button
            type="button"
            onClick={logout}
            className="min-h-10 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-brand-100 hover:bg-white/5 active:scale-[0.98]"
          >
            Log Out
          </button>
        ) : null}
      </div>
    </header>
  );
}
