import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Header from '../../components/Header';
import { useAuth } from '../../Auth';
import InputField from '../../components/InputField';
import NavBar from '../../components/NavBar';

export default function AddTopics() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo;
  
  const api_url = import.meta.env.API_URL || 'http://localhost:8080';
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

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
        navigate(`/topics/${json.id}`, {
          state: { returnTo: returnTo ?? `/home` },
        });

      } catch (error) {
        console.error('Error creating topic:', error);
      }
    };

  return (
    <div>
      <NavBar variant="other" />
      <Header variant="sub" title="Create New Topic" />
      <form className='flex flex-col gap-2' onSubmit={createTopic}>
        <div>
          <label>Topic Name</label>
          <InputField variant="text" value={newTopicName} onChange={setNewTopicName} />
        </div>
        <div>
          <label>Topic Description</label>
          <InputField variant="textarea" value={newTopicDescription} onChange={setNewTopicDescription} />
        </div>
        <InputField variant="submit" value="Create Topic" />
      </form>
    </div>
  );
}