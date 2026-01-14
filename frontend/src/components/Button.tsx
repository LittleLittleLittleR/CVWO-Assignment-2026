import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type ButtonProps = {
  variant: "primary" | "secondary" | "square" | "back";
  value: string;
  onClick?: () => void;
};

export default function Button({ variant, value, onClick,}: ButtonProps) {
  return (
    <button onClick={onClick}>{value}</button>
  );
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