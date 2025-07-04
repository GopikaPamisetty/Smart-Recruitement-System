import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("/api/superadmin/companies", { withCredentials: true });
        setCompanies(res.data.companies);
      } catch (err) {
        console.error("Failed to fetch companies:", err);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🏢 Manage Companies</h2>
      {companies.length === 0 ? (
        <p>No companies found.</p>
      ) : (
        <table className="min-w-full border border-gray-200 shadow-sm bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Company Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Recruiter</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company._id} className="border-t">
                <td className="px-4 py-2">{company.name}</td>
                <td className="px-4 py-2">{company.userId?.email || "N/A"}</td>
                <td className="px-4 py-2">{company.userId?.fullname || "N/A"}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageCompanies;
