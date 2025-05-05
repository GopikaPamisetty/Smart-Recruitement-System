import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateMockInterview = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [jobDescription, setJobDescription] = useState(""); // State for job description
  const [techStack, setTechStack] = useState(""); // State for tech stack
  const [mockInterviews, setMockInterviews] = useState([]);

  // Fetch user's name
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.name) {
      setUserName(storedUser.name);
    } else {
      setUserName("Guest");
    }
  }, []);

  // Load mock interviews from localStorage
  useEffect(() => {
    const savedInterviews = JSON.parse(localStorage.getItem("mockInterviews")) || [];
    setMockInterviews(savedInterviews);
  }, []);

  const handleSubmit = () => {
    const newInterview = {
      id: Date.now(), // Unique ID based on current timestamp
      role,
      experience,
      jobDescription, // Include job description in the new interview object
      techStack, // Include tech stack in the new interview object
      createdAt: new Date().toLocaleString(),
    };
    const updatedInterviews = [...mockInterviews, newInterview];
    localStorage.setItem("mockInterviews", JSON.stringify(updatedInterviews));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1
          className="text-2xl font-bold text-blue-900 cursor-pointer hover:text-blue-700"
          onClick={() => navigate("/dashboard")}
        >
          Interview Ease
        </h1>
        <nav className="flex space-x-6">
          <a href="/" className="text-gray-700 font-medium hover:text-blue-700">
            Home
          </a>
          <a href="/dashboard" className="text-gray-700 font-medium hover:text-blue-700">
            Dashboard
          </a>
        </nav>
        <div className="flex items-center space-x-3">
          <span className="text-gray-700 font-medium">{userName}</span>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
            className="text-gray-700 font-medium hover:text-red-500"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Create your AI Mock Interview
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <label className="block text-gray-700 mb-2" htmlFor="role">
              Job Role
            </label>
            <input
              type="text"
              id="role"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Enter job role"
            />

            <label className="block text-gray-700 mb-2 mt-4" htmlFor="experience">
              Experience Level
            </label>
            <input
              type="text"
              id="experience"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Enter experience level"
            />

            <label className="block text-gray-700 mb-2 mt-4" htmlFor="jobDescription">
              Job Description (Optional)
            </label>
            <textarea
              id="jobDescription"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              rows="4"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Enter the job description (optional)"
            ></textarea>

            <label className="block text-gray-700 mb-2 mt-4" htmlFor="techStack">
              Tech Stack (Optional)
            </label>
            <input
              type="text"
              id="techStack"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="Enter the tech stack (optional)"
            />

            <button
              onClick={handleSubmit}
              className="mt-6 px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
            >
              Save Interview
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CreateMockInterview;
