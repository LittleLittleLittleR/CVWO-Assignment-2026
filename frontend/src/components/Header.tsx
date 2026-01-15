import { Link } from "react-router-dom";
import type { JSX } from "react/jsx-dev-runtime";

type HeaderProps = {
  variant: "main" | "sub";
  title: React.ReactNode;
};

export default function Header({ variant, title }: HeaderProps) {
  if (variant === "main") {
    return <h1 className="text-4xl font-bold">{title}</h1>;
  }

  return <h2 className="text-2xl font-bold">{title}</h2>;
}

export function MainHeader() {
  return (
    <Link to="/home" className="group">
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

