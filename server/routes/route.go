package routes

import (
	"net/http"
	"server/handlers"
	"server/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRoutes() *gin.Engine {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:5173",
		},
		AllowMethods: []string{
			http.MethodGet,
			http.MethodPost,
			http.MethodPut,
			http.MethodPatch,
			http.MethodDelete,
			http.MethodOptions,
		},
		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Accept",
			"Authorization",
		},
	}))
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
		auth.POST("/login",handlers.Login)

		protected := auth.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.GET("/profile", handlers.Profile)
		}
	}
	projects := r.Group("/api/v1/projects")
	projects.Use(middleware.AuthMiddleware())
	{
		projects.POST("",handlers.CreateProject)
	}
	return r
}