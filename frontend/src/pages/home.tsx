import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import type { TopicResponse } from '../../types/topic';

import Header, { MainHeader } from '../components/Header';
import Button, { BackButton } from '../components/Button';
import UserIcon from '../components/UserIcon';
import ListDisplay from '../components/ListDisplay';
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
        <Link to="/login" state={{ returnTo: `/home` }}>
          <Button variant="primary" value="Log In" /> 
        </Link>
        }
      </div>
      <main className="">
        <div>
          <Header variant="sub" title="Topics" />
          <Link to="/addTopics" state={{ returnTo: `/home` }}>
            <Button variant="secondary" value="Create Topic"/>
          </Link>
          <ListDisplay item_list={topics} item_type="topic" />
        </div>
      </main>
    </div>
  );
}