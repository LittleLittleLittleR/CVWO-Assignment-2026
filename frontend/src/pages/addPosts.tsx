import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Header from '../components/Header';
import { useAuth } from '../Auth';

export default function AddPosts() {
  const navigate = useNavigate();
  const api_url = import.meta.env.API_URL || 'http://localhost:8080';
  const { user } = useAuth();

  const { topicid } = useParams<{ topicid: string }>();

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');

  const createPost = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const response = await fetch(`${api_url}/posts/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user?.id,
            topic_id: topicid,
            title: newPostTitle,
            body: newPostBody,
          }),
        });
  
        const json = (await response.json())[0];
        navigate(`/posts/${json.id}`);

      } catch (error) {
        console.error('Error creating post:', error);
      }
    };

  return (
    <div>
      <Header variant="sub" title="Create New Post" />
      <form onSubmit={createPost}>
        <div>
          <label htmlFor="postTitle">Post Title</label>
          <input type="text" value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} />
        </div>
        <div>
          <label htmlFor="postBody">Post Body</label>
          <textarea value={newPostBody} onChange={(e) => setNewPostBody(e.target.value)} />
        </div>
        <input type="submit" value="Create Post" />
      </form>
    </div>
  );
}