import React from "react";

export const ProfessionalResume = ({ name, email, phone, summary, experience, education, skills }) => (
  <div className="p-6 max-w-2xl mx-auto bg-gray-100 shadow-md rounded-lg border border-gray-400">
    <h1 className="text-3xl font-bold text-center text-gray-900">{name}</h1>
    <p className="text-center text-gray-700 italic">{email} | {phone}</p>
    <hr className="my-4 border-gray-500" />
    <h2 className="text-xl font-semibold">Summary</h2>
    <p>{summary}</p>
    <h2 className="text-xl font-semibold mt-4">Experience</h2>
    <p>{experience}</p>
    <h2 className="text-xl font-semibold mt-4">Education</h2>
    <p>{education}</p>
    <h2 className="text-xl font-semibold mt-4">Skills</h2>
    <p>{skills?.join(", ")}</p>
  </div>
);
