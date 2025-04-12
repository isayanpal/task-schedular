import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../slices/taskSlice";

export const store = configureStore({
    reducer:{
        tasks: tasksReducer,
    }
})