package handlers

import (
	"cvwo-backend/internal/models"
	"cvwo-backend/internal/types"
	"encoding/json"
	"net/http"
	"strings"
)

type UserHandler struct {
	UserModel *models.UserModel
}

func toUserResponse(u *models.User) types.UserResponse {
	return types.UserResponse{
		ID:       u.ID,
		Username: u.Username,
		IsActive: u.IsActive,
	}
}

func (h *UserHandler) Get(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	query := strings.TrimPrefix(r.URL.Path, "/users/")
	var users []models.User
	var user *models.User
	var err error
	
	if query == "" {
		users, err = h.UserModel.GetAll(ctx)
	} else if strings.HasPrefix(query, "id/") {
		id := strings.TrimPrefix(query, "id/")
		user, err = h.UserModel.GetByID(ctx, id)
		if user != nil {
			users = []models.User{*user}
		}
	} else if strings.HasPrefix(query, "username/") {
		username := strings.TrimPrefix(query, "username/")
		user, err = h.UserModel.GetByUsername(ctx, username)
		if user != nil {
			users = []models.User{*user}
		}
	}
	
	if err != nil {
		writeError(err, w)
		return
	}

	responseUsers := make([]types.UserResponse, len(users))
	for i, u := range users {
		responseUsers[i] = toUserResponse(&u)
	}
	writeJSON(w, http.StatusOK, responseUsers)
}

func (h *UserHandler) Create(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var req types.CreateUserRequest
	decoder := json.NewDecoder(r.Body)
	requestErr := decoder.Decode(&req)
	if requestErr != nil {
		writeError(requestErr, w)
		return
	}

	user, err := h.UserModel.Create(ctx, req.Username)
	if err != nil {
		writeError(err, w)
		return
	}
	responseUser := toUserResponse(user)
	writeJSON(w, http.StatusCreated, responseUser)
}

func (h *UserHandler) Update(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id := strings.TrimPrefix(r.URL.Path, "/users/")
	if id == "" {
		writeError(models.ErrInvalidUserID, w)
		return
	}

	var req types.UpdateUserRequest
	decoder := json.NewDecoder(r.Body)
	requestErr := decoder.Decode(&req)
	if requestErr != nil {
		writeError(requestErr, w)
		return
	}

	user, err := h.UserModel.Update(ctx, id, req.Username, req.IsActive)
	if err != nil {
		writeError(err, w)
		return
	}
	responseUser := toUserResponse(user)
	writeJSON(w, http.StatusOK, responseUser)
}