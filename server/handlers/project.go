package handlers

import (
	"net/http"
	"strings"

	"server/config"
	"server/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func CreateProject(c *gin.Context) {
	
	userID, exists := c.Get("userID")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":"Unauthorized",
		})
		return
	}

	var req struct {
		Name string `json:"name" binding:"required,min=2,max=100"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":"Valid project name is required",
		})
		return
	}

	req.Name = strings.TrimSpace(req.Name)
	if req.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":"Project name cannot be empty",
		})
		return
	}

	project := models.Project{
		ID: uuid.NewString(),
		OwnerID: userID.(uint),
		Name: req.Name,
	}

	if err := config.DB.Create(&project).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":"Could not create project",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Project created successfully",
		"project": gin.H{
			"id": project.ID,
			"name": project.Name,
		},
	})
}

func GetMyProjects(c *gin.Context) {

	userID, exists := c.Get("userID")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized",
		})
		return
	}

	var projects []models.Project

	if err := config.DB.Where("owner_id = ?",userID).Order("created_at DESC").Find(&projects).Error;

	err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not fetch projects",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"projects": projects,
	})
}