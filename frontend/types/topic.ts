
export interface TopicResponse {
  id: number;
  user_id: number;
  topic_name: string;
  topic_description: string;
  created_at: string;
}

export interface TopicDeleteResponse {
  id: number;
}