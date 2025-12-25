package types

import "time"

type CreateUserRequest struct {
	Username string `json:"username"`
}

type UserResponse struct {
	ID        string    `json:"id"`
	Username  string    `json:"username"`
	IsActive	bool      `json:"is_active"`
}