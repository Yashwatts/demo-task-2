"use client";

import React, { useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Button,
  Chip,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/features/hooks";
import { fetchJobs } from "@/features/jobs/jobs.action";
import { setSearchQuery, setPage } from "@/features/jobs/jobs.slice";
import { applyJob } from "@/features/applications/applications.action";
import styles from "./job-browser.module.css";

export const ApplicantJobBrowser: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, totalPages, page, searchQuery, isLoading } = useAppSelector(
    (state) => state.jobs,
  );
  const { isSubmitting } = useAppSelector((state) => state.applications);

  useEffect(() => {
    dispatch(fetchJobs({ page, search: searchQuery, status: "open" }));
  }, [dispatch, page, searchQuery]);

  const handleApply = async (jobId: string) => {
    await dispatch(applyJob(jobId));
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h5">Available Open Roles</Typography>

      <TextField
        placeholder="Search job title, skills, or department..."
        size="small"
        className={styles.searchBar}
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
      />

      {isLoading ? (
        <Box>
          <CircularProgress />
        </Box>
      ) : (
        <Box className={styles.jobGrid}>
          {items.map((job) => (
            <Paper key={job.id} className={styles.jobCard} elevation={0}>
              <Box className={styles.jobHeader}>
                <Box>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.department} • {job.location} • {job.employmentType}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  disabled={isSubmitting}
                  onClick={() => handleApply(job.id)}
                >
                  Quick Apply
                </Button>
              </Box>

              <Typography variant="body2">
                Required Experience: <b>{job.minimumExperience}+ years</b>
              </Typography>

              <Box>
                {job.requiredSkills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      <Box>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => dispatch(setPage(value))}
        />
      </Box>
    </Box>
  );
};
