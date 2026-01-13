import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/page";
import Login from "./pages/login/page";
import User from "./pages/user/[userId]/page";
import { useAuth, AuthProvider } from "./Auth";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/users/:username" element={<User/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
