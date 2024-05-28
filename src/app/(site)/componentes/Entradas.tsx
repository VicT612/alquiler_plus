import React from 'react';

interface InputProps {
  id: string;
  label?: string;
  type?: 'string' | 'email' | 'password' | 'file' | 'date' ;
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
  type = 'string',
  placeholder,
  required = false,
  disabled = false,
  register,
  errors,
  onChange,
  value,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium dark:text-white text-black">
          {label}
        </label>
      )}
      <div className="mt-1">
        <input
          {...register(id)}
          id={id}
          type={type}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          className={`text-black shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full h-full p-2 sm:text-sm border-gray-300 rounded-md ${
            errors && errors[id] ? 'border-red-500' : '' 
          }`}
        />
      </div>
      {errors && errors[id] && (
        <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>


          {errors[id].message}
        </p>
      )}
    </div>
  );
};

export default Entrada;