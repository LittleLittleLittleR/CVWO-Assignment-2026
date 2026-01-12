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

func toUserResponse(u []models.User) []types.UserResponse {
	responseUsers := make([]types.UserResponse, len(u))
	for i, user := range u {
		responseUsers[i] = types.UserResponse{
			ID: user.ID,
			Username: user.Username,
			IsActive: user.IsActive,
		}
	}
	return responseUsers
}

func (h *UserHandler) Get(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	query := strings.TrimPrefix(r.URL.Path, "/users/")
	var users []models.User
	var err error
	
	if query == "" {
		users, err = h.UserModel.GetAll(ctx)
	} else if strings.HasPrefix(query, "id/") {
		id := strings.TrimPrefix(query, "id/")
		users, err = h.UserModel.GetByID(ctx, id)
	} else if strings.HasPrefix(query, "username/") {
		username := strings.TrimPrefix(query, "username/")
		users, err = h.UserModel.GetByUsername(ctx, username)
	}
	
	if err != nil {
		writeError(err, w)
		return
	}

	responseUsers := toUserResponse(users)
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