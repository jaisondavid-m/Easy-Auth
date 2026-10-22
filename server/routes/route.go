package routes

import (
	"net/http"
	"server/config"
	"server/handlers"
	"server/middleware"
	"server/models"
	"strings"

	// "github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRoutes() *gin.Engine {
	r := gin.Default()
	r.Use(func(c *gin.Context) {
		origin := strings.TrimRight(
			strings.TrimSpace(c.GetHeader("Origin")),
			"/",
		)
		allowed := origin == "http://localhost:5173"

		if strings.HasPrefix(c.Request.URL.Path, "/api/v1/projects/") &&
			strings.Contains(c.Request.URL.Path, "/auth/") &&
			origin != "" {
				parts := strings.Split(c.Request.URL.Path, "/")
				if len(parts) >= 6 && parts[4] != "" {
					var project models.Project
					if err := config.DB.First(
						&project, "id = ?", parts[4],
					).Error; err == nil {
						for _, saved := range project.AllowedOrigins {
							if strings.TrimRight(
								strings.TrimSpace(saved), "/",
							) == origin {
								allowed = true
								break
							}
						}
					}
				}
			}
			if allowed {
				c.Header("Access-Control-Allow-Origin", origin)
				c.Header("Vary", "Origin")
				c.Header(
					"Access-Control-Allow-Methods",
					"GET, POST, PUT, PATCH, DELETE, OPTIONS",
				)
				c.Header(
					"Access-Control-Allow-Headers",
					"Origin, Content-Type, Accept, Authorization",
				)
			}

			if c.Request.Method == http.MethodOptions {
				if !allowed {
					c.AbortWithStatus(http.StatusForbidden)
					return
				}
				c.AbortWithStatus(http.StatusNoContent)
				return
			}
			c.Next()
	})
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
		projects.GET("", handlers.GetMyProjects)
		projects.PUT("/:projectID/origins", handlers.UpdateProjectOrigins)
		projects.GET("/:projectID/users", handlers.ListProjectUsers)
		projects.POST("/:projectID/users", handlers.CreateProjectUser)
		projects.PUT("/:projectID/users/:userID", handlers.UpdateProjectUser)
		projects.PATCH("/:projectID/users/:userID/password",handlers.UpdateProjectUserPassword)
		projects.DELETE("/:projectID/users/:userID",handlers.DeleteProjectUser)
	}
	projectAuth := r.Group("/api/v1/projects/:projectID/auth")
	{
		projectAuth.POST("/register", handlers.ProjectRegister)
		projectAuth.POST("/login", handlers.ProjectLogin)
	}
	return r
}