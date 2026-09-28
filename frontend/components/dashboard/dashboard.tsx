"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/features/hooks";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role === "admin") {
      router.push("/admin/jobs");
    } else {
      router.push("/applicant/jobs");
    }
  }, [user, router]);

  return null;
}
