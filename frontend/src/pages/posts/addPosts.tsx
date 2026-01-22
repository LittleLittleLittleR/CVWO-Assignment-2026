import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Header from '../../components/Header';
import { useAuth } from '../../Auth';
import InputField from '../../components/InputField';
import NavBar from '../../components/NavBar';

export default function AddPosts() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo;

  const api_url = import.meta.env.API_URL || 'http://localhost:8080';
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  const { topicid } = useParams<{ topicid: string }>();

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
;

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
        navigate(`/posts/${json.id}`, {
          state: { returnTo: returnTo ?? `/topics/${topicid}` },
        });

      } catch (error) {
        console.error('Error creating post:', error);
      }
    };

  return (
    <div>
      <NavBar variant="other" />
      <Header variant="sub" title="Create New Post" />
      <form className='flex flex-col gap-2' onSubmit={createPost}>
        <div>
          <label>Post Title</label>
          <InputField variant="text" value={newPostTitle} onChange={setNewPostTitle} />
        </div>
        <div>
          <label>Post Body</label>
          <InputField variant="textarea" value={newPostBody} onChange={setNewPostBody} />
        </div>
        <InputField variant="submit" value="Create Post" />
      </form>
    </div>
  );
}