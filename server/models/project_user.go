package models

import "time"

type ProjectUser struct {
	ID uint `gorm:"primaryKey" json:"id"`
	ProjectID string `gorm:"size:36;not null;uniqueIndex:idx_project_email,priority:1" json:"-"`
	Name string `gorm:"size:100;not null" json:"name"`
	Email string `gorm:"size:255;not null;uniqueIndex:idx_project_email,priority:2" json:"email"`
	PasswordHash string `gorm:"size:255;not null" uniqueIndex:idx_project_email,priority:2" json:"email"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}