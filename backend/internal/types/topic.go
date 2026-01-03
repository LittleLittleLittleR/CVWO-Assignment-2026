package types

import "time"

type CreateTopicRequest struct {
	UserID string `json:"user_id"`
	TopicName string `json:"topic_name"`
	TopicDescription string `json:"topic_description,omitempty"`
}	

type UpdateTopicRequest struct {
	TopicName string `json:"topic_name"`
	TopicDescription string `json:"topic_description,omitempty"`
}

type TopicResponse struct {
	ID string `json:"id"`
	UserID string `json:"user_id"`
	TopicName string `json:"topic_name"`
	TopicDescription string `json:"topic_description"`
	CreatedAt time.Time `json:"created_at"`
}