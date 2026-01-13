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
	CommentModel *models.CommentModel
}

func toPostResponse(t []models.Post) []types.PostResponse {
	responsePosts := make([]types.PostResponse, len(t))
	for i, post := range t {
		responsePosts[i] = types.PostResponse{
			ID: post.ID,
			UserID: post.UserID,
			TopicID: post.TopicID,
			Title: post.Title,
			Body: post.Body,
			CreatedAt: post.CreatedAt,
		}
	}
	return responsePosts
}

func (h *PostHandler) Get(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	query := strings.TrimPrefix(r.URL.Path, "/topics/")
	var posts []models.Post
	var err error

	if query == "" {
		posts, err = h.PostModel.GetAll(ctx)
	} else if strings.HasPrefix(query, "id/") {
		id := strings.TrimPrefix(query, "id/")
		posts, err = h.PostModel.GetByID(ctx, id)
	} else if strings.HasPrefix(query, "userid/") {
		userID := strings.TrimPrefix(query, "userid/")
		posts, err = h.PostModel.GetByUserID(ctx, userID)
	} else if strings.HasPrefix(query, "topicid/") {
		topicID := strings.TrimPrefix(query, "topicid/")
		posts, err = h.PostModel.GetByTopicID(ctx, topicID)
	}

	if err != nil {
		writeError(err, w)
		return
	}

	responsePosts := toPostResponse(posts)
	writeJSON(w, http.StatusOK, responsePosts)
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
	query := strings.TrimPrefix(r.URL.Path, "/posts/")
	id := strings.TrimPrefix(query, "id/")
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
	query := strings.TrimPrefix(r.URL.Path, "/posts/")
	id := strings.TrimPrefix(query, "id/")
	if id == "" {
		writeError(models.ErrInvalidPostID, w)
		return
	}

	postErr := h.PostModel.Delete(ctx, id)
	if postErr != nil {
		writeError(postErr, w)
		return
	}

	commentErr := h.CommentModel.DeleteByPostID(ctx, id)
	if commentErr != nil {
		writeError(commentErr, w)
		return
	}

	writeJSON(w, http.StatusOK, nil)
}
