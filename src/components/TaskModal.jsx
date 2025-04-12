import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { addTask, editTask } from "../slices/taskSlice";

function TaskModal({ open, onClose, task }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(dayjs().hour(9).minute(0));
  const [endTime, setEndTime] = useState(dayjs().hour(10).minute(0));
  const dispatch = useDispatch();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStartTime(dayjs(`2025-01-01T${task.startTime}`));
      setEndTime(dayjs(`2025-01-01T${task.endTime}`));
    } else {
      setTitle("");
      setDescription("");
      setStartTime(dayjs().hour(9).minute(0));
      setEndTime(dayjs().hour(10).minute(0));
    }
  }, [task]);

  const handleSave = () => {
    const payload = {
      id: task ? task.id : uuidv4(),
      title,
      description,
      startTime: startTime.format("HH:mm"),
      endTime: endTime.format("HH:mm"),
    };
    if (task) dispatch(editTask(payload));
    else dispatch(addTask(payload));
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{ style: { borderRadius: 8 } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            color: "#fff",
            padding: "16px 24px",
            background: "linear-gradient(90deg, #3f51b5, #5c6bc0)",
          }}
        >
          {task ? "Edit Task" : "Add New Task"}
        </DialogTitle>
        <DialogContent sx={{ padding: "16px 24px" }}>
          <TextField
            fullWidth
            margin="dense"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Description"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={setStartTime}
                renderInput={(params) => (
                  <TextField {...params} fullWidth variant="outlined" />
                )}
                sx={{ mb: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TimePicker
                label="End Time"
                value={endTime}
                onChange={setEndTime}
                renderInput={(params) => (
                  <TextField {...params} fullWidth variant="outlined" />
                )}
                sx={{ mb: 1 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button onClick={onClose} color="grey" sx={{ fontWeight: 500 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              fontWeight: 500,
              borderRadius: 2,
              background: "linear-gradient(90deg, #3f51b5, #5c6bc0)",
            }}
          >
            Save Task
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}

export default TaskModal;
