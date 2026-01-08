"client"

import React from "react";
import { useState } from "react";
import Button from "../../components/Button";

export default function Login() {
  const [mode, setMode] = useState<"login" | "signup">("login");


  return (
    <div>
      <div className="flex justify-center mt-10 margin-auto">
        <div className="mb-4">
          <Button variant="square" value="Log In" onClick={() => setMode("login")} />
          <Button variant="square" value="Sign Up" onClick={() => setMode("signup")} />
        </div>
        <div>
          {mode === "login" ? (
            <form>
              <div>
                <label>Username</label>
                <input type="text" name="username" />
              </div>
              <input type="submit" value="Log In" />
            </form>
          ) : (
            <form>
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
