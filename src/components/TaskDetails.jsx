import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function TaskDetails({ open, onClose, task }) {
  if (!task) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          borderRadius: 12,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          color: "#2e7d32",
          padding: "20px 24px",
          borderBottom: `1px solid #e0e0e0`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Task Details
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: "24px" }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, mb: 1, color: "#1a237e" }}
          >
            {task.title}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ lineHeight: 1.6 }}
          >
            {task.description || (
              <Typography variant="italic" color="textSecondary">
                No description provided.
              </Typography>
            )}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 500, color: "#0288d1", mb: 0.5 }}
          >
            Time
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <Typography
              component="span"
              sx={{ fontWeight: 500, color: "#43a047" }}
            >
              Start:
            </Typography>{" "}
            {task.startTime}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <Typography
              component="span"
              sx={{ fontWeight: 500, color: "#f57c00" }}
            >
              End:
            </Typography>{" "}
            {task.endTime}
          </Typography>
        </Box>
        {task.priority && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 500, color: "#ffb300", mb: 0.5 }}
            >
              Priority
            </Typography>
            <Typography
              variant="body1"
              color={
                task.priority === "High"
                  ? "#d32f2f"
                  : task.priority === "Medium"
                  ? "#ed6c02"
                  : "#388e3c"
              }
            >
              {task.priority}
            </Typography>
          </Box>
        )}
        {task.dueDate && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 500, color: "#9c27b0", mb: 0.5 }}
            >
              Due Date
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {task.dueDate}
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default TaskDetails;
