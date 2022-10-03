import React from "react";

const ControlbarButton = ({ callback, style, status, toggledStyle }) => {
  return (
    <div className="flex justify-center mt-8">
      <button onClick={callback}>
        {toggledStyle ? (
          <i
            className={`fa-solid fa-xl ${
              status ? `text-gray-50 ${toggledStyle}` : `text-gray-500 ${style}`
            }`}
          ></i>
        ) : (
          <i
            className={`fa-solid fa-xl ${style} ${
              status ? "text-gray-50" : "text-gray-500"
            }`}
          ></i>
        )}
      </button>
    </div>
  );
};

export default ControlbarButton;
