import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

export interface ApplicationFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  jobId?: string;
}

export interface StatusUpdatePayload {
  applicationId: string;
  targetStatus: string;
  note?: string;
}

export const fetchMyApplications = createAsyncThunk(
  "applications/fetchMyApplications",
  async (params: ApplicationFilterParams = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/applications/my", { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch applications",
      );
    }
  },
);

export const fetchAdminApplications = createAsyncThunk(
  "applications/fetchAdminApplications",
  async (params: ApplicationFilterParams = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/applications/admin", { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch applications",
      );
    }
  },
);

export const applyJob = createAsyncThunk(
  "applications/applyJob",
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/applications/${jobId}/apply`, {
        jobId,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to apply for job",
      );
    }
  },
);

export const updateApplicationStatus = createAsyncThunk(
  "applications/updateApplicationStatus",
  async (
    { applicationId, targetStatus, note }: StatusUpdatePayload,
    { rejectWithValue },
  ) => {
    try {
      const response = await api.patch(
        `/applications/${applicationId}/status`,
        {
          targetStatus,
          note,
        },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update application status",
      );
    }
  },
);

export const fetchApplicationHistory = createAsyncThunk(
  "applications/fetchApplicationHistory",
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/applications/${applicationId}/history`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch application history",
      );
    }
  },
);
