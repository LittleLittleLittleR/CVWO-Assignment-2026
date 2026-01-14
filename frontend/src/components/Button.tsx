import React from 'react';
import { useNavigate } from 'react-router-dom';

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

  return (
    <Button variant="back" value="Back" onClick={() => navigate(-1)}/>
  );
}