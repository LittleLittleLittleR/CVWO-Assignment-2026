import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import User from "./pages/userProfile";
import Topic from "./pages/topics/topic";
import AddTopics from "./pages/topics/addTopics";
import UpdateTopics from "./pages/topics/updateTopics";
import Post from "./pages/posts/post";
import AddPosts from "./pages/posts/addPosts";
import UpdatePost from "./pages/posts/updatePosts";
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

          <Route path="/posts/:postid" element={<Post />} />
          <Route path="/addPosts/:topicid" element={<AddPosts />} />
          <Route path="/updatePosts/:postid" element={<UpdatePost />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
