import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import type { TopicResponse } from '../../types/topic';
import type { PostResponse } from '../../types/post';
import type { UserResponse } from '../../types/user';

import Header, { MainHeader } from '../components/Header';
import UserIcon from '../components/UserIcon';
import Button from '../components/Button';
import { useAuth } from '../Auth';

export default function User() {
  const api_url = import.meta.env.API_URL || 'http://localhost:8080';
  const { user } = useAuth();

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

      console.log("Fetched profile user:", userJson);
      console.log("Fetched profile topics:", topicJson);
      console.log("Fetched profile posts:", postsJson);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    if (!username) return;

    fetchProfile();
}, [username]);

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
        <Header variant="sub" title={profileUser?.username} />
        <Button variant="secondary" value="Topics" onClick={() => setActiveTab('topics')} />
        <Button variant="secondary" value="Posts" onClick={() => setActiveTab('posts')} />
        {activeTab === 'topics' && <div>
          <ul>
            {profileTopics.map((topic) => (
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
        </div>}
        {activeTab === 'posts' && <div>
          <ul>
            {profilePosts.map((post) => (
              <li key={post.id}
                onClick={() => {
                  window.location.href = `/posts/${post.id}`;
                }}
              >
                <h3>{post.title}</h3>
                <p>{post.body}</p>
                <p>{post.created_at}</p>
              </li>
            ))}
          </ul>
        </div>}
      </main>
    </div>
  );
}