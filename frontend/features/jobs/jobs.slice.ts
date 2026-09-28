import { createSlice } from "@reduxjs/toolkit";
import { closeJob, createJob, editJob, fetchJobs } from "./jobs.action";

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType?: "full-time" | "part-time" | "contract" | "internship";
  employment_type?: "full-time" | "part-time" | "contract" | "internship";
  minimumExperience?: number;
  minimum_experience?: number;
  requiredSkills?: string[];
  required_skills?: string[];
  applicationDeadline?: string;
  application_deadline?: string;
  status: "open" | "closed";
  createdAt?: string;
  created_at?: string;
}

interface JobState {
  items: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  isSubmitting: boolean;
  searchQuery: string;
  selectedDepartment: string;
  selectedType: string;
  error: string | null;
  successMessage: string | null;
}

const initialState: JobState = {
  items: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  isLoading: false,
  isSubmitting: false,
  searchQuery: "",
  selectedDepartment: "",
  selectedType: "",
  error: null,
  successMessage: null,
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.page = 1;
    },
    setSelectedDepartment: (state, action) => {
      state.selectedDepartment = action.payload;
      state.page = 1;
    },
    setSelectedType: (state, action) => {
      state.selectedType = action.payload;
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    clearJobMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        const meta = action.payload.meta || action.payload;
        state.total = meta.total || 0;
        state.page = meta.page || 1;
        state.limit = meta.limit || 10;
        state.totalPages = meta.totalPages || 1;
      })

      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(createJob.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const newJob = action.payload?.job || action.payload;
        if (newJob && newJob.id) {
          state.items.unshift(newJob);
        }
        state.successMessage = "Job created successfully!";
      })
      .addCase(createJob.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      .addCase(editJob.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(editJob.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const updatedJob = action.payload?.job || action.payload;
        if (updatedJob && updatedJob.id) {
          const index = state.items.findIndex(
            (job) => job.id === updatedJob.id,
          );
          if (index !== -1) {
            state.items[index] = updatedJob;
          }
        }
        state.successMessage = "Job updated successfully!";
      })
      .addCase(editJob.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      .addCase(closeJob.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(closeJob.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const closedJob = action.payload?.job || action.payload;
        if (closedJob && closedJob.id) {
          const index = state.items.findIndex(
            (job) => job.id === closedJob.id,
          );
          if (index !== -1) {
            state.items[index].status = "closed";
          }
        }
        state.successMessage = "Job marked as closed!";
      })
      .addCase(closeJob.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchQuery,
  setSelectedDepartment,
  setSelectedType,
  setPage,
  clearJobMessages,
} = jobsSlice.actions;
export default jobsSlice.reducer;
