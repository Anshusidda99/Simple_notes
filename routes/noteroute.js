// src/routes/noteRoutes.js

const express = require("express");
const router = express.Router();
const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  togglePinNote, // ✅ Pin toggle controller
} = require("../controllers/notecontrollers");
const { protect } = require("../middleware/authmiddleware");

// ✅ Get all notes & Create new note
router.route("/")
  .get(protect, getNotes)
  .post(protect, createNote);

// ✅ Update & Delete a note
router.route("/:id")
  .put(protect, updateNote)
  .delete(protect, deleteNote);

// ✅ Pin or unpin a note
router.patch("/:id/pin", protect, togglePinNote);

module.exports = router;
