import React from "react";
export const ClassicResume = ({ name, email, phone, summary, experience, education, skills }) => (
  <div className="p-6 max-w-2xl mx-auto bg-white border-l-4 border-blue-500 shadow">
    <h1 className="text-3xl font-bold text-left text-blue-700">{name}</h1>
    <p className="text-left text-gray-600">{email} | {phone}</p>
    <hr className="my-4 border-blue-300" />
    <h2 className="text-xl font-semibold text-blue-600">Summary</h2>
    <p className="text-gray-700">{summary}</p>
    <h2 className="text-xl font-semibold mt-4 text-blue-600">Experience</h2>
    <p className="text-gray-700">{experience}</p>
    <h2 className="text-xl font-semibold mt-4 text-blue-600">Education</h2>
    <p className="text-gray-700">{education}</p>
    <h2 className="text-xl font-semibold mt-4 text-blue-600">Skills</h2>
    <p className="text-gray-700">{skills?.join(", ")}</p>
  </div>
);