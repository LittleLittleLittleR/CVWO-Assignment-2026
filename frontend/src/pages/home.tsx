import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import type { TopicResponse } from '../../types/topic';

import Header from '../components/Header';
import Button from '../components/Button';
import ListDisplay from '../components/ListDisplay';
import { useAuth } from '../Auth';
import NavBar from '../components/NavBar';

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
    <div className="flex flex-col">
      <NavBar />
      <div>
        <div className='flex flex-row '>
          <Header variant="sub" title="Topics" className="mr-4" />
          { user &&
          <Link to="/addTopics" state={{ returnTo: `/home` }}>
            <Button variant="secondary" value="Create Topic"/>
          </Link>
          }
        </div>
        <ListDisplay item_list={topics} item_type="topic" />
      </div>
    </div>
  );
}