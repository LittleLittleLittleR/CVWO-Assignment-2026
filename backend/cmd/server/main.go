package main

import (
	"cvwo-backend/internal/handlers"
	"cvwo-backend/internal/models"
	"cvwo-backend/internal/router"
	"context"
	"database/sql"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	//db
	db_url := os.Getenv("DATABASE_URL")
	if db_url == "" {
		log.Fatal("DATABASE_URL not set")
	}
	db, err := sql.Open("postgres", db_url)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal(err)
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
	userRouter := router.UserRouter(userHandler)
	topicRouter := router.TopicRouter(topicHandler)
	postRouter := router.PostRouter(postHandler)
	commentRouter := router.CommentRouter(commentHandler)

	rootMux := http.NewServeMux()
	rootMux.Handle("/users", userRouter.UserHandler())
	rootMux.Handle("/users/", userRouter.UserHandler())
	rootMux.Handle("/topics", topicRouter.TopicHandler())
	rootMux.Handle("/topics/", topicRouter.TopicHandler())
	rootMux.Handle("/posts", postRouter.PostHandler())
	rootMux.Handle("/posts/", postRouter.PostHandler())
	rootMux.Handle("/comments", commentRouter.CommentHandler())
	rootMux.Handle("/comments/", commentRouter.CommentHandler())

	//server
	port := os.Getenv("PORT")
	if port == "" {
		port = ":8080"
	}
	
	server := &http.Server{
		Addr:         port,
		Handler:      rootMux,
	}

	//shutdown
	go func() {
		log.Printf("server listening on %s", port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
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