package models

import "time"

type Project struct {
	ID 			string 		`gorm:"primaryKey;size:36" json:"id"`
	OwnerID 	uint 		`gorm:"not null;index" json:"-"`
	Name 		string 		`gorm:"size:100;not null" json:"name"`
	CreatedAt 	time.Time 	`json:"created_at"`
}