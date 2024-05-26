import React from 'react';

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
  const baseStyles = "inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  const sizeStyles = "text-sm px-4 py-2";
  const fullWidthStyles = fullWidth ? "w-full" : "";

  const lightStyles = "text-white bg-rose-600 hover:bg-red-500 border-transparent hover:shadow";
  const darkStyles = "dark:text-white dark:bg-rose-600 dark:hover:bg-red-700 dark:border-transparent";

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
      className={`${baseStyles} ${sizeStyles} ${fullWidthStyles} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${lightStyles} ${darkStyles} transition-colors duration-300`}
    >
      {children}
    </button>
  );
};

export default Boton;