package services

import (
	"errors"
	"log"
	"net/http"

	"server/config"
	"server/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func FindProject(c *gin.Context) bool {

	projectID := c.Param("projectID")
	
	var project models.Project

	err := config.DB.First(&project, "id = ?", projectID).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusNotFound, gin.H{
			"error":"Project not found",
		})
		return false
	}

	if err != nil {
		log.Printf("Project lookup failed: %v",err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not verify project",
		})
		return false
	}

	return true
}