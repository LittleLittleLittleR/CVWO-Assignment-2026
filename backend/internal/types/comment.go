package types

import "time"

type CreateCommentRequest struct {
	UserID string `json:"user_id"`
	PostID string `json:"post_id"`
	ParentCommentID *string `json:"parent_comment_id,omitempty"`
	Body string `json:"body"`
}

type UpdateCommentRequest struct {
	Body string `json:"body"`
}

type CommentResponse struct {
	ID string `json:"id"`
	UserID string `json:"user_id"`
	Username string `json:"username"`
	PostID string `json:"post_id"`
	ParentCommentID *string `json:"parent_comment_id,omitempty"`
	Body string `json:"body"`
	CreatedAt time.Time `json:"created_at"`
}