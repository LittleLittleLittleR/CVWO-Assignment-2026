package models

import (
	"context"
	"database/sql"
	"time"
	"github.com/google/uuid"
	"errors"
	"fmt"
)

type Comment struct {
	ID         			string
	UserID					string
	PostID					string
	ParentCommentID *string
	Body						string
	CreatedAt     	time.Time
}

type CommentModel struct {
	DB *sql.DB
}

func (m *CommentModel) GetAll(ctx context.Context) ([]Comment, error) {
	const query = `
		SELECT id, user_id, post_id, parent_comment_id, body, created_at 
		FROM comments
	`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("get all comments: %w", err)
	}
	defer rows.Close()

	comments := []Comment{}

	for rows.Next() {
		var t Comment
		if err := rows.Scan(&t.ID, &t.UserID, &t.PostID, &t.ParentCommentID, &t.Body, &t.CreatedAt); err != nil {
			return nil, fmt.Errorf("get all comments: %w", err)
		}
		comments = append(comments, t)
	}

	return comments, nil
}

func (m *CommentModel) GetByID(ctx context.Context, id string) (*Comment, error) {
	_, err := uuid.Parse(id)
	if err != nil {
		return nil, ErrInvalidCommentID
	}

	const query = `
		SELECT id, user_id, post_id, parent_comment_id, body, created_at 
		FROM comments 
		WHERE id = $1
	`

	var c Comment
	err = m.DB.QueryRowContext(ctx, query, id).
		Scan(&c.ID, &c.UserID, &c.PostID, &c.ParentCommentID, &c.Body, &c.CreatedAt)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrCommentNotFound
		}
		return nil, fmt.Errorf("get comment by id: %w", err)
	}

	return &c, nil
}

func (m *CommentModel) GetByUserID(ctx context.Context, userID string) ([]Comment, error) {
	_, err := uuid.Parse(userID)
	if err != nil {
		return nil, ErrInvalidUserID
	}
	
	const query = `
		SELECT id, user_id, post_id, parent_comment_id, body, created_at 
		FROM comments 
		WHERE user_id = $1
	`

	rows, err := m.DB.QueryContext(ctx, query, userID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrCommentNotFound
		}
		return nil, fmt.Errorf("get comments by user id: %w", err)
	}
	defer rows.Close()

	comments := []Comment{}

	for rows.Next() {
		var c Comment
		if err := rows.Scan(&c.ID, &c.UserID, &c.PostID, &c.ParentCommentID, &c.Body, &c.CreatedAt); err != nil {
			return nil, fmt.Errorf("get comments by user id: %w", err)
		}
		comments = append(comments, c)
	}

	return comments, nil
}

func (m *CommentModel) GetByPostID(ctx context.Context, postID string) ([]Comment, error) {
	_, err := uuid.Parse(postID)
	if err != nil {
		return nil, ErrInvalidPostID
	}
	const query = `
		SELECT id, user_id, post_id, parent_comment_id, body, created_at 
		FROM comments 
		WHERE post_id = $1
	`

	rows, err := m.DB.QueryContext(ctx, query, postID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrCommentNotFound
		}
		return nil, fmt.Errorf("get comments by post id: %w", err)
	}
	defer rows.Close()

	comments := []Comment{}

	for rows.Next() {
		var c Comment
		if err := rows.Scan(&c.ID, &c.UserID, &c.PostID, &c.ParentCommentID, &c.Body, &c.CreatedAt); err != nil {
			return nil, fmt.Errorf("get comments by post id: %w", err)
		}
		comments = append(comments, c)
	}

	return comments, nil
}

func (m *CommentModel) Create(
	ctx context.Context, 
	userID, postID string, 
	parentCommentID *string, 
	body string) (*Comment, error) {
	const query = `
		INSERT INTO comments (id, user_id, post_id, parent_comment_id, body, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, user_id, post_id, parent_comment_id, body, created_at
	`
	id := uuid.New().String()
	createdAt := time.Now()

	var c Comment
	err := m.DB.QueryRowContext(ctx, query, id, userID, postID, parentCommentID, body, createdAt).
		Scan(&c.ID, &c.UserID, &c.PostID, &c.ParentCommentID, &c.Body, &c.CreatedAt)
	if err != nil {
		return nil, fmt.Errorf("create comment: %w", err)
	}
	return &c, nil
}

func (m *CommentModel) Update(ctx context.Context, id, body string) (*Comment, error) {
	_, err := uuid.Parse(id)
	if err != nil {
		return nil, ErrInvalidCommentID
	}

	const query = `
		UPDATE comments
		SET body = $1
		WHERE id = $2
		RETURNING id, user_id, post_id, parent_comment_id, body, created_at
	`
	var c Comment
	err = m.DB.QueryRowContext(ctx, query, body, id).
		Scan(&c.ID, &c.UserID, &c.PostID, &c.ParentCommentID, &c.Body, &c.CreatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrCommentNotFound
		}
		return nil, fmt.Errorf("update comment: %w", err)
	}
	return &c, nil
}

func (m *CommentModel) Delete(ctx context.Context, id string) error {
	if _, err := uuid.Parse(id); err != nil {
		return ErrInvalidCommentID
	}

	const query = `
		DELETE FROM comments
		WHERE id = $1
		RETURNING id
	`

	var deletedID string
	err := m.DB.QueryRowContext(ctx, query, id).Scan(&deletedID)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ErrCommentNotFound
		}
		return fmt.Errorf("delete comment: %w", err)
	}
	return nil
}
