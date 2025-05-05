import React, { useEffect, useState } from "react";
import axios from "axios";
import LatestJobCards from "./LatestJobCards";
import { toast } from "sonner";
import Navbar from './shared/Navbar';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // 🔐 Redirect to login if user is not logged in
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchSavedJobs = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/user/saved-jobs", {
          withCredentials: true,
        });
        setSavedJobs(res.data.savedJobs);
      } catch (error) {
        toast.error("Failed to load saved jobs");
        console.error("Error fetching saved jobs:", error);
      }
    };

    fetchSavedJobs();
  }, [user, navigate]);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-6 px-4">
        <h1 className="text-xl font-bold mb-4">Saved Jobs</h1>
        {savedJobs.length === 0 ? (
          <p className="text-gray-500">No saved jobs found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedJobs.map((job) => (
              <LatestJobCards key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SavedJobs;
