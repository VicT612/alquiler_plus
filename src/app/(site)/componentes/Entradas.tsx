import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Entradas.css';

interface InputProps {
  id: string;
  label?: string;
  type?: 'text' | 'string' | 'email' | 'password' | 'file' | 'date';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  register?: any; // Para usar con react-hook-form si es necesario
  errors?: any; // Para mostrar errores con react-hook-form
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

const Entrada: React.FC<InputProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  register,
  errors,
  onChange,
  value,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="input-container">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}
      <div className="input-wrapper">
        <input
          {...register(id)}
          id={id}
          type={showPassword && type === 'password' ? 'text' : type}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          className={`input-field ${errors && errors[id] ? 'input-error' : ''}`}
        />
        {type === 'password' && (
          <span onClick={handleTogglePassword} className="password-toggle-icon">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}
      </div>
      {errors && errors[id] && (
        <p className="input-error-message" id={`${id}-error`}>
          {errors[id].message}
        </p>
      )}
    </div>
  );
};

export default Entrada;
