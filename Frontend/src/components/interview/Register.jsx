import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import successSound from "../assets/sounds/success.mp3";
import errorSound from "../assets/sounds/error.mp3";
import "../styles/Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Play sound function
  const playSound = (sound) => {
    const audio = new Audio(sound);
    audio.play();
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (Dummy frontend validation)
 // Replace the handleSubmit function in Register.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess(false);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccess(true);
      playSound(successSound);
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setError(data.message || "Registration failed");
      playSound(errorSound);
    }
  } catch (error) {
    setError("Server error. Please try again later.");
    playSound(errorSound);
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        {success && <div className="success-message">✅ Registered Successfully!</div>}
        {error && <div className="error-message">❌ {error}</div>}

        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />
          <button type="submit">Register</button>
        </form>
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
};

export default Register;










