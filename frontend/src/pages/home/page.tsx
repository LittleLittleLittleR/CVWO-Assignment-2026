"use client"

import React from 'react';
import { MainHeader } from '../../components/Header';
import Header from '../../components/Header';
import { LoginButton } from '../../components/Button';
import type { Topic } from '../../types/topic.type';

export default function Home() {
  const api_url = import.meta.env.VITE_API_URL || '/api';

  const [topics, setTopics] = React.useState<Array<any>>([]);

  const fetchTopics = async () => {
    try {
      const response = await fetch(`${api_url}/topics/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const json = await response.json();
      console.log('Fetched topics:', json);
      setTopics(json);

    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  React.useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex justify-between items-center p-4">
        <MainHeader />
        <LoginButton />
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
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Header variant="sub" title="Recent" />
        </div>
      </main>
    </div>
  );
}