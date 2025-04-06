import React from "react";
import PropTypes from "prop-types";

const templates = ["Modern", "Elegant", "Classic", "Creative"];

const ResumeTemplateSelection = ({ onSelect }) => {
  console.log("[ResumeTemplateSelection] onSelect type:", typeof onSelect);

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {templates.map((template) => (
        <button
          key={template}
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => onSelect(template)}
        >
          {template}
        </button>
      ))}
    </div>
  );
};

ResumeTemplateSelection.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default ResumeTemplateSelection;
