import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import type { TopicResponse } from '../../types/topic';
import type { PostResponse } from '../../types/post';
import type { UserResponse } from '../../types/user';

import NavBar from '../components/NavBar';
import Header from '../components/Header';
import Button from '../components/Button';
import { useAuth } from '../Auth';
import ListDisplay from '../components/ListDisplay';

export default function User() {
  const api_url = import.meta.env.API_URL || 'http://localhost:8080';
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  const { username } = useParams<{ username: string }>();

  const [profileUser, setProfileUser] = useState<UserResponse | null>(null);
  const [profileTopics, setProfileTopics] = useState<Array<TopicResponse>>([]);
  const [profilePosts, setProfilePosts] = useState<Array<PostResponse>>([]);
  const [activeTab, setActiveTab] = useState<'topics' | 'posts'>('topics');

  const fetchProfile = async () => {
    try {
      const userResponse = await fetch(`${api_url}/users/username/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const userJson = (await userResponse.json())[0];
      setProfileUser(userJson);

      const topicsResponse = await fetch(`${api_url}/topics/userid/${userJson.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const postsResponse = await fetch(`${api_url}/posts/userid/${userJson.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const topicJson = await topicsResponse.json();
      setProfileTopics(topicJson);
      const postsJson = await postsResponse.json();
      setProfilePosts(postsJson);
      
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    if (!username) return;

    fetchProfile();
}, [username]);

  return (
    <div className="flex flex-col">
      <NavBar variant="other"/>
      <div className='flex flex-row '>
        <Header variant="sub" title={profileUser?.username} />
        <Header variant="sub" title="|" className="mx-4" />
        <div  className="flex gap-4">
          <Button variant="secondary" value="Topics" onClick={() => setActiveTab('topics')} />
          <Button variant="secondary" value="Posts" onClick={() => setActiveTab('posts')} />
        </div>
      </div>
        {activeTab === 'topics' && <div>
          <ListDisplay item_list={profileTopics} item_type="topic" curLocation={`/users/${username}`} />
        </div>}
        {activeTab === 'posts' && <div>
          <ListDisplay item_list={profilePosts} item_type="post" curLocation={`/users/${username}`} />
        </div>}
    </div>
  );
}