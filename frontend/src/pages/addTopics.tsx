import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import { useAuth } from '../Auth';

export default function AddTopics() {
  const navigate = useNavigate();
  const api_url = import.meta.env.API_URL || 'http://localhost:8080';
  const { user } = useAuth();

  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');

  const createTopic = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const response = await fetch(`${api_url}/topics/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user?.id,
            topic_name: newTopicName,
            topic_description: newTopicDescription,
          }),
        });
  
        const json = (await response.json())[0];
        navigate(`/topics/${json.id}`);

      } catch (error) {
        console.error('Error creating topic:', error);
      }
    };

  return (
    <div>
      <Header variant="sub" title="Create New Topic" />
      <form onSubmit={createTopic}>
        <div>
          <label htmlFor="topicName">Topic Name</label>
          <input type="text" value={newTopicName} onChange={(e) => setNewTopicName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="topicDescription">Topic Description</label>
          <textarea value={newTopicDescription} onChange={(e) => setNewTopicDescription(e.target.value)} />
        </div>
        <input type="submit" value="Create Topic" />
      </form>
    </div>
  );
}