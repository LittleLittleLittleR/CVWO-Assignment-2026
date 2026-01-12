import React from 'react';
import { Link } from 'react-router-dom';

type ButtonProps = {
  variant: "primary" | "secondary" | "square";
  value: string;
  onClick?: () => void;
};

export default function Button({ variant, value, onClick,}: ButtonProps) {
  return (
    <button onClick={onClick}>{value}</button>
  );
}

export function LoginButton() {
  return (
    <Link to="/login">
      <Button variant="primary" value="Log In" />
    </Link>
  );
}