import React from 'react';

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