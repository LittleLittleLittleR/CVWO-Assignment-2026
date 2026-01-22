import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Header from '../../components/Header';
import { CreateButton, DeleteButton, EditButton } from '../../components/Button';
import ListDisplay from '../../components/ListDisplay';
import DeleteWarning from '../../components/DeleteWarning';
import { useAuth } from '../../Auth';

import type { UserResponse } from '../../../types/user';
import type { TopicResponse } from '../../../types/topic';
import type { PostResponse } from '../../../types/post';
import NavBar from '../../components/NavBar';

export default function Topic() {
  const api_url = import.meta.env.API_URL || 'http://localhost:8080';
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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
      <NavBar variant="other"/>
      <div className='flex flex-row '>
        <Header variant="sub" title={`${topicUser?.username}/${topic?.topic_name}`} />
        {topic?.user_id === user?.id && (
          <>
            <Header variant="sub" title="|" className="mx-4" />
            <div  className="flex gap-4">
              <EditButton onClick={() => navigate(`/updateTopics/${topicid}`, { state: { returnTo: `/topics/${topicid}` } })} />
              <DeleteButton onClick={() => setDeleteActive(!deleteActive)}/>
            </div>
          </>
        )}
      </div>
      <p className="my-4 border-2 px-3 py-2 rounded-lg bg-white">
        {topic?.topic_description}
      </p>
      <div className='flex flex-row'>
        <Header variant="sub" title="Posts" />
        {user && (
        <>
          <Header variant="sub" title="|" className="mx-4" />
          <CreateButton onClick={() => navigate(`/addPosts/${topicid}`, { state: { returnTo: `/topics/${topicid}` } })} />
        </>
        )}
      </div>
      <ListDisplay item_list={posts} item_type="post" curLocation={`/topics/${topicid}`} />
      {deleteActive && (<DeleteWarning item_type="topic" item_id={topic?.id} item_name={topic?.topic_name} closeDelete={() => setDeleteActive(false)}/>)}
    </div>
  );
}