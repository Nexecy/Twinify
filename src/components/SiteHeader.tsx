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
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
      <Link href={user ? "/dashboard" : "/"} className="group">
        <span className="brand-mark text-2xl font-extrabold text-white transition group-hover:text-brand-200">
          Twinify
        </span>
      </Link>
      <div className="flex items-center gap-3">
        {user?.display_name ? (
          <span className="hidden text-sm text-brand-200 sm:inline">
            {user.display_name}
          </span>
        ) : null}
        {showLogout ? (
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-brand-100 hover:bg-white/5"
          >
            Log out
          </button>
        ) : null}
      </div>
    </header>
  );
}
