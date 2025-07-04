import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageRecruiters = () => {
  const [recruiters, setRecruiters] = useState([]);

  const fetchRecruiters = async () => {
    try {
      const res = await axios.get("/api/superadmin/recruiters");
      setRecruiters(res.data.recruiters);
    } catch (err) {
      console.error("Failed to fetch recruiters:", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.post(`/api/superadmin/recruiter/${id}/approve`);
      fetchRecruiters(); // refresh list
    } catch (err) {
      console.error("Approval error:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`/api/superadmin/recruiter/${id}/reject`);
      fetchRecruiters();
    } catch (err) {
      console.error("Rejection error:", err);
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      await axios.post(`/api/superadmin/recruiter/${id}/block-toggle`);
      fetchRecruiters();
    } catch (err) {
      console.error("Toggle block error:", err);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🧑‍💼 Recruiter Management</h2>
      <table className="min-w-full border border-gray-200 shadow-sm bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Full Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Blocked</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {recruiters.map((rec) => (
            <tr key={rec._id} className="border-t">
              <td className="px-4 py-2">{rec.fullname}</td>
              <td className="px-4 py-2">{rec.email}</td>
              <td className="px-4 py-2">
                {rec.profile.company?.isApproved
                  ? "✅ Approved"
                  : "⏳ Pending"}
              </td>
              <td className="px-4 py-2">
                {rec.isBlocked ? "🚫 Yes" : "✅ No"}
              </td>
              <td className="px-4 py-2 space-x-2">
                {!rec.profile.company?.isApproved && (
                  <>
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => handleApprove(rec._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleReject(rec._id)}
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  className={`${
                    rec.isBlocked ? "bg-yellow-500" : "bg-gray-800"
                  } text-white px-3 py-1 rounded`}
                  onClick={() => handleToggleBlock(rec._id)}
                >
                  {rec.isBlocked ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageRecruiters;
