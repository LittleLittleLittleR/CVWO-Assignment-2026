package models

import (
	"context"
	"database/sql"
	"time"
	"github.com/google/uuid"
	"errors"
	"fmt"
)

type Post struct {
	ID string
	UserID string
	TopicID string
	Title string
	Body string
	CreatedAt time.Time
}

type PostModel struct {
	DB *sql.DB
}

func (m *PostModel) GetAll(ctx context.Context) ([]Post, error) {
	const query = `
		SELECT id, user_id, topic_id, title, body, created_at 
		FROM posts
	`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("get all posts: %w", err)
	}
	defer rows.Close()

	posts := []Post{}

	for rows.Next() {
		var t Post
		if err := rows.Scan(&t.ID, &t.UserID, &t.TopicID, &t.Title, &t.Body, &t.CreatedAt); err != nil {
			return nil, fmt.Errorf("get all posts: %w", err)
		}
		posts = append(posts, t)
	}

	return posts, nil
}

func (m *PostModel) GetByID(ctx context.Context, id string) (*Post, error) {
	_, err := uuid.Parse(id)
	if err != nil {
		return nil, ErrInvalidPostID
	}

	const query = `
		SELECT id, user_id, topic_id, title, body, created_at 
		FROM posts 
		WHERE id = $1
	`

	var p Post
	err = m.DB.QueryRowContext(ctx, query, id).
		Scan(&p.ID, &p.UserID, &p.TopicID, &p.Title, &p.Body, &p.CreatedAt)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrPostNotFound
		}
		return nil, fmt.Errorf("get post by id: %w", err)
	}

	return &p, nil
}

func (m *PostModel) GetByUserID(ctx context.Context, userID string) ([]Post, error) {
	_, err := uuid.Parse(userID)
	if err != nil {
		return nil, ErrInvalidUserID
	}

	const query = `
		SELECT id, user_id, topic_id, title, body, created_at 
		FROM posts 
		WHERE user_id = $1
	`

	rows, err := m.DB.QueryContext(ctx, query, userID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrPostNotFound
		}
		return nil, fmt.Errorf("get post by user id: %w", err)
	}
	defer rows.Close()

	posts := []Post{}

	for rows.Next() {
		var p Post
		if err := rows.Scan(&p.ID, &p.UserID, &p.TopicID, &p.Title, &p.Body, &p.CreatedAt); err != nil {
			return nil, fmt.Errorf("get post by user id: %w", err)
		}
		posts = append(posts, p)
	}

	return posts, nil
}

func (m *PostModel) GetByTopicID(ctx context.Context, topicID string) ([]Post, error) {
	_, err := uuid.Parse(topicID)
	if err != nil {
		return nil, ErrInvalidTopicID
	}

	const query = `
		SELECT id, user_id, topic_id, title, body, created_at 
		FROM posts 
		WHERE topic_id = $1
	`

	rows, err := m.DB.QueryContext(ctx, query, topicID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrTopicNotFound
		}
		return nil, fmt.Errorf("get post by topic id: %w", err)
	}
	defer rows.Close()

	posts := []Post{}

	for rows.Next() {
		var p Post
		if err := rows.Scan(&p.ID, &p.UserID, &p.TopicID, &p.Title, &p.Body, &p.CreatedAt); err != nil {
			return nil, fmt.Errorf("get post by topic id: %w", err)
		}
		posts = append(posts, p)
	}

	return posts, nil
}

func (m *PostModel) Create(ctx context.Context, userID, topicID, title, body string) (*Post, error) {
	const query = `
		INSERT INTO posts (id, user_id, topic_id, title, body, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, user_id, topic_id, title, body, created_at
	`
	id := uuid.New().String()
	createdAt := time.Now()

	var p Post
	err := m.DB.QueryRowContext(ctx, query, id, userID, topicID, title, body, createdAt).
		Scan(&p.ID, &p.UserID, &p.TopicID, &p.Title, &p.Body, &p.CreatedAt)
	if err != nil {
		return nil, fmt.Errorf("create post: %w", err)
	}
	return &p, nil
}

func (m *PostModel) Update(ctx context.Context, id, title, body string) (*Post, error) {
	_, err := uuid.Parse(id)
	if err != nil {
		return nil, ErrInvalidPostID
	}

	const query = `
		UPDATE posts
		SET title = $1, body = $2
		WHERE id = $3
		RETURNING id, user_id, topic_id, title, body, created_at
	`
	var p Post
	err = m.DB.QueryRowContext(ctx, query, title, body, id).
		Scan(&p.ID, &p.UserID, &p.TopicID, &p.Title, &p.Body, &p.CreatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrPostNotFound
		}
		return nil, fmt.Errorf("update post: %w", err)
	}
	return &p, nil
}

func (m *PostModel) Delete(ctx context.Context, id string) error {
	if _, err := uuid.Parse(id); err != nil {
		return ErrInvalidPostID
	}

	const query = `
		DELETE FROM posts
		WHERE id = $1
		RETURNING id
	`

	var deletedID string
	err := m.DB.QueryRowContext(ctx, query, id).Scan(&deletedID)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ErrPostNotFound
		}
		return fmt.Errorf("delete post: %w", err)
	}
	return nil
}
