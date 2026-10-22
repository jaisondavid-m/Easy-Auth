package main

import (
	// "os"
	"log"
	"os"
	"server/config"
	"server/routes"

	// "net/http"
	// "gorm.io/gorm"
	// "gorm.io/driver/mysql"
	// "github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	if err := godotenv.Load(); err != nil {
		log.Fatal("Failed to load .env")
	}

	config.ConnectDB()

	r := routes.SetupRoutes()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Fatal(r.Run(":8080"))

}