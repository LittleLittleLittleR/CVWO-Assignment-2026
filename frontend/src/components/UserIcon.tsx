import { useState } from "react";
import { Link } from "react-router-dom";


import Button from "./Button";
import { useAuth } from "../Auth";

export default function UserIcon() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div>
      <h2 onClick={() => setDropdownOpen(!dropdownOpen)}>{user?.username}</h2>
      {dropdownOpen && (
        <div>
          <Link to={`/users/${user?.username}`}>
            <Button variant="primary" value="Profile"/>
          </Link>
          <Button variant="square" value="Log Out" onClick={handleLogout} />
        </div>
      )}
    </div>
  );
}