import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  applyJob,
  fetchAdminApplications,
  fetchApplicationHistory,
  fetchMyApplications,
  updateApplicationStatus,
} from "./applications.action";

export interface StatusHistory {
  id: string;
  applicationId: string;
  previousStatus: string | null;
  newStatus: string;
  changedById: string;
  changedByName: string;
  changedByRole: string;
  note: string | null;
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  status:
    | "applied"
    | "shortlisted"
    | "interview"
    | "offer"
    | "hired"
    | "rejected"
    | "withdrawn";
  appliedAt: string;
  jobTitle?: string;
  companyDepartment?: string;
  applicantName?: string;
  applicantEmail?: string;
  yearsOfExperience?: number;
  skills?: string[];
  resumeUrl?: string;
  aboutMe?: string;
  candidateRejectionCount?: number;
}

interface ApplicationsState {
  items: Application[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  activeHistory: StatusHistory[];
  isLoading: boolean;
  isSubmitting: boolean;
  activeStatusFilter: string;
  searchQuery: string;
  error: string | null;
  successMessage: string | null;
}

const initialState: ApplicationsState = {
  items: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  activeHistory: [],
  isLoading: false,
  isSubmitting: false,
  activeStatusFilter: "all",
  searchQuery: "",
  error: null,
  successMessage: null,
};

const applicationsSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    setActiveStatusFilter: (state, action) => {
      state.activeStatusFilter = action.payload;
      state.page = 1;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    clearApplicationMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAdminApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAdminApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(applyJob.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(applyJob.fulfilled, (state) => {
        state.isSubmitting = false;
        state.successMessage = "Application submitted successfully!";
      })
      .addCase(applyJob.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      .addCase(updateApplicationStatus.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const updated = action.payload.application;
        const index = state.items.findIndex((a) => a.id === updated.id);
        if (index !== -1) {
          state.items[index].status = updated.status;
        }
        state.successMessage = `Status updated to ${updated.status}!`;
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      .addCase(fetchApplicationHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchApplicationHistory.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.activeHistory = action.payload.history || action.payload;
        },
      )
      .addCase(fetchApplicationHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setActiveStatusFilter,
  setSearchQuery,
  setPage,
  clearApplicationMessages,
} = applicationsSlice.actions;
export default applicationsSlice.reducer;
