import { useState } from "react";
import { MainHeader } from '../../components/Header';
import Button from "../../components/Button";

export default function Login() {
  const api_url = import.meta.env.API_URL || 'http://localhost:8000';

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const getUserByUsername = async (username: string) => {
    try {
      const response = await fetch(`${api_url}/users/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const json = await response.json();
      setUser(json);

    } catch (error) {
      console.error('Error fetching user:', error);
      setError(`User ${username} not found.`);
    }
  };

  const createUser = async (username: string) => {
    try {
      const response = await fetch(`${api_url}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      const json = await response.json();
      setUser(json);

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
      <div className="flex justify-center mt-10 margin-auto">
        <div className="mb-4">
          <Button variant="square" value="Log In" onClick={() => setMode("login")} />
          <Button variant="square" value="Sign Up" onClick={() => setMode("signup")} />
        </div>
        <div>
          {mode === "login" ? (
            <form onSubmit={() => getUserByUsername(username)}>
              <div>
                <label>Username</label>
                <input type="text" name="username" />
              </div>
              <input type="submit" value="Log In" />
            </form>
          ) : (
            <form onSubmit={() => createUser(username)}>
              <div>
                <label>Username</label>
                <input type="text" name="username" />
              </div>
              <input type="submit" value="Sign Up" />
            </form>
          )}
        </div>          
      </div>
    </div>
  );
};
