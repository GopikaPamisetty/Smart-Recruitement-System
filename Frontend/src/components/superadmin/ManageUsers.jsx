import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner"; // ✅ Add this line
import { useLocation, useNavigate } from "react-router-dom";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchParams] = useSearchParams(); // ✅ Get query params
     // ✅ Extract ?role=student/recruiter
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role") || "student"; // default to student
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("fullname");
const [sortOrder, setSortOrder] = useState("asc");
const blocked = queryParams.get("blocked"); 

  const sortedUsers = [...users].sort((a, b) => {
  const fieldA = a[sortField].toLowerCase();
  const fieldB = b[sortField].toLowerCase();
  if (sortOrder === "asc") return fieldA.localeCompare(fieldB);
  else return fieldB.localeCompare(fieldA);
});


  // const fetchAllUsers = async () => {
  //   try {
  //     const res = await axios.get(`/api/admin/users?role=${role}`, {
  //       withCredentials: true,
  //     });
  //     setUsers(res.data.users);
  //   } catch (err) {
  //     console.error("Failed to fetch users:", err);
  //   }
  // };
  const fetchAllUsers = async (role) => {
    try {
      const res = await axios.get(`/api/superadmin/users?role=${role}`, { withCredentials: true });
      setUsers(res.data.users);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };
  

  const handleToggleBlock = async (id, isBlocked) => {
    const confirmMsg = isBlocked ? "Unblock this user?" : "Block this user?";
    const confirm = window.confirm(confirmMsg);
  
    if (!confirm) return;
  
    try {
      const res = await axios.post(`/api/superadmin/user/${id}/block-toggle`, {}, { withCredentials: true });
      toast.success(res.data.message);
      fetchAllUsers();
    } catch (err) {
      console.error("Toggle block error:", err);
      toast.error("Failed to toggle block status");
    }
  };
  
  

  // useEffect(() => {
  //   if (role) fetchAllUsers();
  // }, [role]);
  // useEffect(() => {
  //   fetchAllUsers(role);
  // }, [role]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let query = "";
        if (blocked === "true") {
          query = "blocked=true"; // ✅ Only blocked users
        } else if (role) {
          query = `role=${role}`; // ✅ Users by role
        }
  
        const res = await axios.get(`/api/superadmin/users?${query}`, { withCredentials: true });
        setUsers(res.data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
  
    fetchUsers();
  }, [role, blocked]);
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">👥 User Management</h2>
      <div className="mb-4 flex gap-4">
  {["student", "recruiter", "admin"].map((r) => (
    <button
      key={r}
      onClick={() => navigate(`/superadmin/users?role=${r}`)}
      className={`px-4 py-2 rounded-md ${
        role === r && !blocked ? "bg-blue-600 text-white" : "bg-gray-200"
      }`}
    >
      {r.charAt(0).toUpperCase() + r.slice(1)}s
    </button>
  ))}

  <button
    onClick={() => navigate(`/superadmin/users?blocked=true`)} // ✅ no role param
    className={`px-4 py-2 rounded-md ${
      blocked === "true" ? "bg-red-600 text-white" : "bg-gray-200"
    }`}
  >
    🚫 Blocked Users
  </button>
</div>


<div className="mb-4">
  <input
    type="text"
    placeholder="Search by name or email"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full border px-4 py-2 rounded-md shadow-sm"
  />
</div>


      {users.length === 0 ? (
        <p>
        {blocked === "true"
          ? "No blocked users found."
          : `No users found for role: ${role}`}
      </p>

      ) : (
        <table className="min-w-full border border-gray-200 shadow-sm bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Full Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Blocked</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
          {users
  .filter((user) =>
    user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map((user) => (
    <tr key={user._id} className="border-t">
      <td className="px-4 py-2">{user.fullname}</td>
      <td className="px-4 py-2">{user.email}</td>
      <td className="px-4 py-2">{user.role}</td>
      <td className="px-4 py-2">
        {user.isBlocked ? "🚫 Yes" : "✅ No"}
      </td>
      <td className="px-4 py-2">
        <button
          className={`${
            user.isBlocked ? "bg-yellow-500" : "bg-gray-800"
          } text-white px-3 py-1 rounded`}
          onClick={() => handleToggleBlock(user._id)}
        >
          {user.isBlocked ? "Unblock" : "Block"}
        </button>
      </td>
    </tr>
))}

          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsers;

