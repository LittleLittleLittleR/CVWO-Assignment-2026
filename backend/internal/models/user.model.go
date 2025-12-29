package models

import (
	"context"
	"database/sql"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"errors"
	"fmt"
)

type User struct {
	ID string
	Username string
	IsActive bool
}

type UserModel struct {
	DB *sql.DB
}

func (m *UserModel) GetAll(ctx context.Context) ([]User, error) {
	const query = `
		SELECT id, username, is_active 
		FROM users
	`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("get all users: %w", err)
	}
	defer rows.Close()

	users := []User{}

	for rows.Next() {
		var u User
		err := rows.Scan(&u.ID, &u.Username, &u.IsActive)
		if err != nil {
			return nil, fmt.Errorf("get all users: %w", err)
		}
		users = append(users, u)
	}

	return users, nil
}

func (m *UserModel) GetByID(ctx context.Context, id string) (*User, error) {
	_, err := uuid.Parse(id)
	if err != nil {
		return nil, ErrInvalidUserID
	}

	const query = `
		SELECT id, username, is_active 
		FROM users 
		WHERE id = $1
	`

	var u User
	err = m.DB.QueryRowContext(ctx, query, id).
		Scan(&u.ID, &u.Username, &u.IsActive)

	if err != nil {
		// No rows found with the given id
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, fmt.Errorf("get user by id: %w", err)
	}

	return &u, nil
}

func (m *UserModel) GetByUsername(ctx context.Context, username string) (*User, error) {
	const query = `
		SELECT id, username, is_active 
		FROM users 
		WHERE username = $1
	`

	var u User
	err := m.DB.QueryRowContext(ctx, query, username).
		Scan(&u.ID, &u.Username, &u.IsActive)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
				return nil, ErrUserNotFound
		}
		return nil, fmt.Errorf("get user by username: %w", err)
	}

	return &u, nil
}

func (m *UserModel) Create(ctx context.Context, username string) (*User, error) {
	const query = `
		INSERT INTO users (id, username, is_active)
		VALUES ($1, $2, $3) 
		RETURNING id, username, is_active
	`

	id := uuid.New().String()
	isActive := true

	var u User
	err := m.DB.QueryRowContext(ctx, query, id, username, isActive).
		Scan(&u.ID, &u.Username, &u.IsActive)
	if err != nil {
		// Handle unique constraint violation for username
		var pgErr *pq.Error
    if errors.As(err, &pgErr) && 
		pgErr.Code == "23505" &&
		pgErr.Constraint == "users_username_key" {
        return nil, ErrUsernameExists
    }
		return nil, fmt.Errorf("create user: %w", err)
	}
	return &u, nil
}

func (m *UserModel) Update(ctx context.Context, id string, username string, isActive bool) (*User, error) {
	const query = `
		UPDATE users 
		SET username = $1, is_active = $2
		WHERE id = $3 
		RETURNING id, username, is_active
	`

	var u User
	err := m.DB.QueryRowContext(ctx, query, username, isActive, id).
		Scan(&u.ID, &u.Username, &u.IsActive)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		var pgErr *pq.Error
		if errors.As(err, &pgErr) && 
		pgErr.Code == "23505" &&
		pgErr.Constraint == "users_username_key" {
			return nil, ErrUsernameExists
		}
		return nil, fmt.Errorf("update user: %w", err)
	}
	return &u, nil
}