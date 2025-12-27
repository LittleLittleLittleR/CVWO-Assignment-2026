package models

import (
	"context"
	"database/sql"
	"time"
	"github.com/google/uuid"
	"errors"
	"fmt"
)

type Topic struct {
	ID               string
	UserID           string
	TopicName        string
	TopicDescription string
	CreatedAt        time.Time
}

type TopicModel struct {
	DB *sql.DB
}

func (m *TopicModel) GetAll(ctx context.Context) ([]Topic, error) {
	const query = `
		SELECT id, user_id, topic_name, topic_description, created_at 
		FROM topics
	`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	topics := []Topic{}

	for rows.Next() {
		var t Topic
		if err := rows.Scan(&t.ID, &t.UserID, &t.TopicName, &t.TopicDescription, &t.CreatedAt); err != nil {
			return nil, err
		}
		topics = append(topics, t)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return topics, nil
}

func (m *TopicModel) GetByID(ctx context.Context, id string) (*Topic, error) {
	_, err := uuid.Parse(id)
	if err != nil {
		return nil, fmt.Errorf("invalid topic id")
	}

	const query = `
		SELECT id, user_id, topic_name, topic_description, created_at 
		FROM topics 
		WHERE id = $1
	`

	var t Topic
	err = m.DB.QueryRowContext(ctx, query, id).
		Scan(&t.ID, &t.UserID, &t.TopicName, &t.TopicDescription, &t.CreatedAt)

	if err != nil {
		// No rows found with the given id
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &t, nil
}

func (m *TopicModel) GetByUserID(ctx context.Context, userID string) ([]Topic, error) {
	_, err := uuid.Parse(userID)
	if err != nil {
		return nil, fmt.Errorf("invalid user id")
	}

	const query = `
		SELECT id, user_id, topic_name, topic_description, created_at 
		FROM topics 
		WHERE user_id = $1
	`

	rows, err := m.DB.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	topics := []Topic{}

	for rows.Next() {
		var t Topic
		if err := rows.Scan(&t.ID, &t.UserID, &t.TopicName, &t.TopicDescription, &t.CreatedAt); err != nil {
			return nil, err
		}
		topics = append(topics, t)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return topics, nil
}

func (m *TopicModel) Create(ctx context.Context, userID, topicName, topicDescription string) (*Topic, error) {
	const query = `
		INSERT INTO topic (id, user_id, topic_name, topic_description, created_at)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, user_id, topic_name, topic_description, created_at
	`

	id := uuid.New().String()
	createdAt := time.Now()

	var t Topic
	err := m.DB.QueryRowContext(ctx, query, id, userID, topicName, topicDescription, createdAt).
		Scan(&t.ID, &t.UserID, &t.TopicName, &t.TopicDescription, &t.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &t, nil
}