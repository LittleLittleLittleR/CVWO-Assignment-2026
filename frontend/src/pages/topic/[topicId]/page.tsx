import { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { MainHeader } from '../../../components/Header';
import { LoginButton } from '../../../components/Button';

export default function Home(topic: any, user: any) {
  const api_url = import.meta.env.API_URL || 'http://localhost:8000';

  const [posts, setPosts] = useState<Array<any>>([]);

  const fetchPostsByTopicId = async () => {
    try {
      const response = await fetch(`${api_url}/posts/${topic.id}`, {
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
        {user ? <LoginButton /> : null}
      </div>
      <main className="flex-1">
        <div>
          <Header variant="sub" title="Trending" />
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
        <div>
          <Header variant="sub" title="Recent" />
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