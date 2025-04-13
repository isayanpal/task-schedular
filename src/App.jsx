import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  Paper,
  Toolbar,
  AppBar,
  Box,
  Slide,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./App.css";
import TaskModal from "./components/TaskModal";
import TaskDetails from "./components/TaskDetails";
import { clearError, deleteTask } from "./slices/taskSlice";
import { format } from "date-fns";

const taskColors = ["#e0f7fa", "#f1f8e9", "#ffe0b2", "#f3e5f5", "#ede7f6"];

function App() {
  const { tasks, error } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [currentTimePosition, setCurrentTimePosition] = useState(null);

  const handleClose = () => {
    setSelectedTask(null);
    setOpen(false);
  };

  const openEdit = (task) => {
    setSelectedTask(task);
    setOpen(true);
  };

  const openDetails = (task) => {
    setSelectedTask(task);
    setDetailsOpen(true);
  };

  const closeDetails = () => {
    setSelectedTask(null);
    setDetailsOpen(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteTask(id));
  };

  const timeSlots = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`
  );
  const currentDate = format(new Date(), "EEEE, MMMM dd,yyyy");

  const renderTaskBlock = (task, index, startTime24, endTime24) => {
    const [sHour, sMinute] = startTime24.split(":").map(Number);
    const [eHour, eMinute] = endTime24.split(":").map(Number);

    const totalHoursInView = 24;
    const minutesPerHour = 60;
    const scheduleHeightVh = 70;
    const slotHeightVh = scheduleHeightVh / totalHoursInView;

    const top =
      sHour * slotHeightVh + (sMinute / minutesPerHour) * slotHeightVh;

    const durationHours = eHour - sHour;
    const durationMinutes = eMinute - sMinute;
    const totalDurationMinutes =
      durationHours * minutesPerHour + durationMinutes;
    const height = (totalDurationMinutes / minutesPerHour) * slotHeightVh;

    return (
      <Tooltip
        title={`${task.title}\n${task.description}\nFrom: ${task.startTime} - To: ${task.endTime}`}
        key={`${task.id}-${startTime24}-${endTime24}`}
      >
        <Box
          className="task-block"
          sx={{
            position: "absolute",
            left: 8,
            right: 8,
            background: taskColors[index % taskColors.length],
            borderLeft: `4px solid ${
              taskColors[((index % taskColors.length) * 2) % taskColors.length]
            }`,
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            padding: 1,
            borderRadius: 4,
            overflow: "hidden",
            zIndex: 1,
            transition:
              "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(1.01)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
            },
            top: `${top}vh`,
            height: `${height}vh`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: "#333",
                flexGrow: 1,
              }}
            >
              {task.title} - {task.startTime} to {task.endTime}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                size="small"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  openEdit(task);
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(task.id);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="action"
                onClick={(e) => {
                  e.stopPropagation();
                  openDetails(task);
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              fontSize: "0.8rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {task.description.length > 15
              ? `${task.description.slice(0, 15)}...`
              : task.description}
          </Typography>
        </Box>
      </Tooltip>
    );
  };

  useEffect(() => {
    const updateTimePosition = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      const percentage = (totalMinutes / (24 * 60)) * 70;
      setCurrentTimePosition(percentage);
    };

    updateTimePosition();
    const intervalId = setInterval(updateTimePosition, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(45deg, #6200ea 30%, #b388ff 90%)",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Task Scheduler
          </Typography>
          <Typography
            variant="subtitle1"
            color="inherit"
            sx={{
              fontWeight: 400,
              fontSize: "1rem",
              fontFamily: "Roboto, sans-serif",
            }}
          >
            {currentDate}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          flexGrow: 1,
          py: 3,
          px: 2,
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#e3f2fd",
        }}
      >
        <Paper
          sx={{
            width: "100%",
            maxWidth: 900,
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 2,
              borderBottom: "1px solid #e0e0e0",
              backgroundColor: "#bbdefb",
              color: "#333",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Today's Schedule
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
              sx={{
                borderRadius: 4,
                fontWeight: 500,
                textTransform: "capitalize",
                background: "linear-gradient(45deg, #6200ea 30%, #b388ff 90%)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #4a148c 30%, #9c27b0 90%)",
                },
              }}
            >
              Add Task
            </Button>
          </Box>
          <Box
            sx={{
              position: "relative",
              display: "flex",
              height: "70vh",
              overflowY: "auto",
              backgroundColor: "#fff",
            }}
          >
            <Box
              sx={{
                flexShrink: 0,
                width: 100,
                borderRight: "1px solid #e0e0e0",
                paddingTop: 1,
                backgroundColor: "#f9fafc",
              }}
            >
              {timeSlots.map((time, idx) => (
                <Box
                  key={idx}
                  sx={{
                    height: `calc(70vh / ${timeSlots.length})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    paddingLeft: 2,
                    boxSizing: "border-box",
                    borderBottom:
                      idx < timeSlots.length - 1 ? "1px solid #f0f0f0" : "none",
                    backgroundColor: idx % 2 === 0 ? "#f5f5f5" : "transparent",
                    borderRight: `1px solid #eee`,
                    marginLeft: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "#757575", fontSize: "0.8rem" }}
                  >
                    {time}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ flexGrow: 1, position: "relative", padding: 1 }}>
              {tasks.map((task, index) => {
                const [startHour, startMinute] = task.startTime
                  .split(":")
                  .map(Number);
                const [endHour, endMinute] = task.endTime
                  .split(":")
                  .map(Number);

                const isOvernight =
                  endHour < startHour ||
                  (endHour === startHour && endMinute < startMinute);

                if (isOvernight) {
                  const endOfDay = "23:59";
                  const startOfNextDay = "00:00";

                  const overlapEndOfDayStart = task.startTime;
                  const overlapEndOfDayEnd = endOfDay;

                  const overlapStartOfDayStart = startOfNextDay;
                  const overlapStartOfDayEnd = task.endTime;

                  return (
                    <React.Fragment key={`${task.id}-overnight-fragment`}>
                      {renderTaskBlock(
                        task,
                        index,
                        overlapEndOfDayStart,
                        overlapEndOfDayEnd
                      )}
                      <Box
                        key={`${task.id}-continued`}
                        className="task-block continued-task"
                        sx={{
                          position: "absolute",
                          left: 8,
                          right: 8,
                          background: taskColors[index % taskColors.length],
                          borderLeft: `4px solid ${
                            taskColors[
                              ((index % taskColors.length) * 2) %
                                taskColors.length
                            ]
                          }`,
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                          padding: 1,
                          borderRadius: 4,
                          overflow: "hidden",
                          zIndex: 1,
                          opacity: 0.75,
                          fontStyle: "italic",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          top: 0,
                          height: `calc((((${parseInt(
                            overlapStartOfDayEnd.split(":")[0]
                          )} * 60 + ${parseInt(
                            overlapStartOfDayEnd.split(":")[1]
                          )}) - (0 * 60 + 0)) / (24 * 60)) * 70vh)`,
                          "&::before": {
                            content: '"(Continued)"',
                            fontSize: "0.7rem",
                            color: "#555",
                          },
                        }}
                      ></Box>
                      <Box
                        sx={{
                          position: "absolute",
                          left: 4,
                          top: `calc((((${parseInt(
                            overlapEndOfDayEnd.split(":")[0]
                          )} * 60 + ${parseInt(
                            overlapEndOfDayEnd.split(":")[1]
                          )}) / (24 * 60)) * 70vh) - 8px)`,
                          width: 0,
                          height: 0,
                          borderTop: "8px solid #aaa",
                          borderLeft: "4px solid transparent",
                          borderRight: "4px solid transparent",
                          zIndex: 0,
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          left: 4,
                          top: `calc((((${parseInt(
                            overlapStartOfDayStart.split(":")[0]
                          )} * 60 + ${parseInt(
                            overlapStartOfDayStart.split(":")[1]
                          )}) / (24 * 60)) * 70vh) + 2px)`,
                          width: 0,
                          height: 0,
                          borderBottom: "8px solid #aaa",
                          borderLeft: "4px solid transparent",
                          borderRight: "4px solid transparent",
                          zIndex: 0,
                        }}
                      />
                    </React.Fragment>
                  );
                } else {
                  return renderTaskBlock(
                    task,
                    index,
                    task.startTime,
                    task.endTime
                  );
                }
              })}
              {currentTimePosition !== null && (
                <Box
                  sx={{
                    position: "absolute",
                    top: `${currentTimePosition}vh`,
                    left: 0,
                    right: 0,
                    height: "1px",
                    backgroundColor: "red",
                    zIndex: 2,
                    "&::after": {
                      content: '"Now"',
                      position: "absolute",
                      backgroundColor: "red",
                      color: "white",
                      fontSize: "0.7rem",
                      padding: "2px 4px",
                      borderRadius: "4px",
                      top: "-8px",
                      left: "105px",
                    },
                  }}
                />
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
      <TaskModal open={open} onClose={handleClose} task={selectedTask} />
      <TaskDetails
        open={detailsOpen}
        onClose={closeDetails}
        task={selectedTask}
      />
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => dispatch(clearError())}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: "up" }}
        sx={{
          "& .MuiAlert-root": {
            borderRadius: 4,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <Alert
          severity="error"
          onClose={() => dispatch(clearError())}
          elevation={3}
          variant="filled"
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
