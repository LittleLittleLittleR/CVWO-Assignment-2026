import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Header, { MainHeader } from '../components/Header';
import Button, { BackButton } from '../components/Button';
import UserIcon from '../components/UserIcon';
import ListDisplay from '../components/ListDisplay';
import DeleteWarning from '../components/DeleteWarning';
import { useAuth } from '../Auth';

import type { UserResponse } from '../../types/user';
import type { TopicResponse } from '../../types/topic';
import type { PostResponse } from '../../types/post';

export default function Topic() {
  const api_url = import.meta.env.API_URL || 'http://localhost:8080';
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  const { topicid } = useParams<{ topicid: string }>();

  const [topicUser, setTopicUser] = useState<UserResponse | null>(null);
  const [topic, setTopic] = useState<TopicResponse | null>(null);
  const [posts, setPosts] = useState<Array<PostResponse>>([]);
  const [deleteActive, setDeleteActive] = useState<Boolean>(false);

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
      const topicJson = (await topicResponse.json())[0];
      const postJson = await postResponse.json();
      await setTopic(topicJson);
      await setPosts(postJson);

      const userResponse = await fetch(`${api_url}/users/id/${topicJson?.user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const userJson = (await userResponse.json())[0];
      await setTopicUser(userJson);

    } catch (error) {
      console.error('Error fetching topic details:', error);
    }
  };

  useEffect(() => {
    fetchTopicDetails();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center p-4">
        <BackButton />
        <MainHeader />
        {user ? 
        <UserIcon/>: 
        <Link to="/login" state={{ returnTo: `/topics/${topicid}` }}>
          <Button variant="primary" value="Log In" /> 
        </Link>}
      </div>
      <main className="">
        <div>
          <Header variant="sub" title={`${topicUser?.username} | ${topic?.topic_name}`} />
          {topic?.user_id === user?.id && (
          <>
            <Link to={`/updateTopics/${topicid}`} state={{ returnTo: `/topics/${topicid}` }}>
              <Button variant="secondary" value="Update Topic"/>
            </Link>
            <Button variant="secondary" value="Delete Post" onClick={() => setDeleteActive(!deleteActive)}/>
          </>
          )}
        </div>
        <p>
          {topic?.topic_description}
        </p>
        <Header variant="sub" title="Posts" />
        {user && (
        <Link to={`/addPosts/${topicid}`} state={{ returnTo: `/topics/${topicid}` }}>
          <Button variant="secondary" value="Create Post"/>
        </Link>
        )}
          <ListDisplay item_list={posts} item_type="post" />
        {deleteActive && (<DeleteWarning item_type="topic" item_id={topic?.id} item_name={topic?.topic_name} />)}
      </main>
    </div>
  );
}