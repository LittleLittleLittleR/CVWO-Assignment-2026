package models

import (
	"errors"
)

var (
	ErrInvalidUserID = errors.New("invalid user id")
	ErrUserNotFound  = errors.New("user not found")
	ErrUsernameExists = errors.New("username already exists")

	ErrInvalidTopicID = errors.New("invalid topic id")
	ErrTopicNotFound  = errors.New("topic not found")

	ErrInvalidPostID = errors.New("invalid post id")
	ErrPostNotFound  = errors.New("post not found")

	ErrInvalidCommentID = errors.New("invalid comment id")
	ErrCommentNotFound  = errors.New("comment not found")
)