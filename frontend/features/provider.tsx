"use client";

import { Provider } from "react-redux";
import { store } from "@/features/store";
import { SnackbarProvider } from "@/components/snackbar/snackbar";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <SnackbarProvider>{children}</SnackbarProvider>
    </Provider>
  );
}
