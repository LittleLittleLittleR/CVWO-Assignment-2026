import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MainHeader } from '../components/Header';
import Button from "../components/Button";
import { useAuth } from "../Auth";

export default function Login() {
  const api_url = import.meta.env.API_URL || 'http://localhost:8080';
  const navigate = useNavigate();
  const { setUser, loading } = useAuth();

  if (loading) {
    return null;
  }

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");

  const getByUsername = (action: "login" | "signup") => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let response;
      if (action === "login") {
        response = await fetch(`${api_url}/users/username/${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      } else {
        response = await fetch(`${api_url}/users/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        })
      }

      const json = await response.json();

      if (!json || json.length === 0) {
        throw new Error("User not found");
      }

      setUser(json[0]);
      navigate("/home");

    } catch (error) {
      console.error('Error fetching user:', error);
      setError(`User ${username} not found.`);
    }
  };

  return (
    <div>
      <div className="flex justify-left items-center p-4">
        <MainHeader/>
      </div>
      <div>
        <div className="mb-4">
          <Button variant="square" value="Log In" onClick={() => setMode("login")} />
          <Button variant="square" value="Sign Up" onClick={() => setMode("signup")} />
        </div>
        <div>
          {mode === "login" ? (
            <form onSubmit={getByUsername("login")}>
              <div>
                <label>Username</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} />
              </div>
              <input type="submit" value="Log In" />
            </form>
          ) : (
            <form onSubmit={getByUsername("signup")}>
              <div>
                <label>Username</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} />
              </div>
              <input type="submit" value="Sign Up" />
            </form>
          )}
        </div>    
        {error && <p className="text-red-500">{error}</p>}      
      </div>
    </div>
  );
};
