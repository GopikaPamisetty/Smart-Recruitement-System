import React from "react";
export const CreativeResume = ({ name, email, phone, summary, experience, education, skills }) => (
    <div className="p-6 max-w-2xl mx-auto bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center">{name}</h1>
      <p className="text-center">{email} | {phone}</p>
      <hr className="my-4 border-white" />
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