"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/features/store";
import { checkAuth } from "@/features/auth/auth.action";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { Navbar } from "@/components/navbar/navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        await dispatch(checkAuth()).unwrap();
      } catch (err) {
        router.push("/login");
      } finally {
        setAuthChecked(true);
      }
    };

    if (!user) {
      verifyUser();
    } else {
      setAuthChecked(true);
    }
  }, [dispatch, router, user]);

  if (!authChecked || isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col">
      <Navbar />
      {children}
    </div>
  );
}
