package types

type CreateUserRequest struct {
	Username string `json:"username"`
}

type UpdateUserRequest struct {
	Username string `json:"username"`
	IsActive bool `json:"is_active"`
}

type UserResponse struct {
	ID string `json:"id"`
	Username string `json:"username"`
	IsActive bool `json:"is_active"`
}