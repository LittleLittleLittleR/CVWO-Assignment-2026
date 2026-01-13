import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Header, { MainHeader } from '../components/Header';
import Button from '../components/Button';
import UserIcon from '../components/UserIcon';
import { useAuth } from '../Auth';

import type { TopicResponse } from '../../types/topic';
import type { PostResponse } from '../../types/post';

export default function Topic() {
  const api_url = import.meta.env.API_URL || 'http://localhost:8080';
  const { user } = useAuth();

  const { topicid } = useParams<{ topicid: string }>();

  const [topic, setTopic] = useState<TopicResponse | null>(null);
  const [posts, setPosts] = useState<Array<PostResponse>>([]);

  const fetchTopicDetails = async () => {
    try {
      const topicResponse = await fetch(`${api_url}/topics/id/${topicid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const postResponse = await fetch(`${api_url}/posts/topicid/${topicid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const topicJson = await topicResponse.json();
      const postJson = await postResponse.json();
      setTopic(topicJson[0]);
      setPosts(postJson);

    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchTopicDetails();
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
        <Header variant="sub" title={topic?.topic_name} />
        <Link to={`/updateTopics/${topicid}`}>
          <Button variant="secondary" value="Update Topic"/>
        </Link>
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