"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  Button,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/features/hooks";
import {
  fetchAdminApplications,
  updateApplicationStatus,
} from "@/features/applications/applications.action";
import {
  setActiveStatusFilter,
  setPage,
} from "@/features/applications/applications.slice";
import styles from "./application-list.module.css";
import { StatusTimelineDialog } from "../status-history/status-history";

const STAGES = [
  "all",
  "applied",
  "shortlisted",
  "interview",
  "offer",
  "hired",
  "rejected",
];

export const AdminApplicationList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, totalPages, page, activeStatusFilter, isLoading } =
    useAppSelector((state) => state.applications);

  const [historyAppId, setHistoryAppId] = useState<string | null>(null);
  const [statusModalAppId, setStatusModalAppId] = useState<string | null>(null);
  const [targetStatus, setTargetStatus] = useState<string>("shortlisted");
  const [note, setNote] = useState("");

  useEffect(() => {
    dispatch(
      fetchAdminApplications({
        page,
        status: activeStatusFilter === "all" ? undefined : activeStatusFilter,
      }),
    );
  }, [dispatch, page, activeStatusFilter]);

  const handleOpenStatusModal = (appId: string, currentStatus: string) => {
    setStatusModalAppId(appId);
    setTargetStatus(currentStatus);
    setNote("");
  };

  const handleSaveStatus = async () => {
    if (statusModalAppId) {
      await dispatch(
        updateApplicationStatus({
          applicationId: statusModalAppId,
          targetStatus,
          note,
        }),
      );
      setStatusModalAppId(null);
      dispatch(
        fetchAdminApplications({
          page,
          status: activeStatusFilter === "all" ? undefined : activeStatusFilter,
        }),
      );
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h5">Candidate Applications Pipeline</Typography>
      </Box>

      <Box className={styles.filterBar}>
        {STAGES.map((stage) => (
          <Button
            key={stage}
            variant={activeStatusFilter === stage ? "contained" : "outlined"}
            onClick={() => dispatch(setActiveStatusFilter(stage))}
          >
            {stage.toUpperCase()}
          </Button>
        ))}
      </Box>

      <Paper className={styles.tableCard} elevation={0}>
        {isLoading ? (
          <Box>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Candidate Name</TableCell>
                <TableCell>Target Job</TableCell>
                <TableCell>Experience</TableCell>
                <TableCell>Rejections Count</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    {app.applicantName} ({app.applicantEmail})
                  </TableCell>
                  <TableCell>{app.jobTitle}</TableCell>
                  <TableCell>{app.yearsOfExperience ?? 0} yrs</TableCell>
                  <TableCell>
                    <Chip
                      label={`${app.candidateRejectionCount ?? 0} Rejections`}
                      color={
                        (app.candidateRejectionCount ?? 0) > 0
                          ? "warning"
                          : "default"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={app.status.toUpperCase()}
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      onClick={() => handleOpenStatusModal(app.id, app.status)}
                    >
                      Update Status
                    </Button>
                    <Button
                      size="small"
                      onClick={() => setHistoryAppId(app.id)}
                    >
                      Audit History
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Box>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => dispatch(setPage(value))}
          />
        </Box>
      </Paper>

      <Dialog
        open={Boolean(statusModalAppId)}
        onClose={() => setStatusModalAppId(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Update Candidate Status</DialogTitle>
        <DialogContent>
          <Box>
            <Select
              fullWidth
              value={targetStatus}
              onChange={(e) => setTargetStatus(e.target.value)}
            >
              <MenuItem value="applied">Applied</MenuItem>
              <MenuItem value="shortlisted">Shortlisted</MenuItem>
              <MenuItem value="interview">Interview</MenuItem>
              <MenuItem value="offer">Offer</MenuItem>
              <MenuItem value="hired">Hired</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
            <TextField
              label="Transition Audit Note"
              multiline
              rows={3}
              fullWidth
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusModalAppId(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveStatus}>
            Confirm Change
          </Button>
        </DialogActions>
      </Dialog>

      {historyAppId && (
        <StatusTimelineDialog
          applicationId={historyAppId}
          open={Boolean(historyAppId)}
          onClose={() => setHistoryAppId(null)}
        />
      )}
    </Box>
  );
};
