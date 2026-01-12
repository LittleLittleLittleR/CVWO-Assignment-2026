import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import type { UserResponse } from '../../../types/user';
import type { TopicResponse } from '../../../types/topic';

import Header from '../../components/Header';
import { MainHeader } from '../../components/Header';
import { LoginButton } from '../../components/Button';

export default function Home() {
  const api_url = import.meta.env.API_URL || 'http://localhost:8080';
  const location = useLocation();
  const user: UserResponse | null = location.state?.user[0] || null;

  const [topics, setTopics] = useState<Array<TopicResponse>>([]);

  console.log('User in Home:', user);

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
        <MainHeader />
        {user ? user.username : <LoginButton />}
      </div>
      <main className="flex-1">
        <div>
          <Header variant="sub" title="Trending" />
          <ul>
            {topics.map((topic) => (
              <li key={topic.id}
                onClick={() => {
                  window.location.href = `/topics/${topic.id}`;
                }}
              >
                <h3>{topic.topic_name}</h3>
                <p>{topic.topic_description}</p>
                <p>{topic.created_at}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Header variant="sub" title="Recent" />
          <ul>
            {topics.map((topic) => (
              <li key={topic.id}
                onClick={() => {
                  window.location.href = `/topics/${topic.id}`;
                }}
              >
                <h3>{topic.topic_name}</h3>
                <p>{topic.topic_description}</p>
                <p>{topic.created_at}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}