import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import User from "./pages/userProfile";
import Topic from "./pages/topic";
import AddTopics from "./pages/addTopics";
import UpdateTopics from "./pages/updateTopics";
import { useAuth } from "./Auth";

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
          <Route path="/topics/:topicid" element={<Topic/>} />
          <Route path="/addTopics" element={<AddTopics />} />
          <Route path="/updateTopics/:topicid" element={<UpdateTopics />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
