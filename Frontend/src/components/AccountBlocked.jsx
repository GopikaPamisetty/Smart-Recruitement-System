// src/pages/AccountBlocked.jsx
import React from "react";
import Navbar from "../components/shared/Navbar";

const AccountBlocked = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-10 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Account Blocked</h1>
        <p className="text-gray-700 text-lg">
          Your account has been blocked. Please contact support for more information.
        </p>
      </div>
    </>
  );
};

export default AccountBlocked;
