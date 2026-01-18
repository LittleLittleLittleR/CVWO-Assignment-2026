import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Header from '../components/Header';
import Button from '../components/Button';
import DeleteWarning from '../components/DeleteWarning';
import { useAuth } from '../Auth';

import type { UserResponse } from '../../types/user';
import type { PostResponse } from '../../types/post';
import type { CommentResponse } from '../../types/comment';
import NavBar from '../components/NavBar';

export default function Post() {
  const api_url = import.meta.env.API_URL || 'http://localhost:8080';
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  const { postid } = useParams<{ postid: string }>();

  const [postUser, setPostUser] = useState<UserResponse | null>(null);
  const [post, setPost] = useState<PostResponse | null>(null);
  const [comments, setComments] = useState<Array<CommentResponse>>([]);
  const [deleteActive, setDeleteActive] = useState<Boolean>(false);

  const fetchTopicDetails = async () => {
    try {
      const postResponse = await fetch(`${api_url}/posts/id/${postid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const commentResponse = await fetch(`${api_url}/comments/postid/${postid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const postJson = (await postResponse.json())[0];
      const commentJson = await commentResponse.json();
      await setPost(postJson);
      await setComments(commentJson);

      const userResponse = await fetch(`${api_url}/users/id/${postJson?.user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const userJson = (await userResponse.json())[0];
      await setPostUser(userJson);

    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };

  useEffect(() => {
    fetchTopicDetails();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar variant="other"/>
      <div className='flex flex-row '>
        <Header variant="sub" title={`${postUser?.username}/${post?.title}`} />
        {post?.user_id === user?.id && (
        <>
          <Header variant="sub" title="|" className="mx-4" />
          <div  className="flex gap-4">
            <Link to={`/updatePosts/${postid}`} state={{ returnTo: `/posts/${postid}` }}>
              <Button variant="secondary" value="Edit Post"/>
            </Link>
            <Button variant="secondary" value="Delete Post" onClick={() => setDeleteActive(!deleteActive)}/>
          </div>
        </>
        )}
      </div>
      <p className="my-4 border-2 px-3 py-2 rounded-lg bg-white">
        {post?.body}
      </p>
      <div className='flex flex-row'>
        <Header variant="sub" title="Comments" />
        {user && (
          <>
            <Header variant="sub" title="|" className="mx-4" />
          <Button variant="secondary" value="Comment"/>
          </>
          )}
      </div>
      <div>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
                <h3>{comment.body}</h3>
                <p>{comment.created_at}</p>
            </li>
          ))}
        </ul>
      </div>
      {deleteActive && (<DeleteWarning item_type="post" item_id={post?.id} item_name={post?.title} />)}
    </div>
  );
}