package router

import (
	"cvwo-backend/internal/handlers"
	"net/http"
)

type PostRouter struct {
	mux *http.ServeMux
}

func postRouter(
	postHandler *handlers.PostHandler, 
	) *PostRouter {
	mux := http.NewServeMux()

	mux.HandleFunc("/posts", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			postHandler.GetAll(w, r)
		} else if r.Method == http.MethodPost {
			postHandler.Create(w, r)
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/posts/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			postHandler.GetByID(w, r)
		}  else if r.Method == http.MethodPut {
			postHandler.Update(w, r)
		} else if r.Method == http.MethodDelete {
			postHandler.Delete(w, r)
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	return &PostRouter{
		mux: mux,
	}
}

func (r *PostRouter) PostHandler() http.Handler {
	return r.mux
}
