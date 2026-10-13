package routes

import (
	// "net/http"
	"server/handlers"
	"github.com/gin-gonic/gin"
)

func SetupRoutes() *gin.Engine {
	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.JSON(200,gin.H{
			"message":"Server API is running",
		})
	})
	r.GET("/health",func(c *gin.Context) {
		c.JSON(200,gin.H{
			"status":"ok",
		})
	})
	auth := r.Group("/api/v1/auth")
	{
		auth.POST("/register", handlers.Register)
	}
	return r
}