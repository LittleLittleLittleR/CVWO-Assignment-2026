export interface CommentResponse {
  id: number;
  user_id: number;
  username: string;
  post_id: number;
  parent_comment_id?: number;
  body: string;
  created_at: string;
}

export interface CommentDeleteResponse {
  id: number;
}