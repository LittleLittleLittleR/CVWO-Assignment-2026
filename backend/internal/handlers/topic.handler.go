
package handlers

import (
	"backend/internal/models"
	"backend/internal/types"
	"encoding/json"
	"net/http"
)

type TopicHandler struct {
	TopicModel *models.TopicModel
}

func toTopicResponse(t *models.Topic) types.TopicResponse {
	return types.TopicResponse{
		ID: t.ID,
		UserID: t.UserID,
		TopicName: t.TopicName,
		TopicDescription: t.TopicDescription,
		CreatedAt: t.CreatedAt,
	}
}

func (h *TopicHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	topics, err := h.TopicModel.GetAll(ctx)

	if err != nil {
		writeError(err, w)
		return
	}

	responseTopics := make([]types.TopicResponse, len(topics))
	for i, t := range topics {
		responseTopics[i] = toTopicResponse(&t)
	}
	writeJSON(w, http.StatusOK, responseTopics)
}

func (h *TopicHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id := r.URL.Query().Get("id")
	topic, err := h.TopicModel.GetByID(ctx, id)
	
	if err != nil {
		writeError(err, w)
		return
	}

	responseTopic := toTopicResponse(topic)
	writeJSON(w, http.StatusOK, responseTopic)
}

func (h *TopicHandler) Create(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var req types.CreateUserRequest
	decoder := json.NewDecoder(r.Body)
	requestErr := decoder.Decode(&req)
	if requestErr != nil {
		writeError(requestErr, w)
		return
	}

	topic, err := h.TopicModel.Create(ctx, req.UserID, req.TopicName, req.TopicDescription)
	if err != nil {
		writeError(err, w)
		return
	}
	responseTopic := toTopicResponse(topic)
	writeJSON(w, http.StatusCreated, responseTopic)
}

func (h *TopicHandler) Update(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id := r.URL.Query().Get("id")

	var req types.UpdateUserRequest
	decoder := json.NewDecoder(r.Body)
	requestErr := decoder.Decode(&req)
	if requestErr != nil {
		writeError(requestErr, w)
		return
	}

	topic, err := h.TopicModel.Update(ctx, id, req.TopicName, req.TopicDescription)
	if err != nil {
		writeError(err, w)
		return
	}
	responseTopic := toTopicResponse(topic)
	writeJSON(w, http.StatusOK, responseTopic)
}