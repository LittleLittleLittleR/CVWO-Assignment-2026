import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../components/Button";
import { useAuth } from "../Auth";
import NavBar from "../components/NavBar";
import InputField from "../components/InputField";

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

      if (json.error || json.length === 0) {
        throw new Error;
      }

      setUser(json[0]);
      navigate("/home");

    } catch (error) {
      if (username.trim() === "") {
        setError("Username cannot be empty.");
        return;
      } else if (action === "signup") {
        setError(`Invalid username. Please try a different one.`);
        return;
      } else if (action === "login") {
        setError(`User ${username} not found.`);
      }
    }
  };

  return (
    <div>
      <NavBar />
      <div className="w-1/3 mx-auto border rounded-lg mt-20 bg-white text-center pb-4">
        <div className="w-full">
          <Button 
          variant="square" 
          value="Log In" 
          onClick={() => {setMode("login"); setError("")}} 
          className={`w-1/2 rounded-tl-lg ${mode === "login" ? "bg-gray-500 text-white" : ""}`} />
          <Button 
          variant="square" 
          value="Sign Up" 
          onClick={() => {setMode("signup"); setError("")}} 
          className={`w-1/2 rounded-tr-lg ${mode === "signup" ? "bg-gray-500 text-white" : ""}`} />
        </div>
          {mode === "login" ? (
            <form onSubmit={getByUsername("login")} className="h-full flex flex-col gap-4 p-4">
                <label>Log in with an existing username</label>
                <InputField 
                  variant="text" 
                  value={username} 
                  onChange={setUsername} />
              <InputField variant="submit" value="Log In" />
            </form>
          ) : (
            <form onSubmit={getByUsername("signup")} className="h-full flex flex-col gap-4 p-4">
                <label>Sign up with a new username</label>
                <InputField 
                  variant="text" 
                  value={username} 
                  onChange={setUsername} />
              <InputField variant="submit" value="Sign Up" />
            </form>
          )}   
        {error? <p className="text-red-500">{error}</p> : <p></p>}     
      </div>
    </div>
  );
};
