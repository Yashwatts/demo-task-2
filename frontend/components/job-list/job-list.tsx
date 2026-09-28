"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/features/hooks";
import {
  fetchJobs,
  createJob,
  editJob,
  closeJob,
} from "@/features/jobs/jobs.action";
import { setSearchQuery, setPage } from "@/features/jobs/jobs.slice";
import styles from "./job-list.module.css";

export const AdminJobList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, totalPages, page, searchQuery, isLoading } = useAppSelector(
    (state) => state.jobs,
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("full-time");
  const [minimumExperience, setMinimumExperience] = useState(0);
  const [skillsStr, setSkillsStr] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    dispatch(fetchJobs({ page, search: searchQuery }));
  }, [dispatch, page, searchQuery]);

  const handleOpenCreate = () => {
    setEditingJobId(null);
    setTitle("");
    setDepartment("");
    setLocation("");
    setEmploymentType("full-time");
    setMinimumExperience(0);
    setSkillsStr("");
    setDeadline("");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const skills = skillsStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (editingJobId) {
      await dispatch(
        editJob({
          id: editingJobId,
          payload: {
            title,
            department,
            location,
            employmentType,
            minimumExperience: Number(minimumExperience),
            requiredSkills: skills,
            applicationDeadline: deadline,
          },
        }),
      );
    } else {
      await dispatch(
        createJob({
          title,
          department,
          location,
          employmentType,
          minimumExperience: Number(minimumExperience),
          requiredSkills: skills,
          applicationDeadline: deadline,
        }),
      );
    }
    setDialogOpen(false);
    dispatch(fetchJobs({ page, search: searchQuery }));
  };

  const handleClosePosting = async (id: string) => {
    await dispatch(closeJob(id));
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h5">Job Postings Management</Typography>
        <Button variant="contained" onClick={handleOpenCreate}>
          Create New Job
        </Button>
      </Box>

      <TextField
        placeholder="Search job title or department..."
        size="small"
        className={styles.searchBar}
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
      />

      <Paper className={styles.tableCard} elevation={0}>
        {isLoading ? (
          <Box>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Job Title</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Experience</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{job.department}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>{job.employmentType}</TableCell>
                  <TableCell>{job.minimumExperience}+ yrs</TableCell>
                  <TableCell>
                    <Chip
                      label={job.status.toUpperCase()}
                      color={job.status === "open" ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {job.status === "open" && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleClosePosting(job.id)}
                      >
                        Close Posting
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Box className={styles.pagination}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => dispatch(setPage(value))}
          />
        </Box>
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingJobId ? "Edit Job Posting" : "Post New Job"}
        </DialogTitle>
        <DialogContent>
          <Box>
            <TextField
              label="Job Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label="Department"
              fullWidth
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
            <TextField
              label="Location"
              fullWidth
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <TextField
              select
              label="Employment Type"
              fullWidth
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
            >
              <MenuItem value="full-time">Full Time</MenuItem>
              <MenuItem value="part-time">Part Time</MenuItem>
              <MenuItem value="contract">Contract</MenuItem>
              <MenuItem value="internship">Internship</MenuItem>
            </TextField>
            <TextField
              label="Minimum Experience (Years)"
              type="number"
              fullWidth
              value={minimumExperience}
              onChange={(e) => setMinimumExperience(Number(e.target.value))}
            />
            <TextField
              label="Required Skills (Comma separated)"
              fullWidth
              value={skillsStr}
              onChange={(e) => setSkillsStr(e.target.value)}
            />
            <TextField
              label="Deadline Date"
              type="date"
              fullWidth
              slotProps={{
                inputLabel: { shrink: true },
              }}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save Posting
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
