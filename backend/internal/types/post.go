package types

import "time"

type CreatePostRequest struct {
	UserID string `json:"user_id"`
	TopicID string `json:"topic_id"`
	Title string `json:"title"`
	Body string `json:"body"`
}

type UpdatePostRequest struct {
	Title string `json:"title"`
	Body string `json:"body"`
}


type PostResponse struct {
	ID string `json:"id"`
	UserID string `json:"user_id"`
	TopicID string `json:"topic_id"`
	Title string `json:"title"`
	Body string `json:"body"`
	CreatedAt time.Time `json:"created_at"`
}