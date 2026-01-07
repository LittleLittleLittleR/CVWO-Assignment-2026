type ButtonProps = {
  variant: "primary" | "secondary";
  value: string;
};

export default function Button({ variant, value }: ButtonProps) {
  return (
    <button>{value}</button>
  );
}

export function LoginButton() {
  return <Button variant="primary" value="Log In" />;
}
