
package handlers

import (
	"cvwo-backend/internal/models"
	"cvwo-backend/internal/types"
	"encoding/json"
	"net/http"
)

type CommentHandler struct {
	CommentModel *models.CommentModel
}

func toCommentResponse(t *models.Comment) types.CommentResponse {
	return types.CommentResponse{
		ID: t.ID,
		UserID: t.UserID,
		PostID: t.PostID,
		ParentCommentID: t.ParentCommentID,
		Body: t.Body,
		CreatedAt: t.CreatedAt,
	}
}

func (h *CommentHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	comments, err := h.CommentModel.GetAll(ctx)

	if err != nil {
		writeError(err, w)
		return
	}

	responseComments := make([]types.CommentResponse, len(comments))
	for i, c := range comments {
		responseComments[i] = toCommentResponse(&c)
	}
	writeJSON(w, http.StatusOK, responseComments)
}

func (h *CommentHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id := r.URL.Query().Get("id")
	comment, err := h.CommentModel.GetByID(ctx, id)
	
	if err != nil {
		writeError(err, w)
		return
	}

	responseComment := toCommentResponse(comment)
	writeJSON(w, http.StatusOK, responseComment)
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
	id := r.URL.Query().Get("id")

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