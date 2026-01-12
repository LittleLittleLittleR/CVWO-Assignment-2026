import React from "react";

import Button from "./Button";
import { useAuth } from "../Auth";

export default function UserIcon() {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const { user } = useAuth();

  const handleLogout = () => {
    const { setUser } = useAuth();
    setUser(null);
  };

  return (
    <div>
      <h2 onClick={() => setDropdownOpen(!dropdownOpen)}>{user?.username}</h2>
      {dropdownOpen && (
        <div>
          <Button variant="primary" value="Profile" onClick={() => window.location.href = `/users/${user?.id}`} />
          <Button variant="square" value="Log Out" onClick={handleLogout} />
        </div>
      )}
    </div>
  );
}