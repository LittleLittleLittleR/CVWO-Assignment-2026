package models

import (
	"context"
	"database/sql"
	"time"
	"github.com/google/uuid"
)

type Topic struct {
	ID               string
	UserID           string
	TopicName        string
	TopicDescription string
	CreatedAt        time.Time
}