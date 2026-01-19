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
	ID string
	UserID string
	Username string
	TopicName string
	TopicDescription string
	CreatedAt time.Time
}

type TopicModel struct {
	DB *sql.DB
}

func (m *TopicModel) GetAll(ctx context.Context) ([]Topic, error) {
	const query = `
		SELECT topics.id, topics.user_id, users.username, topics.topic_name, topics.topic_description, topics.created_at 
		FROM topics JOIN users ON topics.user_id = users.id
	`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("get all topics: %w", err)
	}
	defer rows.Close()

	topics := []Topic{}

	for rows.Next() {
		var t Topic
		if err := rows.Scan(&t.ID, &t.UserID, &t.Username, &t.TopicName, &t.TopicDescription, &t.CreatedAt); err != nil {
			return nil, fmt.Errorf("get all topics: %w", err)
		}
		topics = append(topics, t)
	}

	return topics, nil
}

func (m *TopicModel) GetByID(ctx context.Context, id string) ([]Topic, error) {
	_, err := uuid.Parse(id)
	if err != nil {
		return nil, ErrInvalidTopicID
	}

	const query = `
		SELECT topics.id, topics.user_id, users.username, 
		topics.topic_name, topics.topic_description, topics.created_at 
		FROM topics JOIN users ON topics.user_id = users.id
		WHERE topics.id = $1
	`

	var t Topic
	err = m.DB.QueryRowContext(ctx, query, id).
		Scan(&t.ID, &t.UserID, &t.Username, &t.TopicName, &t.TopicDescription, &t.CreatedAt)

	if err != nil {
		// No rows found with the given id
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrTopicNotFound
		}
		return nil, fmt.Errorf("get topic by id: %w", err)
	}

	return []Topic{t}, nil
}

func (m *TopicModel) GetByUserID(ctx context.Context, userID string) ([]Topic, error) {
	_, err := uuid.Parse(userID)
	if err != nil {
		return nil, ErrInvalidUserID
	}

	const query = `
		SELECT topics.id, topics.user_id, users.username, 
		topics.topic_name, topics.topic_description, topics.created_at 
		FROM topics JOIN users ON topics.user_id = users.id
		WHERE topics.user_id = $1
	`

	rows, err := m.DB.QueryContext(ctx, query, userID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrTopicNotFound
		}
		return nil, fmt.Errorf("get topics by user id: %w", err)
	}
	defer rows.Close()

	topics := []Topic{}

	for rows.Next() {
		var t Topic
		if err := rows.Scan(&t.ID, &t.UserID, &t.Username, &t.TopicName, &t.TopicDescription, &t.CreatedAt); err != nil {
			return nil, fmt.Errorf("get topics by user id: %w", err)
		}
		topics = append(topics, t)
	}

	return topics, nil
}

func (m *TopicModel) GetByTopicName(ctx context.Context, topicName string) ([]Topic, error) {
	const query = `
		SELECT topics.id, topics.user_id, users.username, 
		topics.topic_name, topics.topic_description, topics.created_at 
		FROM topics JOIN users ON topics.user_id = users.id
		WHERE topics.topic_name = $1
	`

	rows, err := m.DB.QueryContext(ctx, query, topicName)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrTopicNotFound
		}
		return nil, fmt.Errorf("get topics by topic name: %w", err)
	}
	defer rows.Close()

	topics := []Topic{}

	for rows.Next() {
		var t Topic
		if err := rows.Scan(&t.ID, &t.UserID, &t.Username, &t.TopicName, &t.TopicDescription, &t.CreatedAt); err != nil {
			return nil, fmt.Errorf("get topics by topic name: %w", err)
		}
		topics = append(topics, t)
	}

	return topics, nil
}

func (m *TopicModel) Create(ctx context.Context, userID string, topicName string, topicDescription string) ([]Topic, error) {
	const query = `
		INSERT INTO topics (id, user_id, topic_name, topic_description, created_at)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, user_id, topic_name, topic_description, created_at
	`

	id := uuid.New().String()
	createdAt := time.Now()

	var t Topic
	err := m.DB.QueryRowContext(ctx, query, id, userID, topicName, topicDescription, createdAt).
		Scan(&t.ID, &t.UserID, &t.TopicName, &t.TopicDescription, &t.CreatedAt)
	if err != nil {
		return nil, fmt.Errorf("create topic: %w", err)
	}
	return []Topic{t}, nil
}

func (m *TopicModel) Update(ctx context.Context, id string, topicName string, topicDescription string) ([]Topic, error) {
	_, err := uuid.Parse(id)
	if err != nil {
		return nil, ErrInvalidTopicID
	}

	const query = `
		UPDATE topics
		SET topic_name = $1, topic_description = $2
		WHERE id = $3
		RETURNING id, user_id, topic_name, topic_description, created_at
	`
	var t Topic
	err = m.DB.QueryRowContext(ctx, query, topicName, topicDescription, id).
		Scan(&t.ID, &t.UserID, &t.TopicName, &t.TopicDescription, &t.CreatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrTopicNotFound
		}
		return nil, fmt.Errorf("update topic: %w", err)
	}
	return []Topic{t}, nil
}

func (m *TopicModel) Delete(ctx context.Context, id string) error {
	_, err := uuid.Parse(id)
	if err != nil {
		return ErrInvalidTopicID
	}

	const query = `
		DELETE FROM topics
		WHERE id = $1
		RETURNING id
	`

	var deletedID string
	err = m.DB.QueryRowContext(ctx, query, id).Scan(&deletedID)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ErrTopicNotFound
		}
		return fmt.Errorf("delete topic: %w", err)
	}
	return nil
}