import React from "react";
import { FcGoogle } from "react-icons/fc";
import './GoogleButton.css';

interface GoogleButtonProps {
  onClick: () => void;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="google-button"
    >
      <FcGoogle />
    </button>
  );
};

export default GoogleButton;
