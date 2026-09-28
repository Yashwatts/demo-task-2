"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/features/hooks";
import styles from "./status-history.module.css";
import { fetchApplicationHistory } from "@/features/applications/applications.action";

interface StatusTimelineDialogProps {
  applicationId: string;
  open: boolean;
  onClose: () => void;
}

export const StatusTimelineDialog: React.FC<StatusTimelineDialogProps> = ({
  applicationId,
  open,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { activeHistory, isLoading } = useAppSelector(
    (state) => state.applications,
  );

  useEffect(() => {
    if (applicationId && open) {
      dispatch(fetchApplicationHistory(applicationId));
    }
  }, [applicationId, open, dispatch]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Application Status Audit Trail</DialogTitle>
      <DialogContent sx={{ mt: 1 }}>
        {isLoading ? (
          <Box>
            <CircularProgress />
          </Box>
        ) : activeHistory.length === 0 ? (
          <Typography color="text.secondary">
            No status transitions recorded.
          </Typography>
        ) : (
          <Box className={styles.historyList}>
            {activeHistory.map((item: any) => {
              const previousStatus = item.previousStatus || item.previous_status;
              const newStatus = item.newStatus || item.new_status;
              const changedByName = item.changedByName || item.changed_by_name;
              const changedByRole = item.changedByRole || item.changed_by_role;
              const createdAt = item.createdAt || item.created_at;
              return (
                <Paper key={item.id} className={styles.historyItem} elevation={0}>
                  <Box className={styles.headerRow}>
                    <Typography variant="subtitle2">
                      {previousStatus ? `${previousStatus.toUpperCase()} → ` : ""}
                      {newStatus ? newStatus.toUpperCase() : ""}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {createdAt ? new Date(createdAt).toLocaleString() : ""}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    Changed by: <b>{changedByName}</b> ({changedByRole})
                  </Typography>
                  {item.note && (
                    <Typography variant="body2" color="text.secondary">
                      Note: "{item.note}"
                    </Typography>
                  )}
                </Paper>
              );
            })}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
