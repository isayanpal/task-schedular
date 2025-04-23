import React, { useState, useEffect } from "react";
import "./App.css";
import TaskModal from "./components/TaskModal";
import TaskDetails from "./components/TaskDetails";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask } from "./slices/taskSlice";
import { SquarePen, Trash2, Eye } from "lucide-react";
import { Tooltip } from "@mui/material";

const taskColors = ["#cce0ff", "#ccf5e0", "#ffe0b2", "#f3e5f5", "#ede7f6"];

function App() {
  const { tasks, error } = useSelector((state) => state.tasks);

  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [currentTimePosition, setCurrentTimePosition] = useState(null);
  const [hoveredTask, setHoveredTask] = useState(null);

  const dispatch = useDispatch();

  const timeSlots = [
    "0:00",
    "1:00",
    "2:00",
    "3:00",
    "4:00",
    "5:00",
    "6:00",
    "7:00",
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];

  // Get current date formatted
  const getCurrentDate = () => {
    const now = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const day = days[now.getDay()];
    const month = months[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();
    return `${day}, ${month} ${date}, ${year}`;
  };

  // Modal handlers
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

  // Calculate position for current time indicator
  useEffect(() => {
    const updateTimePosition = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      const percentage = (totalMinutes / (24 * 60)) * 100;
      setCurrentTimePosition(percentage);
    };

    updateTimePosition();
    const intervalId = setInterval(updateTimePosition, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  // Helper to convert time string to position
  const getTaskPosition = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;
    return (totalMinutes / (24 * 60)) * 100;
  };

  // Calculate task height based on duration
  const getTaskHeight = (startTime, endTime) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    let endTotalMinutes = endHours * 60 + endMinutes;

    // If the end time is before the start time, it spans midnight
    if (endTotalMinutes <= startTotalMinutes) {
      endTotalMinutes += 24 * 60; // Add 24 hours in minutes
    }

    const durationMinutes = endTotalMinutes - startTotalMinutes;

    // Convert to percentage of our display range (24 hours = 1440 minutes)
    return (durationMinutes / 1440) * 100;
  };

  // Render task in the calendar
  const renderTask = (task, index) => {
    const [startHour, startMinute] = task.startTime.split(":").map(Number);
    const [endHour, endMinute] = task.endTime.split(":").map(Number);

    const isOvernight =
      endHour < startHour || (endHour === startHour && endMinute < startMinute);

    if (isOvernight) {
      const endOfDay = "23:59";
      const startOfNextDay = "00:00";

      const topEndOfDay = getTaskPosition(task.startTime);
      const heightEndOfDay = getTaskHeight(task.startTime, endOfDay);

      const topStartOfDay = getTaskPosition(startOfNextDay); // Should be 0
      const heightStartOfDay = getTaskHeight(startOfNextDay, task.endTime);

      const backgroundColor = taskColors[index % taskColors.length];

      return (
        <React.Fragment key={`${task.id}-overnight-fragment`}>
          {/* Part 1: End of Day */}
          <Tooltip
            title={
              task.description.length > 15
                ? `${task.description.substring(0, 15)}...`
                : `Click to view ${task.description}`
            }
            key={task.id}
            arrow
          >
            <div
              className="task-block overnight-part-1"
              style={{
                position: "absolute",
                top: `${topEndOfDay}%`,
                height: `${heightEndOfDay}%`,
                left: "10px",
                right: "10px",
                backgroundColor,
                borderLeft: `4px solid ${backgroundColor}`,
                zIndex: 1,
                opacity: 0.8,
              }}
            >
              <div className="task-content">
                <div className="task-header">
                  <div className="task-title">{task.title} (Cont.)</div>
                </div>
              </div>
            </div>
          </Tooltip>

          {/* Part 2: Start of Next Day */}
          <Tooltip
            title={
              task.description.length > 15
                ? `${task.description.substring(0, 15)}...`
                : `Click to view ${task.description}`
            }
            key={task.id}
            arrow
          >
            <div
              className="task-block overnight-part-2"
              style={{
                position: "absolute",
                top: `0%`, // Starts at the top of the next day's view
                height: `${heightStartOfDay}%`,
                left: "10px",
                right: "10px",
                backgroundColor,
                borderLeft: `4px solid ${backgroundColor}`,
                zIndex: 1,
                fontStyle: "italic",
              }}
            >
              <div className="task-content">
                <div className="task-header">
                  <div className="task-title">(Cont.) {task.title}</div>
                  <div className="task-actions">
                    <button
                      className="task-action-btn edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(task);
                      }}
                    >
                      <SquarePen size={15} />
                    </button>
                    <button
                      className="task-action-btn delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(task.id);
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                    <button
                      className="task-action-btn view"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetails(task);
                      }}
                    >
                      <Eye size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Tooltip>
        </React.Fragment>
      );
    } else {
      // Render normal single-day task
      const top = getTaskPosition(task.startTime);
      const height = getTaskHeight(task.startTime, task.endTime);
      const backgroundColor = taskColors[index % taskColors.length];

      return (
        <Tooltip
          title={
            task.description.length > 15
              ? `${task.description.substring(0, 15)}...`
              : `Click to view ${task.description}`
          }
          key={task.id}
          arrow
        >
          <div
            className="task-block"
            key={task.id}
            style={{
              position: "absolute",
              top: `${top}%`,
              height: `${height}%`,
              left: "10px",
              right: "10px",
              backgroundColor,
              borderLeft: `4px solid ${backgroundColor}`,
              zIndex: 1,
            }}
            onMouseEnter={() => setHoveredTask(task)}
            onMouseLeave={() => setHoveredTask(null)}
          >
            <div className="task-content">
              <div className="task-header">
                <div className="task-title-desc-wrapper">
                  <div className="task-title">{task.title}</div>
                </div>
                <div className="task-actions">
                  <button
                    className="task-action-btn edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(task);
                    }}
                  >
                    <SquarePen size={15} />
                  </button>
                  <button
                    className="task-action-btn delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(task.id);
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                  <button
                    className="task-action-btn view"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetails(task);
                    }}
                  >
                    <Eye size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Tooltip>
      );
    }
  };

  // Clear error after timeout
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Task Scheduler</h1>
        <div className="current-date">{getCurrentDate()}</div>
      </header>

      <main className="calendar-container">
        <div className="calendar-header">
          <h2>Today's Schedule</h2>
          <button className="add-task-button" onClick={() => setOpen(true)}>
            <span className="plus-icon">+</span> Add Task
          </button>
        </div>

        <div className="calendar-body">
          <div className="time-column">
            {timeSlots.map((time, index) => (
              <div className="time-slot-label" key={index}>
                {time}
              </div>
            ))}
          </div>

          <div className="events-column">
            {timeSlots.map((time, index) => (
              <div className="time-slot-content" key={index}></div>
            ))}

            {tasks.map((task, index) => renderTask(task, index))}

            {currentTimePosition !== null && (
              <div
                className="current-time-indicator"
                style={{ top: `${currentTimePosition}%` }}
              >
                <span className="current-time-label">Now</span>
              </div>
            )}
          </div>
        </div>
      </main>

      {open && (
        <TaskModal open={open} onClose={handleClose} task={selectedTask} />
      )}

      {detailsOpen && (
        <TaskDetails
          open={detailsOpen}
          onClose={closeDetails}
          task={selectedTask}
        />
      )}
    </div>
  );
}

export default App;
