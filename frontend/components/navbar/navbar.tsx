"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/features/hooks";
import { logout } from "@/features/auth/auth.action";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import styles from "./navbar.module.css";
import { useSnackbar } from "@/components/snackbar/snackbar";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const { showSnackbar } = useSnackbar();
  const { user } = useAppSelector((state) => state.auth);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    dispatch(logout());
    showSnackbar("Logged out successfully.", "success");
    router.push("/login");
  };

  const isAdmin = user?.role === "admin";

  return (
    <AppBar position="sticky" className={styles.navbar}>
      <Toolbar className={styles.toolbar}>
        <Typography
          variant="h6"
          className={styles.logo}
          onClick={() => router.push("/home")}
        >
          Mini ATS {isAdmin ? " Admin Portal" : " Candidate Portal"}
        </Typography>

        {isAdmin && (
          <Box className={styles.centerSection}>
            <Stack direction="row" spacing={1}>
              <Button
                className={
                  pathname === "/admin/jobs"
                    ? styles.activeNavLink
                    : styles.navLink
                }
                color="inherit"
                onClick={() => router.push("/admin/jobs")}
              >
                Manage Jobs
              </Button>
              <Button
                className={
                  pathname === "/admin/applications"
                    ? styles.activeNavLink
                    : styles.navLink
                }
                color="inherit"
                onClick={() => router.push("/admin/applications")}
              >
                Applications Pipeline
              </Button>
            </Stack>
          </Box>
        )}

        {!isAdmin && (
          <Box className={styles.centerSection}>
            <Stack direction="row" spacing={1}>
              <Button
                className={
                  pathname === "/applicant/jobs"
                    ? styles.activeNavLink
                    : styles.navLink
                }
                color="inherit"
                onClick={() => router.push("/applicant/jobs")}
              >
                Browse Jobs
              </Button>
              <Button
                className={
                  pathname === "/applicant/applications"
                    ? styles.activeNavLink
                    : styles.navLink
                }
                color="inherit"
                onClick={() => router.push("/applicant/applications")}
              >
                My Applications
              </Button>
              <Button
                className={
                  pathname === "/applicant/profile"
                    ? styles.activeNavLink
                    : styles.navLink
                }
                color="inherit"
                onClick={() => router.push("/applicant/profile")}
              >
                Profile
              </Button>
            </Stack>
          </Box>
        )}

        <Box className={styles.rightSection}>
          {user && user?.username && (
            <Typography className={styles.userName}>
              Welcome, {user.username}
            </Typography>
          )}

          <IconButton className={styles.menuButton} onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>

          <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}