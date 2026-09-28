"use client";

import { useAppDispatch, useAppSelector } from "@/features/hooks";
import { loginSchema, LoginSchema } from "@/schemas/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSnackbar } from "../snackbar/snackbar";
import { login } from "@/features/auth/auth.action";
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import styles from "./login-form.module.css";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });
  const { showSnackbar } = useSnackbar();

  const onSubmit = async (userData: LoginSchema) => {
    try {
      const result = await dispatch(login(userData));
      if (login.fulfilled.match(result)) {
        router.push("/dashboard");
        showSnackbar("Login successful!", "success");
      } else {
        showSnackbar("Login failed. Please check your credentials.", "error");
      }
    } catch (error) {
      showSnackbar("An error occurred during login.", "error");
    }
  };

  return (
    <Box className={styles.formContainer}>
      <Paper elevation={3} className={styles.formCard}>
        <Typography className={styles.loginText}>Login</Typography>
        <TextField
          label="Email Or Username"
          {...register("usernameOrEmail")}
          error={!!errors.usernameOrEmail}
          helperText={errors.usernameOrEmail?.message}
        />
        <TextField
          label="Password"
          type="password"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
          className={styles.loginButton}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
        <Divider style={{ margin: "16px 0" }} />
        <Stack direction="row" spacing={1} className={styles.signupPrompt}>
          <Typography>Don't have an account?</Typography>
          <Button
            variant="text"
            onClick={() => router.push("/signup")}
            className={styles.signupButton}
          >
            Signup
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
