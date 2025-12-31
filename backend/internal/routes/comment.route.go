package router

import (
	"backend/internal/handlers"
	"net/http"
)

type CommentRouter struct {
	mux *http.ServeMux
}

func commentRouter(
	commentHandler *handlers.CommentHandler, 
	) *CommentRouter {
	mux := http.NewServeMux()

	mux.HandleFunc("/comments", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			commentHandler.GetAll(w, r)
		} else if r.Method == http.MethodPost {
			commentHandler.Create(w, r)
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/comments/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			commentHandler.GetByID(w, r)
		}  else if r.Method == http.MethodPut {
			commentHandler.Update(w, r)
		} else if r.Method == http.MethodDelete {
			commentHandler.Delete(w, r)
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	return &CommentRouter{
		mux: mux,
	}
}

func (r *CommentRouter) CommentHandler() http.Handler {
	return r.mux
}
