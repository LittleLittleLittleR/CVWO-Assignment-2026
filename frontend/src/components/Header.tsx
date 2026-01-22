import { Link } from "react-router-dom";

type HeaderProps = {
  variant: "main" | "sub";
  title: React.ReactNode;
  className?: string;
};

export default function Header({ variant, title, className }: HeaderProps) {
  if (variant === "main") {
    return <h1 className={`text-4xl font-bold ${className}`}>{title}</h1>;
  }

  return <h2 className={`text-2xl font-bold ${className}`}>{title}</h2>;
}

export function MainHeader() {
  return (
    <Link to="/home"  state={{ returnTo: window.location.pathname || `/home` }}>
      <div className="flex flex-row">
        <Header
          variant="main"
          title={
            <>
              Gossip with{" "}
              <span className="text-blue-500">
                Go
              </span>
            </>
          }
        />
      </div>
    </Link>
  );
}

