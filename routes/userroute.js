const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/usercontrollers");
const { protect } = require("../middleware/authmiddleware");

// Public routes
router.post("/register", registerUser);

router.post("/login", loginUser);

// Protected route
router.get("/profile", protect, getUserProfile);

module.exports = router;
