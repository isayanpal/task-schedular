import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import './App.css';
import TaskModal from './components/TaskModal';
import { clearError, deleteTask } from './slices/taskSlice';
import { format } from 'date-fns';

function App() {
    const { tasks, error } = useSelector(state => state.tasks);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const handleClose = () => {
        setSelectedTask(null);
        setOpen(false);
    };

    const openEdit = (task) => {
        setSelectedTask(task);
        setOpen(true);
    };

    const handleDelete = (id) => {
        dispatch(deleteTask(id));
    };

    const timeSlots = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const currentDate = format(new Date(), 'EEEE, MMMM dd');

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
            <AppBar position="static" sx={{ backgroundColor: '#303f9f', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Task Scheduler
                    </Typography>
                    <Typography variant="subtitle1" color="inherit" sx={{ fontWeight: 300 }}>
                        {currentDate}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{ flexGrow: 1, py: 3, px: 2, display: 'flex', justifyContent: 'center' }}>
                <Paper sx={{ width: '100%', maxWidth: 900, borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 2, borderBottom: '1px solid #e0e0e0' }}>
                        <Typography variant="h5" sx={{ fontWeight: 400, color: '#424242' }}>
                            Today's Agenda
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => setOpen(true)}
                            sx={{ borderRadius: 1, fontWeight: 500, textTransform: 'capitalize' }}
                        >
                            Add Task
                        </Button>
                    </Box>
                    <Box sx={{ position: 'relative', display: 'flex', height: '70vh', overflowY: 'auto', backgroundColor: '#fff' }}>
                        <Box sx={{ flexShrink: 0, width: 70, borderRight: '1px solid #e0e0e0', paddingTop: 1 }}>
                            {timeSlots.map((time, idx) => (
                                <Box key={idx} sx={{ height: `calc(70vh / 24)`, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', paddingRight: 2, boxSizing: 'border-box' }}>
                                    <Typography variant="caption" sx={{ color: '#757575', fontSize: '0.7rem' }}>
                                        {time}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                        <Box sx={{ flexGrow: 1, position: 'relative', padding: 1 }}>
                            {tasks.map(task => {
                                const startTimeParts = task.startTime.split(':');
                                const endTimeParts = task.endTime.split(':');

                                const startMinutes = parseInt(startTimeParts[0]) * 60 + parseInt(startTimeParts[1]);
                                const endMinutes = parseInt(endTimeParts[0]) * 60 + parseInt(endTimeParts[1]);

                                const totalMinutesInDay = 24 * 60;
                                const schedulerHeightVh = 70;

                                const topPercentage = (startMinutes / totalMinutesInDay) * 100;
                                const heightPercentage = ((endMinutes - startMinutes) / totalMinutesInDay) * 100;

                                const top = (topPercentage / 100) * schedulerHeightVh;
                                const height = (heightPercentage / 100) * schedulerHeightVh;

                                return (
                                    <Box
                                        key={task.id}
                                        className="task-block"
                                        sx={{
                                            position: 'absolute',
                                            left: 8,
                                            right: 8,
                                            backgroundColor: '#e8f5e9',
                                            borderLeft: `4px solid #4caf50`,
                                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                                            padding: 1,
                                            borderRadius: 1,
                                            overflow: 'hidden',
                                            zIndex: 1,
                                            cursor: 'pointer',
                                            transition: 'transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out',
                                            '&:hover': {
                                                transform: 'scale(1.01)',
                                                boxShadow: '0 3px 7px rgba(0, 0, 0, 0.15)',
                                            },
                                            top: `${top}vh`,
                                            height: `${height}vh`,
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                        onClick={() => openEdit(task)}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#333', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {task.title}
                                            </Typography>
                                            <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {task.description}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.7rem' }}>
                                            {task.startTime} - {task.endTime}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                </Paper>
            </Box>
            <TaskModal open={open} onClose={handleClose} task={selectedTask} />
            <Snackbar
                open={!!error}
                autoHideDuration={3000}
                onClose={() => dispatch(clearError())}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity="error" onClose={() => dispatch(clearError())}>{error}</Alert>
            </Snackbar>
        </Box>
    );
}

export default App;