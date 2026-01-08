import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/page";

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home user={null} />} />
      </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App
