import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/login";
import Notes from "./pages/notes";
import Profile from "./pages/Profile"; 
// ✅ Import Register page
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/Reset";
import Register from "./pages/Register";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsLoggedIn(!!token); // true if token exists
  }, []);

 

  return (
    <Router>
      {/* ✅ Logout & Profile button at top-right */}
     {isLoggedIn && (
  <div style={{
    display: "flex",
    justifyContent: "flex-end",
    paddingRight: "20px",
    marginTop: "40px",
    marginRight: "60px" // 👈 pushes down from the top
  }}>
    <Link to="/profile" className="profile-btn">Profile</Link>

  </div>
)}



      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Notes /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/" /> : <Login setIsLoggedIn={setIsLoggedIn} />
          }
        />

        <Route
  path="/register"
  element={
    isLoggedIn ? <Navigate to="/" /> : <Register setIsLoggedIn={setIsLoggedIn} />
  }
/>

        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />



        <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword/>} />

         <Route
  path="/profile"
  element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
/>
        
      </Routes>
    </Router>
  );
}

export default App;  
