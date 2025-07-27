// src/components/Button.jsx
import React from "react";

function Button({ onClick, children, disabled = false, className = "" }) {
  const baseStyles =
    "text-white font-bold py-3 px-4 rounded-lg transition-colors shadow focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center break-keep";

  const disabledStyles = "bg-gray-400 cursor-not-allowed";
  const enabledStyles = "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500";

  const finalStyles = `${baseStyles} ${
    disabled ? disabledStyles : enabledStyles
  } ${className}`;

  return (
    <button onClick={onClick} disabled={disabled} className={finalStyles}>
      {children}
    </button>
  );
}

export default Button;
