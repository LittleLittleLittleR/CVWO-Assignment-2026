import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "./Button";
import { useAuth } from "../Auth";

export default function UserIcon() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  const handleProfile = () => {
    navigate(`/users/${user?.username}`);
  }

  return (
    <div className="relative w-32">
    {dropdownOpen? (
      <>
        <h2
        className="w-full h-10 bg-white text-lg font-semibold cursor-pointer rounded-t p-2 border-t border-l border-r overflow-hidden"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        >
        ▲ {user?.username}
        </h2>
        <div className="absolute top-full left-0 w-full flex flex-col bg-white rounded-b border-b border-l border-r">
          <Button variant="dropdown" value="Profile" onClick={handleProfile} />
          <Button variant="dropdown" value="Log Out" onClick={handleLogout} />
        </div>
      </>
    ) : 
    (
      <h2
      className="w-full h-10 bg-white text-lg font-bold cursor-pointer rounded p-2 border overflow-hidden"
      onClick={() => setDropdownOpen(!dropdownOpen)}
      >
      ▼ {user?.username}
      </h2>
    )
    }
    </div>
  );
}  