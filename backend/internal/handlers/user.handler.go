
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

func (h *UserHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	users, err := h.UserModel.GetAll(ctx)

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

func (h *UserHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id := strings.TrimPrefix(r.URL.Path, "/users/")
	if id == "" {
		writeError(models.ErrInvalidUserID, w)
		return
	}

	user, err := h.UserModel.GetByID(ctx, id)
	
	if err != nil {
		writeError(err, w)
		return
	}

	responseUser := toUserResponse(user)
	writeJSON(w, http.StatusOK, responseUser)
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