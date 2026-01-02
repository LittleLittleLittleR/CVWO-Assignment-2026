package router

import (
	"cvwo-backend/internal/handlers"
	"net/http"
)

type UserRouter struct {
	mux *http.ServeMux
}

func userRouter(
	userHandler *handlers.UserHandler, 
	) *UserRouter {
	mux := http.NewServeMux()

	mux.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			userHandler.GetAll(w, r)
		} else if r.Method == http.MethodPost {
			userHandler.Create(w, r)
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/users/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			userHandler.GetByID(w, r)
		}  else if r.Method == http.MethodPut {
			userHandler.Update(w, r)
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	return &UserRouter{
		mux: mux,
	}
}

func (r *UserRouter) UserHandler() http.Handler {
	return r.mux
}
