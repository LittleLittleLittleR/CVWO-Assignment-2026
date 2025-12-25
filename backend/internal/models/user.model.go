package models

import (
	"context"
	"database/sql"
	"time"
	"github.com/google/uuid"
)

type User struct {
	ID       string
	Username string
	IsActive bool
}