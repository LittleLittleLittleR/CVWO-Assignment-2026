import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth";

import { BackButton, LoginButton } from "./Button";
import UserIcon from "./UserIcon";
import { MainHeader } from "./Header";

interface NavBarProps {
  variant: "home" | "other";
}

export default function NavBar({ variant }: NavBarProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return null;
  }
  
  return (
    <div className="grid grid-cols-3 items-center pt-4 pb-6">
      <div className="justify-self-start">
        {variant !== "home" && <BackButton />}
      </div>
      <div className="justify-self-center">
        <MainHeader />
      </div>
      <div className="justify-self-end">
        {user ? 
        <UserIcon/>: 
        <LoginButton onClick={() => navigate("/login", { state: { returnTo: `/home` } })} />
        }
      </div>
    </div>
  );
}
