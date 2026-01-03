
package handlers

import (
	"cvwo-backend/internal/models"
	"cvwo-backend/internal/types"
	"encoding/json"
	"net/http"
	"strings"
)

type PostHandler struct {
	PostModel *models.PostModel
}

func toPostResponse(t *models.Post) types.PostResponse {
	return types.PostResponse{
		ID: t.ID,
		UserID: t.UserID,
		TopicID: t.TopicID,
		Title: t.Title,
		Body: t.Body,
		CreatedAt: t.CreatedAt,
	}
}

func (h *PostHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	posts, err := h.PostModel.GetAll(ctx)

	if err != nil {
		writeError(err, w)
		return
	}

	responsePosts := make([]types.PostResponse, len(posts))
	for i, p := range posts {
		responsePosts[i] = toPostResponse(&p)
	}
	writeJSON(w, http.StatusOK, responsePosts)
}

func (h *PostHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	id := strings.TrimPrefix(r.URL.Path, "/posts/")
	if id == "" {
		writeError(models.ErrInvalidPostID, w)
		return
	}
	
	post, err := h.PostModel.GetByID(ctx, id)
	
	if err != nil {
		writeError(err, w)
		return
	}

	responsePost := toPostResponse(post)
	writeJSON(w, http.StatusOK, responsePost)
}

func (h *PostHandler) Create(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var req types.CreatePostRequest
	decoder := json.NewDecoder(r.Body)
	requestErr := decoder.Decode(&req)
	if requestErr != nil {
		writeError(requestErr, w)
		return
	}

	post, err := h.PostModel.Create(ctx, req.UserID, req.TopicID, req.Title, req.Body)
	if err != nil {
		writeError(err, w)
		return
	}
	responsePost := toPostResponse(post)
	writeJSON(w, http.StatusCreated, responsePost)
}

func (h *PostHandler) Update(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	
	id := strings.TrimPrefix(r.URL.Path, "/posts/")
	if id == "" {
		writeError(models.ErrInvalidPostID, w)
		return
	}

	var req types.UpdatePostRequest
	decoder := json.NewDecoder(r.Body)
	requestErr := decoder.Decode(&req)
	if requestErr != nil {
		writeError(requestErr, w)
		return
	}

	post, err := h.PostModel.Update(ctx, id, req.Title, req.Body)
	if err != nil {
		writeError(err, w)
		return
	}
	responsePost := toPostResponse(post)
	writeJSON(w, http.StatusOK, responsePost)
}

func (h *PostHandler) Delete(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	
	id := strings.TrimPrefix(r.URL.Path, "/posts/")
	if id == "" {
		writeError(models.ErrInvalidPostID, w)
		return
	}

	err := h.PostModel.Delete(ctx, id)
	if err != nil {
		writeError(err, w)
		return
	}

	writeJSON(w, http.StatusOK, nil)
}