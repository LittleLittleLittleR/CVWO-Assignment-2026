type HeaderProps = {
  variant: "main" | "sub";
  title: string | undefined;
};

export default function Header({ variant, title }: HeaderProps) {
  if (variant === "main") {
    return (
        <h1 className="text-2xl font-bold text-white">{title}</h1>
    );
  }

  return (
    <header className="bg-gray-200 text-gray-800 p-2">
      <h2 className="text-xl font-semibold">{title}</h2>
    </header>
  );
}

export function MainHeader() {
  return <Header variant="main" title="Gossip with Go" />;
}
