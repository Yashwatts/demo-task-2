import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/auth.slice";
import jobsReducer from "./jobs/jobs.slice";
import applicationsReducer from "./applications/applications.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    applications: applicationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
