import React from "react";
import jsPDF from "jspdf";

const ResumePreview = ({ formData }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("Resume", 20, 20);
    doc.setFont("helvetica", "normal");

    doc.text(`Name: ${formData.name || "N/A"}`, 20, 40);
    doc.text(`Email: ${formData.email || "N/A"}`, 20, 50);
    doc.text(`Phone: ${formData.phone || "N/A"}`, 20, 60);
    doc.text(`Address: ${formData.address || "N/A"}`, 20, 70);
    doc.text(`Experience: ${formData.experience || "N/A"}`, 20, 80);
    doc.text(`Education: ${formData.education || "N/A"}`, 20, 90);
    doc.text(`Skills: ${formData.skills || "N/A"}`, 20, 100);

    doc.save("resume.pdf");
  };

  return (
    <div className="max-w-lg mx-auto mt-6 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{formData.name}</h2>
      <p className="text-lg">📧 {formData.email}</p>
      <p className="text-lg">📞 {formData.phone}</p>
      <p className="text-lg">🏠 {formData.address}</p>
      <hr className="my-4 border-gray-300" />
      <h3 className="text-xl font-semibold">Experience</h3>
      <p>{formData.experience}</p>
      <h3 className="text-xl font-semibold mt-4">Education</h3>
      <p>{formData.education}</p>
      <h3 className="text-xl font-semibold mt-4">Skills</h3>
      <p>{formData.skills}</p>

      <button
        onClick={generatePDF}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded shadow"
      >
        Download as PDF
      </button>
    </div>
  );
};

export default ResumePreview;
