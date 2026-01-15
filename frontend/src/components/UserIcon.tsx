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

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-icon-dropdown')) {
      setDropdownOpen(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold cursor-pointer border rounded-full p-2"
      onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {user?.username}
      </h2>
      {dropdownOpen && (
        <div className="absolute right-5 mt-1 w-30 bg-white border rounded-lg shadow-lg flex flex-col p-2">
            <Button variant="primary" value="Profile" onClick={handleProfile}/>
          <Button variant="square" value="Log Out" onClick={handleLogout} />
        </div>
      )}
    </div>
  );
}