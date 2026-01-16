package main

import (
	"context"
	"cvwo-backend/internal/handlers"
	"cvwo-backend/internal/middleware"
	"cvwo-backend/internal/models"
	"database/sql"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/joho/godotenv"
)

func main() {
	//env
	godotenv.Load()

	//db
	db_url := os.Getenv("DATABASE_URL")
	if db_url == "" {
		log.Fatal("DATABASE_URL not set")
	}
	db, dblErr := sql.Open("postgres", db_url)
	if dblErr != nil {
		log.Fatal(dblErr)
	}
	defer db.Close()

	dbConnectionErr := db.Ping()
	if dbConnectionErr != nil {
		log.Fatal(dbConnectionErr)
	}
	log.Println("db connected")
	
	//models
	userModel := &models.UserModel{DB: db}
	topicModel := &models.TopicModel{DB: db}
	postModel := &models.PostModel{DB: db}
	commentModel := &models.CommentModel{DB: db}
	
	//handlers
	userHandler := &handlers.UserHandler{UserModel: userModel}
	topicHandler := &handlers.TopicHandler{TopicModel: topicModel}
	postHandler := &handlers.PostHandler{PostModel: postModel}
	commentHandler := &handlers.CommentHandler{CommentModel: commentModel}

	//routes
	rootMux := http.NewServeMux()

	rootMux.HandleFunc("/users/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			userHandler.Get(w, r)
		}  else if r.Method == http.MethodPost {
			userHandler.Create(w, r)
		} else if r.Method == http.MethodPut {
			userHandler.Update(w, r)
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	rootMux.HandleFunc("/topics/", func(w http.ResponseWriter, r *http.Request) {
    if r.Method == http.MethodGet {
			topicHandler.Get(w, r)
    } else if r.Method == http.MethodPost {
			topicHandler.Create(w, r)
    } else if r.Method == http.MethodPut {
			topicHandler.Update(w, r)
    } else if r.Method == http.MethodDelete {
			topicHandler.Delete(w, r)
    } else {
			w.WriteHeader(http.StatusMethodNotAllowed)
    }
	})
	rootMux.HandleFunc("/posts/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			postHandler.Get(w, r)
		} else if r.Method == http.MethodPost {
			postHandler.Create(w, r)
		} else if r.Method == http.MethodPut {
			postHandler.Update(w, r)
		} else if r.Method == http.MethodDelete {
			postHandler.Delete(w, r)
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	rootMux.HandleFunc("/comments/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			commentHandler.Get(w, r)
		} else if r.Method == http.MethodPost {
			commentHandler.Create(w, r)
		} else if r.Method == http.MethodPut {
			commentHandler.Update(w, r)
		} else if r.Method == http.MethodDelete {
			commentHandler.Delete(w, r)
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	handlerWithCORS := middleware.Cors(rootMux)

	//server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	addr := ":" + port
	
	server := &http.Server{
		Addr: addr,
		Handler: handlerWithCORS,
	}
	log.Printf("server listening on port %s", port)

	//shutdown
	go func() {
		err := server.ListenAndServe()
		if err != nil && err != http.ErrServerClosed {
			log.Fatal(err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	<-stop
	log.Println("shutting down server")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		log.Fatal(err)
	}
	log.Println("server stopped")
}