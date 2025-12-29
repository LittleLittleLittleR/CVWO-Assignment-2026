package handlers

import (
	"backend/internal/models"
	"backend/internal/types"
	"errors"
	"net/http"
)

func writeError(err error, w http.ResponseWriter) {
	if errors.Is(err, models.ErrInvalidUserID) || 
	errors.Is(err, models.ErrInvalidTopicID) ||
	errors.Is(err, models.ErrInvalidPostID) ||
	errors.Is(err, models.ErrInvalidCommentID) {
		writeJSON(w, http.StatusBadRequest, types.ErrorResponse{
			Error:   types.BadRequestError.Error,
			Message: types.BadRequestError.Message,
		})
	} else if errors.Is(err, models.ErrUserNotFound) ||
		errors.Is(err, models.ErrTopicNotFound) ||
		errors.Is(err, models.ErrPostNotFound) ||
		errors.Is(err, models.ErrCommentNotFound) {
		writeJSON(w, http.StatusNotFound, types.ErrorResponse{
			Error:   types.NotFoundError.Error,
			Message: types.NotFoundError.Message,
		})
	} else {
		writeJSON(w, http.StatusInternalServerError, types.ErrorResponse{
			Error:   types.InternalServerError.Error,
			Message: types.InternalServerError.Message,
		})
	}
}