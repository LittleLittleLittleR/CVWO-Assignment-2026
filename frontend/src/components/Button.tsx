type ButtonProps = {
  variant: "primary" | "secondary";
  link: string;
  value: string;
};

export default function Button({ variant, link, value, }: ButtonProps) {
  return (
    <button 
    onClick={() => window.location.href = link}
    >
      {value}
    </button>
  );
}

export function LoginButton() {
  return <Button variant="primary" link="/login" value="Log In" />;
}
