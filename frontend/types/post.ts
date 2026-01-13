
export interface PostResponse {
  id: number;
  user_id: number;
  topic_id: number;
  title: string;
  body: string;
  created_at: string;
}

export interface PostDeleteResponse {
  id: number;
}