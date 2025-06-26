const mongoose = require("mongoose"); // ✅ Add this line
const Note = require("../models/notemodel");

// Get all notes
const getNotes = async (req, res) => {
  const notes = await Note.find({user:req.user._id});
  res.json(notes);
};

// Get a single note
const getNoteById = async (req, res) => {
  try {
    
    const note = await Note.findById(req.params.id);
    if (note) {
      res.json(note);
    } else {
      res.status(404).json({ message: "Note not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid note ID" });
  }
};

// Create a note
const createNote = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const note = new Note({
    user: req.user._id, // 👈 Set logged-in user
    title,
    content,
  });

  const createdNote = await note.save();
  res.status(201).json(createdNote);
};

// Update a note
const updateNote = async (req, res) => {
  const { title, content } = req.body;

  try {
    const note = await Note.findById(req.params.id);

    if (note) {
      note.title = title || note.title;
      note.content = content || note.content;
      const updatedNote = await note.save();
      res.json(updatedNote);
    } else {
      res.status(404).json({ message: "Note not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid note ID" });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  const { id } = req.params; 

  console.log("received ID",id);

  // ✅ Check for valid ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid note ID" });
  }

  const note = await Note.findById(id);

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  await Note.findByIdAndDelete(id);

  res.json({ message: "Note deleted" });
};


// Toggle pin
const togglePinNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ message: "Note not found" });

    // Ensure the logged-in user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    note.isPinned = !note.isPinned;
    const updatedNote = await note.save();

    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  togglePinNote,
};
