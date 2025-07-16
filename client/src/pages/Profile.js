// src/pages/Profile.js
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const getUser = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const { data } = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
    } catch (err) {
      setError("Failed to load profile");
    }
  };

  useEffect(() => {
    document.body.classList.add("profile-page");
    getUser();
    return () => document.body.classList.remove("profile-page");
  }, []);

  return (
    <div>
      {/* ✅ Only one logout button at the top-right */}
    <div className="profile-container">
  <h2>👤 Profile</h2>
  {error && <p className="error-msg">{error}</p>}

  {user ? (
    <>
      <div className="profile-info">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>DOB:</strong> {user.dob ? new Date(user.dob).toLocaleDateString() : "—"}</p>
        <p><strong>Passionate About:</strong> {user.passion || "—"}</p>
        <p><strong>Why You're Here:</strong> {user.whyHere || "—"}</p>
      </div>

      <div className="profile-buttons">
        <button
          onClick={() => {
            localStorage.removeItem("userToken");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </>
  ) : (
    <p>Loading profile...</p>
  )}
</div>
  

      
    </div>
  );
}

export default Profile;
