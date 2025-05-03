import express from "express";
import dbConnection from "./database/dbConnection.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/error.js";
import path from "path";
import { fileURLToPath } from "url";

// Basic Setup
const app = express();
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Content Security Policy middleware (fix font errors)
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; font-src 'self' data:; style-src 'self' 'unsafe-inline'; img-src 'self' data:; script-src 'self';"
  );
  next();
});

// CORS Setup
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// API Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

// Serve React frontend build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// DB & Errors
dbConnection();
app.use(errorMiddleware);

export default app;
