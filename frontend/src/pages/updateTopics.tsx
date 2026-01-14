import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Header, { MainHeader } from '../components/Header';
import UserIcon from '../components/UserIcon';
import { BackButton } from '../components/Button';

export default function UpdateTopics() {
  const navigate = useNavigate();
  const api_url = import.meta.env.API_URL || 'http://localhost:8080';

  const { topicid } = useParams<{ topicid: string }>();

  const [topicName, setTopicName] = useState('');
  const [topicDescription, setTopicDescription] = useState('');

  const getTopic = async () => {
    try {
      const response = await fetch(`${api_url}/topics/id/${topicid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const json = (await response.json())[0];
      setTopicName(json.topic_name);
      setTopicDescription(json.topic_description);
    } catch (error) {
      console.error('Error fetching topic:', error);
    }
  };

  const updateTopic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${api_url}/topics/id/${topicid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic_name: topicName,
          topic_description: topicDescription,
        }),
      });

      const json = (await response.json())[0];
      navigate(`/topics/${json.id}`);

    } catch (error) {
      console.error('Error updating topic:', error);
    }
  };

  useEffect(() => {
      if (!topicid) return;
      getTopic();
  }, [topicid]);

  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <BackButton />
        <MainHeader />
        <UserIcon/>
      </div>
      <Header variant="sub" title="Update Topic" />
      <form onSubmit={updateTopic}>
        <div>
          <label htmlFor="topicName">Topic Name</label>
          <input type="text" value={topicName} onChange={(e) => setTopicName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="topicDescription">Topic Description</label>
          <textarea value={topicDescription} onChange={(e) => setTopicDescription(e.target.value)} />
        </div>
        <input type="submit" value="Update Topic" />
      </form>
    </div>
  );
}