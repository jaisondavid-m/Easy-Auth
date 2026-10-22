package handlers

import (
	"log"
	"errors"
	"net/http"
	"net/mail"
	"strconv"
	"strings"

	"server/config"
	"server/models"
	"server/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func getOwnedProject(c *gin.Context) (*models.Project, bool) {

	value, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized",
		})
		return nil, false
	}

	ownerID, ok := value.(uint)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid user session",
		})
		return nil, false
	}

	projectID := strings.TrimSpace(c.Param("projectID"))
	if projectID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Project ID is required",
		})
		return nil, false
	}

	var project models.Project
	err := config.DB.Where(
		"id = ? AND owner_id = ?",
		projectID,
		ownerID,
	).First(&project).Error

	if errors.Is(err,gorm.ErrRecordNotFound) {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Project not found",
		})
		return nil, false
	}

	if err != nil {
		log.Printf("project ownership lookup failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not verify project",
		})
		return nil, false
	}

	return &project, true

}

func parseProjectUserID(c *gin.Context) (uint, bool) {
	id, err := strconv.ParseUint(c.Param("userID"), 10, 32)
	if err != nil || id == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid user ID",
		})
		return 0, false
	}
	return uint(id), true
}

func ListProjectUsers(c *gin.Context) {
	project, ok := getOwnedProject(c)
	if !ok {
		return
	}
	var users []models.ProjectUser
	err := config.DB.Model(&models.ProjectUser{}).
		Select("id","name","email","created_at","updated_at").
		Where("project_id = ?", project.ID).
		Order("created_at DESC").
		Find(&users).Error

	if err != nil {
		log.Printf("Project user list failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not fetch users",
		})
		return
	}

	if users == nil {
		users = []models.ProjectUser{}
	}
	c.JSON(http.StatusOK, gin.H{
		"users": users,
	})
}

func CreateProjectUser(c *gin.Context) {

	project, ok := getOwnedProject(c)

	if !ok {
		return
	}

	var req struct {
		Name 		string 		`json:"name" binding:"required,min=3,max=100"`
		Email 		string 		`json:"email" binding:"required,email,max=255"`
		Password 	string 		`json:"password" binding:"required,min=8,max=72"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Name, valid email and password (8-72 charcters) are required",
		})
		return
	}

	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	if len(req.Name) < 3 || len(req.Name) > 100 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Name must be 3-100 characters",
		})
		return
	}

	if len(req.Password) < 8 || len(req.Password) > 72 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Password must be 8-72 bytes",
		})
		return
	}

	if _, err := mail.ParseAddress(req.Email); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid email",
		})
		return
	}

	hash, err := services.HashPassword(req.Password)
	if err != nil {
		log.Printf("Project user password hasing failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not secure password",
		})
		return
	}

	user := models.ProjectUser{
		ProjectID: project.ID,
		Name: req.Name,
		Email: req.Email,
		PasswordHash: hash,
	}

	if err := config.DB.Create(&user).Error; err != nil {
		log.Printf("Project user creation failed: %v", err)
		if strings.Contains(strings.ToLower(err.Error()), "duplicate") {
			c.JSON(http.StatusConflict, gin.H{
				"error": "This email is already registered in the project",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not create user",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User created successfully",
		"user": gin.H{
			"id": user.ID,
			"name": user.Name,
			"email": user.Email,
			"created_at": user.CreatedAt,
			"updated_at": user.UpdatedAt,
		},
	})

}

func UpdateProjectUser(c *gin.Context) {
	project, ok := getOwnedProject(c)
	if !ok {
		return
	}
	userID, ok := parseProjectUserID(c)
	if !ok {
		return
	}

	var req struct {
		Name 	string 	`json:"name" binding:"required,min=3,max=100"`
		Email 	string 	`json:"email" binding:"required,email,max=255"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "A valid name and email are required",
		})
		return
	}

	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	if len(req.Name) < 3 || len(req.Name) > 100 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Name must be 3-100 characters",
		})
		return
	}

	if _, err := mail.ParseAddress(req.Email); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid email",
		})
		return
	}

	var user models.ProjectUser
	err := config.DB.Where("id = ? AND project_id = ?", userID, project.ID).First(&user).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusNotFound, gin.H{
			"error":"User not found",
		})
		return
	}
	if err != nil {
		log.Printf("Project user lookup failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":"Could not find user",
		})
		return
	}
	err = config.DB.Model(&user).Updates(map[string]interface{}{
		"name": req.Name,
		"email": req.Email,
	}).Error

	if err != nil {
		log.Printf("Project user updated faield: %v", err)
		if strings.Contains(strings.ToLower(err.Error()), "duplicate") {
			c.JSON(http.StatusConflict, gin.H{
				"error": "This email is already registered in the project",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not update user",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "User updated successfully",
		"user": gin.H{
			"id": user.ID,
			"name": req.Name,
			"email": req.Email,
			"created_at": user.CreatedAt,
			"updated_at": user.UpdatedAt,
		},
	})
}

func UpdateProjectUserPassword(c *gin.Context) {

	project, ok := getOwnedProject(c)

	if !ok{
		return
	}

	userID, ok := parseProjectUserID(c)
	if !ok {
		return
	}

	var req struct {
		Password string `json:"password" binding:"required,min=8,max=72"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Password must be 8-72 characters",
		})
		return
	}

	if len(req.Password) < 8 || len(req.Password) > 72 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Password must be 8-72 bytes",
		})
		return
	}

	var user models.ProjectUser

	err := config.DB.Where("id = ? AND project_id = ?", userID, project.ID).First(&user).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})
		return
	}

	if err != nil {
		log.Printf("Project user lookup failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not find user",
		})
		return 
	}

	hash, err := services.HashPassword(req.Password)

	if err != nil {
		log.Printf("Password hashing failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not secure password",
		})
		return
	}

	if err := config.DB.Model(&user).Update("password_hash", hash).Error; err != nil {
		log.Printf("Password update failed: %v",err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not update password",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":"Password updated successfully",
	})

}

func DeleteProjectUser(c *gin.Context) {
	project, ok := getOwnedProject(c)
	if !ok {
		return
	}
	userID, ok := parseProjectUserID(c)
	if !ok {
		return
	}
	result := config.DB.Where("id = ? AND project_id = ?", userID, project.ID).
		Delete(&models.ProjectUser{})

	if result.Error != nil {
		log.Printf("Project user deletion failed: %v", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not delete user",
		})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User deleted successfully",
	})

}