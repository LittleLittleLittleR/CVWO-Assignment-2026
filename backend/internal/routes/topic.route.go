package router

import (
	"cvwo-backend/internal/handlers"
	"net/http"
)

type TopicRouter struct {
	mux *http.ServeMux
}

func NewTopicRouter(
	topicHandler *handlers.TopicHandler, 
	) *TopicRouter {
	mux := http.NewServeMux()

	mux.HandleFunc("/topics", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			topicHandler.GetAll(w, r)
		} else if r.Method == http.MethodPost {
			topicHandler.Create(w, r)
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/topics/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			topicHandler.GetByID(w, r)
		}  else if r.Method == http.MethodPut {
			topicHandler.Update(w, r)
		} else if r.Method == http.MethodDelete {
			topicHandler.Delete(w, r)
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	return &TopicRouter{
		mux: mux,
	}
}

func (r *TopicRouter) Handler() http.Handler {
	return r.mux
}
