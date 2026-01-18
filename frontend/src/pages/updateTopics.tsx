import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Header, { MainHeader } from '../components/Header';
import UserIcon from '../components/UserIcon';
import { BackButton } from '../components/Button';
import InputField from '../components/InputField';
import NavBar from '../components/NavBar';

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
      <NavBar variant="other" />
      <Header variant="sub" title="Update Topic" />
      <form className='flex flex-col gap-2' onSubmit={updateTopic}>
        <div>
          <label>Topic Name</label>
          <InputField variant="text" value={topicName} onChange={setTopicName} />
        </div>
        <div>
          <label>Topic Description</label>
          <InputField variant="textarea" value={topicDescription} onChange={setTopicDescription} />
        </div>
        <InputField variant="submit" value="Update Topic" />
      </form>
    </div>
  );
}