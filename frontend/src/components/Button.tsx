import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type ButtonProps = {
  variant: "primary" | "secondary" | "square" | "back" | "dropdown" | "alert";
  value: string;
  onClick?: () => void;
  className?: string;
};

export default function Button({ variant, value, onClick, className }: ButtonProps) {
  if (variant === "primary") {
    return (
      <button className={`cursor-pointer bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded ${className}`} onClick={onClick}>
        {value}
      </button>
    );
  } else if (variant === "secondary") {
    return (
      <button 
      className="cursor-pointer bg-white hover:bg-blue-500 hover:text-white py-2 px-4 rounded border" 
      onClick={onClick}>
        {value}
      </button>
    );
  } else if (variant === "square") {
    return (
      <button 
      className={`cursor-pointer py-2 px-4 border-b border-black hover:border-black ${className}`} 
      onClick={onClick}>
        {value}
      </button>
    );
  } else if (variant === "dropdown") {
    return (
      <button 
      className={`w-full bg-white cursor-pointer hover:bg-blue-500 hover:text-white hover:border-t-black py-2 px-4 border-t ${className}`} 
      onClick={onClick}>
        {value}
      </button>
    );
  } else if (variant === "back") {
    return (
      <button 
      className={`cursor-pointer bg-white hover:bg-gray-300 hover:border-black py-2 px-4 rounded border ${className}`} 
      onClick={onClick}>
        {value}
      </button>
    );
  } else if (variant === "alert") {
    return (
      <button 
      className={`cursor-pointer bg-white border-2 text-red-500 hover:bg-red-500 hover:text-white py-2 px-4 rounded ${className}`} 
      onClick={onClick}>
        {value}
      </button>
    );
  }
}

export function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const returnTo = location.state?.returnTo;

    navigate(returnTo ?? "/home", { replace: true });
  };

  return (
    <Button variant="back" value="Back" onClick={handleBack}/>
  );
}