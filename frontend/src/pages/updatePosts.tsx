import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Header, { MainHeader } from '../components/Header';
import Button, { BackButton } from '../components/Button';
import UserIcon from '../components/UserIcon';

export default function UpdatePost() {
  const navigate = useNavigate();
  const api_url = import.meta.env.API_URL || 'http://localhost:8080';

  const { postid } = useParams<{ postid: string }>();

  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');

  const getPost = async () => {
    try {
      const response = await fetch(`${api_url}/posts/id/${postid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const json = (await response.json())[0];
      setPostTitle(json.title);
      setPostBody(json.body);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const updatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${api_url}/posts/id/${postid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: postTitle,
          body: postBody,
        }),
      });

      const json = (await response.json())[0];
      navigate(`/posts/${json.id}`);

    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  useEffect(() => {
      if (!postid) return;
      getPost();
  }, [postid]);

  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <BackButton />
        <MainHeader />
        <UserIcon/>
      </div>
      <Header variant="sub" title="Update Post" />
      <form onSubmit={updatePost}>
        <div>
          <label htmlFor="postTitle">Post Title</label>
          <input type="text" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
        </div>
        <div>
          <label htmlFor="postBody">Post Body</label>
          <textarea value={postBody} onChange={(e) => setPostBody(e.target.value)} />
        </div>
        <input type="submit" value="Update Post" />
      </form>
    </div>
  );
}