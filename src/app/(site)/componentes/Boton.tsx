import React from 'react';
import './Boton.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  fullWidth?: boolean;
}

const Boton: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  fullWidth = false,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`boton ${fullWidth ? "boton-full-width" : ""} ${disabled ? "boton-disabled" : ""}`}
    >
      {children}
    </button>
  );
};

export default Boton;
