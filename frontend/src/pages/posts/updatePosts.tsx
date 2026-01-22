import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Header from '../../components/Header';
import InputField from '../../components/InputField';
import NavBar from '../../components/NavBar';

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
      <NavBar/>
      <Header variant="sub" title="Update Post" />
      <form className='flex flex-col gap-2' onSubmit={updatePost}>
        <div>
          <label>Post Title</label>
          <InputField variant="text" value={postTitle} onChange={setPostTitle} />
        </div>
        <div>
          <label>Post Body</label>
          <InputField variant="textarea" value={postBody} onChange={setPostBody} />
        </div>
        <InputField variant="submit" value="Update Post" />
      </form>
    </div>
  );
}