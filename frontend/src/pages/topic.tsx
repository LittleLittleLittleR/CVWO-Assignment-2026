import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Header, { MainHeader } from '../components/Header';
import Button from '../components/Button';
import UserIcon from '../components/UserIcon';
import { useAuth } from '../Auth';

export default function Topic() {
  const api_url = import.meta.env.API_URL || 'http://localhost:8000';
  const { user } = useAuth();

  const { topicid } = useParams<{ topicid: string }>();

  const [posts, setPosts] = useState<Array<any>>([]);

  const fetchPostsByTopicId = async () => {
    try {
      const response = await fetch(`${api_url}/posts/topicid/${topicid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const json = await response.json();
      setPosts(json);

    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPostsByTopicId();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex justify-between items-center p-4">
        <MainHeader />
        {user ? 
        <UserIcon/>: 
        <Link to="/login">
          <Button variant="primary" value="Log In" /> 
        </Link>}
      </div>
      <main className="flex-1">
        <div>
          <Header variant="sub" title="Posts" />
          <ul>
            {posts.map((post) => (
              <li key={post.id}
                onClick={() => {
                  window.location.href = `/post/${post.id}`;
                }}
              >
                <h3>{post.title}</h3>
                <p>{post.created_at}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}