
import React from "react";
export const MinimalResume = ({ name, email, phone, summary, experience, education, skills }) => (
  <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded-lg border-gray-300 border">
    <h1 className="text-3xl font-bold text-gray-800 text-center">{name}</h1>
    <p className="text-center text-gray-600">{email} | {phone}</p>
    <hr className="my-4" />
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

