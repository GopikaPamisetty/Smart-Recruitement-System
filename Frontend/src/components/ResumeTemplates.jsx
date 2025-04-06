import React from "react";
import PropTypes from "prop-types";

const templates = [
  { id: 1, name: "Modern", image: "/templates/modern.png" },
  { id: 2, name: "Elegant", image: "/templates/elegant.png" },
  { id: 3, name: "Classic", image: "/templates/classic.png" },
  { id: 4, name: "Creative", image: "/templates/creative.png" },
  { id: 5, name: "Minimal", image: "/templates/minimal.png" },
  { id: 6, name: "Professional", image: "/templates/professional.png" },
  { id: 7, name: "Corporate", image: "/templates/corporate.png" },
  { id: 8, name: "Simple", image: "/templates/simple.png" },
  { id: 9, name: "Infographic", image: "/templates/infographic.png" },
  { id: 10, name: "Technical", image: "/templates/technical.png" },
];

const ResumeTemplates = ({ onSelectTemplate }) => {
  console.log("[ResumeTemplates] onSelectTemplate type:", typeof onSelectTemplate);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Select a Resume Template
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="cursor-pointer p-2 border rounded shadow hover:shadow-lg transition"
            onClick={() => {
              console.log("🟢 Template Clicked:", template.name);
              onSelectTemplate(template.id);
            }}
          >
            <img
              src={template.image}
              alt={template.name}
              className="w-full h-auto rounded"
            />
            <p className="text-center mt-2 font-semibold">{template.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

ResumeTemplates.propTypes = {
  onSelectTemplate: PropTypes.func.isRequired,
};

export default ResumeTemplates;
