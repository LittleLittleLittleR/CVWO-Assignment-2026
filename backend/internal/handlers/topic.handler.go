
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
	PostModel *models.PostModel
	CommentModel *models.CommentModel
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

func (h *TopicHandler) Get(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	query := strings.TrimPrefix(r.URL.Path, "/topics/")
	var topics []models.Topic
	var topic *models.Topic
	var err error

	if query == "" {
		topics, err = h.TopicModel.GetAll(ctx)
	} else if strings.HasPrefix(query, "id/") {
		id := strings.TrimPrefix(query, "id/")
		topic, err = h.TopicModel.GetByID(ctx, id)
		if topic != nil {
			topics = []models.Topic{*topic}
		}
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

	responseTopics := make([]types.TopicResponse, len(topics))
	for i, t := range topics {
		responseTopics[i] = toTopicResponse(&t)
	}
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
	id := r.URL.Query().Get("id")

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
	
	id := strings.TrimPrefix(r.URL.Path, "/topics/")
	if id == "" {
		writeError(models.ErrInvalidTopicID, w)
		return
	}

	topicErr := h.TopicModel.Delete(ctx, id)
	if topicErr != nil {
		writeError(topicErr, w) // Only the creator can delete the topic
		return
	}

	postErr := h.PostModel.DeleteByTopicID(ctx, id)
	commentErr := h.CommentModel.DeleteByTopicID(ctx, id)
	if postErr != nil {
		writeError(postErr, w)
		return
	} else if commentErr != nil {
		writeError(commentErr, w)
		return
	}

	writeJSON(w, http.StatusOK, nil)
}