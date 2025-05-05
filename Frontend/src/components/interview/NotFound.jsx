import React from "react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-red-500">404 - Not Found</h1>
      <p className="text-gray-600">Oops! The page you're looking for doesn't exist.</p>
    </div>
  );
};

export default NotFound;