import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TopicResponse } from '../../types/topic';

import Header from '../components/Header';
import { CreateButton } from '../components/Button';
import ListDisplay from '../components/ListDisplay';
import { useAuth } from '../Auth';
import NavBar from '../components/NavBar';

export default function Home() {
  const api_url = import.meta.env.API_URL || 'http://localhost:8080';
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
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
      <NavBar variant="home"/>
      <div>
        <div className='flex flex-row'>
          <Header variant="sub" title="Topics"/>
          { user &&
          <>
            <Header variant="sub" title="|" className="mx-4" />
            <CreateButton onClick={() => {
              navigate(`/addTopics`, { state: { returnTo: `/home` } })
            }} />
          </>
          }
        </div>
        <ListDisplay item_list={topics} item_type="topic" curLocation={`/home`} />
      </div>
    </div>
  );
}