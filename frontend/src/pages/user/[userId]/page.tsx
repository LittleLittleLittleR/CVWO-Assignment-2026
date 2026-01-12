import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import type { TopicResponse } from '../../../../types/topic';

import Header from '../../../components/Header';
import { MainHeader } from '../../../components/Header';
import UserIcon from '../../../components/UserIcon';
import Button from '../../../components/Button';
import { useAuth } from '../../../Auth';

export default function User() {
  const api_url = import.meta.env.API_URL || 'http://localhost:8080';
  const { user } = useAuth();

  console.log("User page for user:", user);

  const [userTopics, setUserTopics] = useState<Array<TopicResponse>>([]);
  const [userPosts, setUserPosts] = useState<Array<any>>([]);

  const fetchTopics = async () => {
    try {
      console.log("Fetching topics from:", `${api_url}/topics/userid/${user?.id}`);
      const response = await fetch(`${api_url}/topics/userid/${user?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const json = await response.json();
      setUserTopics(json);

    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${api_url}/posts/userid/${user?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      setUserPosts(json);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchPosts();
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
        
      </main>
    </div>
  );
}