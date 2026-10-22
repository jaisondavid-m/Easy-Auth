package config

import (
	"log"
	"os"
	"server/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL is not set")
	}
	db, err := gorm.Open(mysql.Open(dsn),&gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:",err)
	}
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("Failed to get SQL database: ",err)
	}
	if err := sqlDB.Ping(); err != nil {
		log.Fatal("Database ping failed: ",err)
	}
	if err := db.AutoMigrate(
		&models.User{},
		&models.Project{},
		&models.ProjectUser{},
	); err != nil {
		log.Fatal("Database migration failed: ",err)
	}
	DB = db
	log.Println("Database connected successfully")
}