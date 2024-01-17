import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import helmet from 'helmet';
import path from 'path';
import cors from 'cors';

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // substitua por seu domínio Next.js
  credentials: true,
}));

app.use(helmet());

// cookie parser
app.use(cookieParser());

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(path.dirname(''), 'uploads')));

connectDB();

app.use("/api", userRoutes);
app.use("/api", postRoutes);

// routes
app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use(notFound);
app.use(errorHandler);

// listen to port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});