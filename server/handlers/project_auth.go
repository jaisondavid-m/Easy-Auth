package handlers

import (

	"log"
	"errors"
	"strings"
	"net/http"

	"server/dto"
	"server/config"
	"server/models"
	"server/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

)

func ProjectRegister(c *gin.Context) {

	var req dto.ProjectRegisterRequest

	if !services.ValidateProjectOrigins(c) {
		return
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid registration details",
		})
		return
	}

	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	if req.Name == "" || req.Email == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Name and email are required",
		})
		return
	}

	if !services.FindProject(c) {
		return
	}

	projectID := c.Param("projectID")

	var existing models.ProjectUser
	err := config.DB.Where(
		"project_id = ? AND email = ?",
		projectID, req.Email,
	).First(&existing).Error

	if err == nil {
		c.JSON(http.StatusConflict, gin.H{
			"error": "Email already registered ",
		})
		return
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		log.Printf("Project user lookup failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Database error",
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

	user := models.ProjectUser{
		ProjectID: projectID,
		Name: req.Name,
		Email: req.Email,
		PasswordHash: hash,
	}

	if err := config.DB.Create(&user).Error; err != nil {
		log.Printf("Project user creation failed: %v",err)
		c.JSON(http.StatusConflict, gin.H{
			"error": "Could not create account; check whether the email is already registered",
		})
		return
	}

	token, err := services.GenerateProjectUserToken(user.ID, projectID)
	if err != nil {
		log.Printf("Project token generation failed: %v",err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Account created, but token generation failed. Please login.",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":"Registration successful",
		"token": token,
		"user": gin.H{
			"id": user.ID,
			"name": user.Name,
			"email": user.Email,
		},
	})

}

func ProjectLogin(c *gin.Context) {

	var req dto.ProjectLoginRequest

	if !services.ValidateProjectOrigins(c) {
		return
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":"Invalid login details",
		})
		return
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	if !services.FindProject(c) {
		return
	}

	projectID := c.Param("projectID")

	var user models.ProjectUser
	err := config.DB.Where(
		"project_id = ? AND email = ?",
		projectID,
		req.Email,
	).First(&user).Error

	if err != nil || user.PasswordHash == "" ||
		!services.CheckPassword(user.PasswordHash, req.Password) {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid email or password",
			})
			return
		}

	token, err := services.GenerateProjectUserToken(user.ID,projectID)

	if err != nil {
		log.Printf("Project token generation failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not create token",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"token": token,
		"user": gin.H{
			"id": user.ID,
			"name": user.Name,
			"email": user.Email,
		},
	})


}