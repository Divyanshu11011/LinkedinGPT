import React from "react";
import { CountButton } from "./Components/CountButton";
import "~style.css";

// IndexPopup component definition
const IndexPopup = () => {
  return (
    <div className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-h-16 plasmo-w-40">
      <CountButton />
    </div>
  );
};

// Export the IndexPopup component as default
export default IndexPopup;
