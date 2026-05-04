const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const feddBackRoute = require("./routes/feedBackRoutes")
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://127.0.0.1:5173";
const LOOPBACK_HOSTS = new Set(["127.0.0.1", "localhost"]);

const getAllowedOrigins = () => {
  const allowedOrigins = new Set([CLIENT_URL]);

  try {
    const clientUrl = new URL(CLIENT_URL);

    if (LOOPBACK_HOSTS.has(clientUrl.hostname)) {
      const alternateHost = clientUrl.hostname === "127.0.0.1" ? "localhost" : "127.0.0.1";
      allowedOrigins.add(`${clientUrl.protocol}//${alternateHost}:${clientUrl.port}`);
    }
  } catch (error) {
    console.warn(`Invalid CLIENT_URL configuration: ${error.message}`);
  }

  return [...allowedOrigins];
};

const allowedOrigins = getAllowedOrigins();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      name: "BookWeb API",
      phase: 4,
      status: "books-ready",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/feedback",feddBackRoute)

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    
    console.error(`Server failed to start: ${error.message}`);
    process.exit(1);
  }
};

startServer();

module.exports = app;
