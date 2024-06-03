import React from "react";
import { IoLogoMicrosoft } from "react-icons/io5";
import './MicrosoftButton.css';

interface MicrosoftButtonProps {
  onClick: () => void;
}

const MicrosoftButton: React.FC<MicrosoftButtonProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="microsoft-button"
    >
      <IoLogoMicrosoft />
    </button>
  );
};

export default MicrosoftButton;
