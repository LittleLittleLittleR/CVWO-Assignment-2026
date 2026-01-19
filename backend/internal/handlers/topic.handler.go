
package handlers

import (
	"cvwo-backend/internal/models"
	"cvwo-backend/internal/types"
	"encoding/json"
	"net/http"
	"strings"
)

type TopicHandler struct {
	TopicModel *models.TopicModel
}

func toTopicResponse(t []models.Topic) []types.TopicResponse {
	responseTopics := make([]types.TopicResponse, len(t))
	for i, topic := range t {
		responseTopics[i] = types.TopicResponse{
			ID: topic.ID,
			UserID: topic.UserID,
			Username: topic.Username,
			TopicName: topic.TopicName,
			TopicDescription: topic.TopicDescription,
			CreatedAt: topic.CreatedAt,
		}
	}
	return responseTopics
}

func (h *TopicHandler) Get(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	query := strings.TrimPrefix(r.URL.Path, "/topics/")
	var topics []models.Topic
	var err error

	if query == "" {
		topics, err = h.TopicModel.GetAll(ctx)
	} else if strings.HasPrefix(query, "id/") {
		id := strings.TrimPrefix(query, "id/")
		topics, err = h.TopicModel.GetByID(ctx, id)
	} else if strings.HasPrefix(query, "userid/") {
		userID := strings.TrimPrefix(query, "userid/")
		topics, err = h.TopicModel.GetByUserID(ctx, userID)
	} else if strings.HasPrefix(query, "topicname/") {
		topicName := strings.TrimPrefix(query, "topicname/")
		topics, err = h.TopicModel.GetByTopicName(ctx, topicName)
	}

	if err != nil {
		writeError(err, w)
		return
	}

	responseTopics := toTopicResponse(topics)
	writeJSON(w, http.StatusOK, responseTopics)
}

func (h *TopicHandler) Create(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var req types.CreateTopicRequest
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
	query := strings.TrimPrefix(r.URL.Path, "/topics/")
	id := strings.TrimPrefix(query, "id/")

	var req types.UpdateTopicRequest
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

func (h *TopicHandler) Delete(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	query := strings.TrimPrefix(r.URL.Path, "/topics/")
	id := strings.TrimPrefix(query, "id/")
	if id == "" {
		writeError(models.ErrInvalidTopicID, w)
		return
	}

	topicErr := h.TopicModel.Delete(ctx, id)
	if topicErr != nil {
		writeError(topicErr, w) // Only the creator can delete the topic
		return
	}
	writeJSON(w, http.StatusOK, nil)
}