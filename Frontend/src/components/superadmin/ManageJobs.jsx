import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("/api/superadmin/jobs", { withCredentials: true });
        setJobs(res.data.jobs);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">💼 Manage Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <table className="min-w-full border border-gray-200 shadow-sm bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Company</th>
              <th className="px-4 py-2">Posted By</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id} className="border-t">
                <td className="px-4 py-2">{job.title}</td>
                <td className="px-4 py-2">{job.company?.name || "N/A"}</td>
                <td className="px-4 py-2">{job.created_by?.fullname || "N/A"}</td>
                <td className="px-4 py-2">{job.status}</td>


              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageJobs;
