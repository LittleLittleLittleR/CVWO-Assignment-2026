import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MainHeader } from '../../components/Header';
import Button from "../../components/Button";

export default function Login() {
  const api_url = import.meta.env.API_URL || 'http://localhost:8080';
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");

  const getUserByUsername = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${api_url}/users/username/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const json = await response.json();
      navigate("/home", { state: { user: json } });

    } catch (error) {
      console.error('Error fetching user:', error);
      setError(`User ${username} not found.`);
    }
  };

  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${api_url}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      const json = await response.json();
      navigate("/home", { state: { user: json } });

    } catch (error) {
      console.error('Error creating user:', error);
      setError(`Failed to create user ${username}.`);
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
            <form onSubmit={getUserByUsername}>
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
            <form onSubmit={createUser}>
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
