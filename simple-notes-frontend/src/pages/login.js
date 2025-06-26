// src/pages/Login.js
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Auth.css"; // keep your CSS

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });
      localStorage.setItem("userToken", data.token);
      setIsLoggedIn(true);
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div
      style={{
        backgroundImage: 'url("/images/second.webp")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",  // ⬅️ center horizontally
        alignItems: "center",      // ⬅️ center vertically
      }}
    >
      <div className="login-container">
        <h2>Login 🔐</h2>
        <form onSubmit={loginHandler}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br /><br />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br /><br />
          <button type="submit">Login</button>
        </form>

        <p style={{ marginTop: "10px" }}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>

        <p style={{ marginTop: "20px" }}>
          Don’t have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
