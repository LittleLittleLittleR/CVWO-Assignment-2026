import React, { useState } from "react";
import type { CommentResponse } from "../../types/comment";
import { useAuth } from "../Auth";
import Button from "./Button";
import DeleteWarning from "./DeleteWarning";
import InputField from "./InputField";
import Header from "./Header";

type CommentDisplayProps = {
  post_id: string | undefined;
  comment_list: CommentResponse[];
  onRefresh: () => void;
};

export default function CommentDisplay({ post_id, comment_list, onRefresh }: CommentDisplayProps) {
  const api_url = import.meta.env.API_URL || 'http://localhost:8080';
  const { user, loading } = useAuth();

  const [commentInput, setCommentInput] = useState<string>("");
  const [replyComment, setReplyComment] = useState<CommentResponse | null>(null);
  const [deleteActive, setDeleteActive] = useState<Boolean>(false);
  const [deleteCommentId, setDeleteCommentId] = useState<Number | undefined>(undefined);

  function formatDate(created_at: string) {
    const date = new Date(created_at);
  
    const datePart = date.toLocaleDateString("en-UK");
    const timePart = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${datePart} | ${timePart}`;
  }

  const addComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${api_url}/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.id,
          post_id: post_id,
          body: commentInput,
        }),
      });

      if (response.ok) {
        setCommentInput("");
        onRefresh();
      } else {
        console.error('Error adding comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleReply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${api_url}/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.id,
          post_id: post_id,
          body: commentInput,
          parent_comment_id: replyComment?.id,
        }),
      });
      if (response.ok) {
        setCommentInput("");
        setReplyComment(null);
        onRefresh();
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  if (loading) {
    return null;
  }

  function renderComments(parentId?: number | null) {
    // filter out the comments with the given parentId
    // iterate through the filtered comments and render them
    // for each comment, recursively render its children
    return comment_list
      .filter(comment => comment.parent_comment_id === parentId)
      .map(comment => (
        <div key={comment.id} className="py-2 ">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col">
              <p className="text-blue-500 font-semibold">@{comment.username}</p>
              <p className="font-semibold">{comment.body}</p>
            </div>
            <div className="flex flex-col items-center">
              <p>{formatDate(comment.created_at)}</p>
              <div className="w-full flex flex-row gap-4 items-center justify-end">
                { user && (
                  <Button
                    variant="replyIcon"
                    value="Reply"
                    onClick={() => setReplyComment(replyComment === comment ? null : comment)}
                  />
                )}
                {comment.user_id === user?.id && (
                  <Button 
                    variant="deleteIcon" 
                    value="Delete" 
                    onClick={() => { 
                      setDeleteCommentId(comment.id); 
                      setDeleteActive(true); 
                    }} 
                  />
                )}
              </div>
            </div>
          </div>
          <div className="pl-4 border-l ml-2">
            {renderComments(comment.id)}
          </div>
        </div>
      ));
  }

  return (
    <>
      <div className="mt-2 px-3 bg-white">{renderComments()}</div>
      
      {user &&
      <div className="w-full fixed left-0 bottom-0 z-10 bg-gray-300 px-3 py-2">
        {replyComment && 
        <div className="w-auto flex flex-row items-center gap-4 mb-2">
          <p>
            Replying to{" "}
            <span className="font-semibold text-blue-500">@{replyComment.username}</span>
          </p>
          <Button variant="cancelIcon" value="Cancel" onClick={() => setReplyComment(null)} />
        </div>
        }
        <form className='w-full flex flex-row gap-2' onSubmit={replyComment ? handleReply : addComment}>
          <InputField variant='text' value={commentInput} onChange={setCommentInput} placeholder={"Write something..."}/>
          <InputField variant='submit' value='Comment'/>
        </form>
      </div>
      }
      {deleteActive && 
      <DeleteWarning 
        item_type="comment" 
        item_id={deleteCommentId} 
        item_name={""} 
        closeDelete={() => {
          setDeleteActive(false);
          onRefresh();
        }} />
      }
    </>  
  );
}

