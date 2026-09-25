"use client";

import { useAppDispatch, useAppSelector } from "@/features/hooks";
import { signupSchema, SignupSchema } from "@/schemas/signup-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSnackbar } from "../snackbar/snackbar";
import { signup } from "@/features/auth/auth.action";
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import styles from "./signup-form.module.css";

export default function SignupForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });
  const { showSnackbar } = useSnackbar();

  const onSubmit = async (userData: SignupSchema) => {
    try {
      const result = await dispatch(signup(userData));
      if (signup.fulfilled.match(result)) {
        showSnackbar("Signup successful!", "success");
        router.push("/login");
      } else {
        showSnackbar("Signup failed. Please try again.", "error");
      }
    } catch (error) {
      showSnackbar("An error occurred during signup.", "error");
    }
  };

  return (
    <Box className={styles.formContainer}>
      <Paper elevation={3} className={styles.formCard}>
        <Typography className={styles.signupText}>Signup</Typography>
        <TextField
          label="Username"
          {...register("username")}
          error={!!errors.username}
          helperText={errors.username?.message}
        />
        <TextField
          label="Email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
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
          className={styles.signupButton}
        >
          Signup
        </Button>
        <Divider style={{ margin: "16px 0" }} />
        <Stack direction="row" spacing={1} className={styles.loginPrompt}>
          <Typography>Already have an account?</Typography>
          <Button
            variant="text"
            onClick={() => router.push("/login")}
            className={styles.loginButton}
          >
            Login
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
