package handlers

import (

	"errors"
	"net/http"

	"server/config"
	"server/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

)

func Profile(c *gin.Context) {

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":"Unauthorized",
		})
		return
	}

	var user models.User

	if err := config.DB.First(&user, userID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"error":"User not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":"Failed to fetch profile",
		})
		return 
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Profile fetched Successfully",
		"user": gin.H{
			"id": user.ID,
			"name": user.Name,
			"email": user.Email,
			"created_at": user.CreatedAt,
			"updated_at": user.UpdatedAt,
		},
	})

}