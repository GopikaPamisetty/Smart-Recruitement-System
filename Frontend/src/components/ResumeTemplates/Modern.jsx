import React from "react";

const ModernResume = ({ name, email, phone, summary, experience, education, skills }) => {
  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg border">
      <h1 className="text-3xl font-bold text-center">{name}</h1>
      <p className="text-center text-gray-600">{email} | {phone}</p>
      <hr className="my-4" />
      
      <h2 className="text-xl font-semibold">Summary</h2>
      <p className="text-gray-700">{summary}</p>

      <h2 className="text-xl font-semibold mt-4">Experience</h2>
      <p className="text-gray-700">{experience}</p>

      <h2 className="text-xl font-semibold mt-4">Education</h2>
      <p className="text-gray-700">{education}</p>

      <h2 className="text-xl font-semibold mt-4">Skills</h2>
      <p className="text-gray-700">{skills?.join(", ")}</p>
    </div>
  );
};

export default ModernResume;




