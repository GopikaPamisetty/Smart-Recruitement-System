import React from "react";


export const ElegantResume = ({ name, email, phone, summary, experience, education, skills }) => (
  <div className="p-6 max-w-2xl mx-auto bg-gray-100 shadow-md rounded-lg border border-gray-300">
    <h1 className="text-3xl font-serif font-bold text-center text-gray-800">{name}</h1>
    <p className="text-center text-gray-600 italic">{email} | {phone}</p>
    <hr className="my-4 border-gray-400" />
    <h2 className="text-xl font-serif font-semibold">Summary</h2>
    <p className="text-gray-700 italic">{summary}</p>
    <h2 className="text-xl font-serif font-semibold mt-4">Experience</h2>
    <p className="text-gray-700">{experience}</p>
    <h2 className="text-xl font-serif font-semibold mt-4">Education</h2>
    <p className="text-gray-700">{education}</p>
    <h2 className="text-xl font-serif font-semibold mt-4">Skills</h2>
    <p className="text-gray-700">{skills?.join(", ")}</p>
  </div>
);


// Add the remaining 7 templates in a similar format


