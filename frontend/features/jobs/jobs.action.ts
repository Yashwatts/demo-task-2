import { api } from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface JobFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  location?: string;
  employmentType?: string;
  minExperience?: number;
  status?: string;
}

export interface CreateJobPayload {
  title: string;
  department: string;
  location: string;
  employmentType: string;
  minimumExperience: number;
  requiredSkills: string[];
  applicationDeadline: string;
}

export interface EditJobPayload extends Partial<CreateJobPayload> {
  status?: "open" | "closed";
}

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (params: JobFilterParams = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/jobs", { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch jobs",
      );
    }
  },
);

export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (payload: CreateJobPayload, { rejectWithValue }) => {
    try {
      const response = await api.post("/jobs", payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create job",
      );
    }
  },
);

export const editJob = createAsyncThunk(
  "jobs/editJob",
  async (
    { id, payload }: { id: string; payload: EditJobPayload },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put(`/jobs/${id}`, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to edit job",
      );
    }
  },
);

export const closeJob = createAsyncThunk(
  "jobs/closeJob",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/jobs/${id}/close`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to close job",
      );
    }
  },
);
