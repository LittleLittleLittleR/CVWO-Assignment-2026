import React from 'react';
import { MainHeader } from '../../components/Header';
import Header from '../../components/Header';
import { LoginButton } from '../../components/Button';

export default function Home() {

  const [topics, setTopics] = React.useState<Array<any>>([]);

  const fetchTopics = async () => {
    try {
      const response = await fetch('http://localhost:8080/topics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setTopics(data.topics);

    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  React.useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex justify-between items-center p-4">
        <MainHeader />
        <LoginButton />
      </div>
      <main className="flex-1">
        <div>
          <Header variant="sub" title="Trending" />
          <ul>
            {topics.map((topic) => (
              <li key={topic.id} className="border-b p-4">
                <h3 className="text-lg font-semibold">{topic.title}</h3>
                <p className="text-gray-600">{topic.description}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Header variant="sub" title="Recent" />
        </div>
      </main>
    </div>
  );
}