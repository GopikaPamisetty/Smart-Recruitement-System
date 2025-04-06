import React from "react";



export const CorporateResume = ({ name, email, phone, summary, experience, education, skills }) => (
    <div className="p-6 max-w-2xl mx-auto bg-white border-l-4 border-green-500 shadow">
      <h1 className="text-3xl font-bold text-left text-green-700">{name}</h1>
      <p className="text-left text-gray-600">{email} | {phone}</p>
      <hr className="my-4 border-green-300" />
      <h2 className="text-xl font-semibold text-green-600">Summary</h2>
      <p>{summary}</p>
      <h2 className="text-xl font-semibold mt-4 text-green-600">Experience</h2>
      <p>{experience}</p>
      <h2 className="text-xl font-semibold mt-4 text-green-600">Education</h2>
      <p>{education}</p>
      <h2 className="text-xl font-semibold mt-4 text-green-600">Skills</h2>
      <p>{skills?.join(", ")}</p>
    </div>
  );
  