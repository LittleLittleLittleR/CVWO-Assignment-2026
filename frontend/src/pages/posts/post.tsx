import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Header from '../../components/Header';
import { DeleteButton, EditButton } from '../../components/Button';
import DeleteWarning from '../../components/DeleteWarning';
import { useAuth } from '../../Auth';

import type { UserResponse } from '../../../types/user';
import type { PostResponse } from '../../../types/post';
import type { CommentResponse } from '../../../types/comment';
import NavBar from '../../components/NavBar';
import CommentDisplay from '../../components/commentDisplay';

export default function Post() {
  const api_url = import.meta.env.API_URL || 'http://localhost:8080';
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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
    <div className="flex flex-col">
      <NavBar variant="other"/>
      <div className='flex flex-row '>
        <Header variant="sub" title={`${postUser?.username}/${post?.title}`} />
        {post?.user_id === user?.id && (
        <>
          <Header variant="sub" title="|" className="mx-4" />
          <div  className="flex gap-4">
            <EditButton onClick={() => {
              navigate(`/updatePosts/${postid}`, 
                { state: { returnTo: `/posts/${postid}` } })
            }}/>
            <DeleteButton onClick={() => setDeleteActive(!deleteActive)}/>
              
          </div>
        </>
        )}
      </div>
      <p className="my-4 border-2 px-3 py-2 rounded-lg bg-white">
        {post?.body}
      </p>
      <Header variant="sub" title="Comments" />
      <CommentDisplay
        post_id={postid}
        comment_list={comments}
        onRefresh={fetchTopicDetails}
      />
      {deleteActive && (
        <DeleteWarning 
          item_type="post" 
          item_id={post?.id} 
          item_name={post?.title} 
          closeDelete={async () => {
            setDeleteActive(false);
            fetchTopicDetails();
          }} />
      )}
    </div>
  );
}