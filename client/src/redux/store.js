import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "./resumeSlice.js";

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
  },
});
