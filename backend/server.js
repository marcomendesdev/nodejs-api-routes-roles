import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";

const port = process.env.PORT || 5000;
const app = express();

// cookie parser
app.use(cookieParser());

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();
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
