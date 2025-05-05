import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import successSound from "../assets/sounds/success.mp3";
import errorSound from "../assets/sounds/error.mp3";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.play();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      console.log("Login Response:", response.status, data);
      console.log("User Object:", data.user);
      console.log("User Name:", data.user?.name);

      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({ name: data.user?.name || "Guest" }));

        setMessage("✅ Login Successful!");
        setIsSuccess(true);
        playSound(successSound);
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setMessage(data.message || "❌ Invalid Credentials!");
        setIsSuccess(false);
        playSound(errorSound);
      }
    } catch (error) {
      console.error("Login Error:", error);
      setMessage("⚠️ Server Error! Try again later.");
      setIsSuccess(false);
      playSound(errorSound);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        {message && (
          <p className={`message ${isSuccess ? "success-message" : "error-message"}`}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging In..." : "Login"}
          </button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;