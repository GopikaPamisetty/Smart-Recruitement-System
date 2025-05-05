import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Optional: for animations

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white flex flex-col overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-10 bg-opacity-90 bg-gray-900 shadow-md px-6 py-4 flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold tracking-tight cursor-pointer hover:text-yellow-400 transition-colors duration-300"
          onClick={() => navigate("/")}
        >
          Interview Ease
        </motion.h1>
        <div className="flex items-center space-x-6">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 text-white font-medium rounded-full hover:bg-indigo-700 hover:text-yellow-300 transition-all duration-300"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-full shadow-lg hover:bg-yellow-500 hover:scale-105 transition-all duration-300"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center text-center mt-24 px-6 pt-20">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight"
        >
          Ace Your Next Interview with{" "}
          <span className="text-yellow-400 animate-pulse">Confidence!</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-4 text-lg md:text-xl text-gray-200 max-w-3xl"
        >
          AI-powered mock interviews, live coding, and real-time feedback to help you shine like
          a pro.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onClick={() => navigate("/register")}
          className="mt-8 px-10 py-4 bg-yellow-400 text-gray-900 text-lg font-semibold rounded-full shadow-lg hover:bg-yellow-500 hover:scale-110 transition-all duration-300"
        >
          Get Started
        </motion.button>
      </header>

      {/* Features Section */}
      <section className="mt-24 px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: "🎯",
            title: "AI Mock Interviews",
            text: "Practice technical & HR questions with AI-driven feedback.",
          },
          {
            icon: "💻",
            title: "Live Coding Challenges",
            text: "Solve problems in a built-in editor with real-time execution.",
          },
          {
            icon: "📊",
            title: "Performance Tracking",
            text: "Get reports & suggestions to improve your interview skills.",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-200 border-opacity-20"
          >
            <h3 className="text-5xl">{feature.icon}</h3>
            <h3 className="text-xl font-semibold mt-4 text-yellow-300">{feature.title}</h3>
            <p className="text-gray-200 mt-2">{feature.text}</p>
          </motion.div>
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-24 py-6 text-center bg-gray-900 bg-opacity-90 text-gray-200">
        <p className="text-lg font-medium">
          © 2025 Interview Ease. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;