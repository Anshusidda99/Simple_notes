const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

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



app.use("/api/notes", noteroute);     // Notes CRUD
app.use("/api/users", userRoutes);    // ✅ Fixed route

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Serve frontend build files
const path = require("path");
app.use(express.static(path.join(__dirname, "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});


