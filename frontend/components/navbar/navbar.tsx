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

  return (
    <AppBar position="sticky" className={styles.navbar}>
      <Toolbar className={styles.toolbar}>
        <Typography
          variant="h6"
          className={styles.logo}
          onClick={() => router.push("/home")}
        >
          Demo Task
        </Typography>

        {user && (
          <Box className={styles.centerSection}>
            <Stack direction="row" spacing={1}>
              <Button
                className={
                  pathname === "/dashboard"
                    ? styles.activeNavLink
                    : styles.navLink
                }
                color="inherit"
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
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
