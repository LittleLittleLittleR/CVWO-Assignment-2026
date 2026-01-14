import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import type { TopicResponse } from '../../types/topic';

import Header, { MainHeader } from '../components/Header';
import Button, { BackButton } from '../components/Button';
import UserIcon from '../components/UserIcon';
import { useAuth } from '../Auth';

export default function Home() {
  const api_url = import.meta.env.API_URL || 'http://localhost:8080';
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  const [topics, setTopics] = useState<Array<TopicResponse>>([]);

  const fetchTopics = async () => {
    try {
      const response = await fetch(`${api_url}/topics/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const json = await response.json();
      setTopics(json);

    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex justify-between items-center p-4">
        <BackButton />
        <MainHeader />
        {user ? 
        <UserIcon/>: 
        <Link to="/login">
          <Button variant="primary" value="Log In" /> 
        </Link>
        }
      </div>
      <main className="flex-1">
        <div>
          <Header variant="sub" title="Topics" />
          <Link to="/addTopics">
            <Button variant="secondary" value="Create Topic"/>
          </Link>
          <ul>
            {topics.map((topic) => (
                <li key={topic.id}>
                  <Link to={`/topics/${topic.id}`}>
                    <h3>{topic.topic_name}</h3>
                    <p>{topic.topic_description}</p>
                    <p>{topic.created_at}</p>
                  </Link>
                </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}