import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Header, { MainHeader } from '../components/Header';
import Button from '../components/Button';
import UserIcon from '../components/UserIcon';
import { useAuth } from '../Auth';

import type { PostResponse } from '../../types/post';
import type { CommentResponse } from '../../types/comment';

export default function Topic() {
  const api_url = import.meta.env.API_URL || 'http://localhost:8080';
  const { user } = useAuth();

  const { postid } = useParams<{ postid: string }>();

  const [post, setPost] = useState<PostResponse | null>(null);
  const [comments, setComments] = useState<Array<CommentResponse>>([]);

  const fetchTopicDetails = async () => {
    try {
      const topicResponse = await fetch(`${api_url}/posts/id/${postid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const postResponse = await fetch(`${api_url}/comments/postid/${postid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const postJson = await topicResponse.json();
      const commentJson = await postResponse.json();
      setPost(postJson[0]);
      setComments(commentJson);

    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };

  useEffect(() => {
    fetchTopicDetails();
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
        <div>
          <Header variant="sub" title={post?.title} />
          <Link to={`/updatePosts/${postid}`}>
            <Button variant="secondary" value="Edit Post"/>
          </Link>
        </div>
        <p>
          {post?.body}
        </p>
        <div>
          <Header variant="sub" title="Comments" />
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>
                  <h3>{comment.body}</h3>
                  <p>{comment.created_at}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}