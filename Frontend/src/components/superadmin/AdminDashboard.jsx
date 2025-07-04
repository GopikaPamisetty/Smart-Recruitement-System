import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../shared/Navbar';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [showPending, setShowPending] = useState(false);
  const [pendingRecruiters, setPendingRecruiters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/superadmin/stats');
        setStats(res.data.stats);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  const fetchPendingRecruiters = async () => {
    try {
      const res = await axios.get('/api/superadmin/users?role=recruiter');
      const pending = res.data.users.filter(user => !user.profile?.isApproved);
      setPendingRecruiters(pending);
      setShowPending(true);
    } catch (err) {
      console.error("Error fetching pending recruiters:", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/superadmin/approve-recruiter/${id}`);
      setPendingRecruiters(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div className="p-6">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">📊 Platform Stats</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Students" value={stats.totalStudents} onClick={() => navigate("/superadmin/users?role=student")} />
        <StatCard label="Recruiters" value={stats.totalRecruiters} onClick={() => navigate("/superadmin/users?role=recruiter")} />
        <StatCard label="Admins" value={stats.totalAdmins} onClick={() => navigate("/superadmin/users?role=admin")} />
        <StatCard label="Companies" value={stats.totalCompanies} onClick={() => navigate("/superadmin/companies")} />
        <StatCard label="Jobs" value={stats.totalJobs} onClick={() => navigate("/superadmin/jobs")} />
        <StatCard label="Blocked Users" value={stats.totalBlockedUsers} onClick={() => navigate("/superadmin/users?blocked=true")} />
        <StatCard label="Approval Pending" value={pendingRecruiters.length || '➕'} onClick={fetchPendingRecruiters} />
      </div>

      {showPending && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Pending Recruiters</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Approved</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingRecruiters.map(user => (
                <tr key={user._id}>
                  <td className="p-2 border">{user.fullname}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border text-red-500">❌</td>
                  <td className="p-2 border">
                    <button 
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => handleApprove(user._id)}>
                      ✅ Approve
                    </button>
                  </td>
                </tr>
              ))}
              {pendingRecruiters.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-4">All recruiters are approved ✅</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, onClick }) => (
  <div
    className="bg-white rounded-lg shadow p-4 cursor-pointer hover:bg-gray-50 transition"
    onClick={onClick}
  >
    <p className="text-gray-600 text-sm">{label}</p>
    <p className="text-2xl font-semibold">{value}</p>
  </div>
);

export default AdminDashboard;
