import React from "react";

export const TechnicalResume = ({ name, email, phone, summary, experience, education, skills }) => (
    <div className="p-6 max-w-2xl mx-auto bg-gray-900 text-white shadow-lg rounded-lg border-gray-700 border">
      <h1 className="text-3xl font-bold text-center">{name}</h1>
      <p className="text-center text-gray-300">{email} | {phone}</p>
      <hr className="my-4 border-gray-600" />
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