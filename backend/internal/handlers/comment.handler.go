package handlers

import (
	"cvwo-backend/internal/models"
	"cvwo-backend/internal/types"
	"encoding/json"
	"net/http"
	"strings"
)

type CommentHandler struct {
	CommentModel *models.CommentModel
}

func toCommentResponse(t []models.Comment) []types.CommentResponse {
	responseComments := make([]types.CommentResponse, len(t))
	for i, comment := range t {
		responseComments[i] = types.CommentResponse{
			ID: comment.ID,
			UserID: comment.UserID,
			Username: comment.Username,
			PostID: comment.PostID,
			ParentCommentID: comment.ParentCommentID,
			Body: comment.Body,
			CreatedAt: comment.CreatedAt,
		}
	}
	return responseComments
}

func (h *CommentHandler) Get(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	query := strings.TrimPrefix(r.URL.Path, "/comments/")
	var comments []models.Comment
	var err error

	if query == "" {
		comments, err = h.CommentModel.GetAll(ctx)
	} else if strings.HasPrefix(query, "id/") {
		id := strings.TrimPrefix(query, "id/")
		comments, err = h.CommentModel.GetByID(ctx, id)
	} else if strings.HasPrefix(query, "postid/") {
		postID := strings.TrimPrefix(query, "postid/")
		comments, err = h.CommentModel.GetByPostID(ctx, postID)
	} else if strings.HasPrefix(query, "userid/") {
		userID := strings.TrimPrefix(query, "userid/")
		comments, err = h.CommentModel.GetByUserID(ctx, userID)
	}

	if err != nil {
		writeError(err, w)
		return
	}

	responseComments := toCommentResponse(comments)
	writeJSON(w, http.StatusOK, responseComments)
}

func (h *CommentHandler) Create(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var req types.CreateCommentRequest
	decoder := json.NewDecoder(r.Body)
	requestErr := decoder.Decode(&req)
	if requestErr != nil {
		writeError(requestErr, w)
		return
	}

	comment, err := h.CommentModel.Create(ctx, req.UserID, req.PostID, req.ParentCommentID, req.Body)
	if err != nil {
		writeError(err, w)
		return
	}
	responseComment := toCommentResponse(comment)
	writeJSON(w, http.StatusCreated, responseComment)
}

func (h *CommentHandler) Update(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	
	query := strings.TrimPrefix(r.URL.Path, "/comments/")
	id := strings.TrimPrefix(query, "id/")
	if id == "" {
		writeError(models.ErrInvalidCommentID, w)
		return
	}

	var req types.UpdateCommentRequest
	decoder := json.NewDecoder(r.Body)
	requestErr := decoder.Decode(&req)
	if requestErr != nil {
		writeError(requestErr, w)
		return
	}

	comment, err := h.CommentModel.Update(ctx, id, req.Body)
	if err != nil {
		writeError(err, w)
		return
	}
	responseComment := toCommentResponse(comment)
	writeJSON(w, http.StatusOK, responseComment)
}

func (h *CommentHandler) Delete(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	query := strings.TrimPrefix(r.URL.Path, "/comments/")
	id := strings.TrimPrefix(query, "id/")
	if id == "" {
		writeError(models.ErrInvalidCommentID, w)
		return
	}

	err := h.CommentModel.Delete(ctx, id)
	if err != nil {
		writeError(err, w)
		return
	}

	writeJSON(w, http.StatusOK, nil)
}