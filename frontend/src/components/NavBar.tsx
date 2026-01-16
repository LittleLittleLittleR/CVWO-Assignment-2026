import { Link } from "react-router-dom";
import { useAuth } from "../Auth";

import Button, { BackButton } from "./Button";
import UserIcon from "./UserIcon";
import { MainHeader } from "./Header";

export default function NavBar() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <div className="flex justify-between items-center p-4">
      <BackButton />
      <MainHeader />
      {user ? 
      <UserIcon/>: 
      <Link to="/login" state={{ returnTo: `/home` }}>
        <Button variant="primary" value="Log In" /> 
      </Link>
      }
    </div>
  );
}
