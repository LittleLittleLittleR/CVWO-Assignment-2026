"client"

import React from "react";
import { useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");


  return (
    <div>
      <div className="flex justify-center mt-10 margin-auto">
        <div className="mb-4">
          <button
            className={`px-4 py-2 mr-2 rounded ${
              mode === "login" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded ${
              mode === "signup" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        
      </div>
      
    </div>
  );
};
