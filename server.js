const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const noteroute = require("./routes/noteroute");
const userRoutes = require("./routes/userroute");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected 🎉"))
  .catch((err) => console.log("MongoDB Connection Error ❌", err));

// ✅ API Routes
app.use("/api/notes", noteroute);
app.use("/api/users", userRoutes);

// ✅ Serve frontend static files (React build)
app.use(express.static(path.join(__dirname, "client", "build")));

// ✅ Fallback route for React (with REGEX FIX)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
