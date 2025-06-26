// src/pages/Notes.js
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/notes.css";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const getAuthConfig = () => {
    const token = localStorage.getItem("userToken");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchNotes = useCallback(async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/notes", getAuthConfig());
      const sortedNotes = data.sort((a, b) => b.isPinned - a.isPinned);
      setNotes(sortedNotes);
    } catch (err) {
      setError("Failed to load notes. Please login again.");
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/notes",
        { title: newTitle, content: newContent },
        getAuthConfig()
      );
      setNotes([data, ...notes]);
      setNewTitle("");
      setNewContent("");
    } catch (err) {
      alert("Failed to add note.");
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, getAuthConfig());
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      alert("Failed to delete note.");
    }
  };

  const startEditing = (note) => {
    setEditingId(note._id);
    setEditingTitle(note.title);
    setEditingContent(note.content);
  };

  const saveEditedNote = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notes/${id}`,
        { title: editingTitle, content: editingContent },
        getAuthConfig()
      );
      setEditingId(null);
      setEditingTitle("");
      setEditingContent("");
      fetchNotes();
    } catch (err) {
      alert("Failed to update note.");
    }
  };

  const togglePin = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/notes/${id}/pin`, {}, getAuthConfig());
      fetchNotes();
    } catch (err) {
      alert("Failed to pin/unpin note.");
    }
  };

  return (
    <div className="notes-page">
      <div className="note-form-container">
        <h2> 📑 Your Notes</h2>
        <form onSubmit={addNote}>
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          /><br /><br />
          <textarea
            placeholder="Content"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            required
          /><br /><br />
          <button type="submit">Add Note</button>
        </form>
      </div>

      <input
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="notes-grid">
        {notes
          .filter((note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((note) => (
            <div
              key={note._id}
              className={`note-card ${note.isPinned ? "pinned" : ""}`}
            >
              <button
                onClick={() => togglePin(note._id)}
                className="pin-btn"
              >
                {note.isPinned ? "Unpin" : "Pin"}
              </button>

              {editingId === note._id ? (
                <>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                  /><br /><br />
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  /><br /><br />
                  <button onClick={() => saveEditedNote(note._id)}>Save</button>
                  <button onClick={() => setEditingId(null)} style={{ marginLeft: "10px" }}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <div className="note-buttons">
  <button className="edit-btn" onClick={() => startEditing(note)}>Edit</button>
  <button className="delete-btn" onClick={() => deleteNote(note._id)}>Delete</button>
</div>


                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Notes;
