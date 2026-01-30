"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/store-hook";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const userRole = useAppSelector((state) => state.user.role);
  const token = useAppSelector((state) => state.user.token);
  const isLoading = useAppSelector((state) => state.user.isLoading);

  useEffect(() => {
    if (!isLoading && token && userRole !== "ADMIN") {
      router.push("/home");
    }
  }, [userRole, token, isLoading, router]);

  if (!token || (token && userRole !== "ADMIN")) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  // Render admin content if user is admin
  return <>{children}</>;
}
