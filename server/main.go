package main

import (
	// "os"
	"log"
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

	log.Fatal(r.Run(":8080"))

}