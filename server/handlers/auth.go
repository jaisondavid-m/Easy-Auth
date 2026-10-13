package handlers

import (
	"errors"
	"log"
	"net/http"
	"strings"

	"server/config"
	"server/dto"
	"server/models"
	"server/services"

	"github.com/gin-gonic/gin"
	// "google.golang.org/api/idtoken"
	"gorm.io/gorm"
)

func Register(c *gin.Context) {

	var req dto.RegisterRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":"Invalid registration details",
		})
		return
	}

	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	if req.Name == "" || req.Email == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":"Name and email are required",
		})
		return
	}

	var existing models.User

	err := config.DB.Where("email = ?", req.Email).First(&existing).Error

	if err == nil {
		c.JSON(http.StatusConflict, gin.H{
			"error":"Email already registered",
		})
		return
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		log.Printf("Data base error while checking email %q: %v",req.Email,err)
		c.JSON(http.StatusInternalServerError,gin.H{
			"error":"Database Error",
		})
		return
	}

	hash, err := services.HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":"Could not hash Password",
		})
		return 
	}

	user := models.User{
		Name: req.Name,
		Email: req.Email,
		PasswordHash: hash,
	}

	if err := config.DB.Create(&user).Error; err != nil {
		log.Println("Failed to create user: ",err)
		c.JSON(http.StatusConflict, gin.H{
			// "error":"Could not create account; email may already exists",
			"error":err.Error(),
		})
		return
	}

	token, err := services.GenerateToken(user.ID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":"Could not create token",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":"Registration successful",
		"token":token,
		"user": gin.H{
			"id": user.ID, 
			"name": user.Name,
			"email": user.Email,
		},
	})

}

func Login(c *gin.Context) {

	var req dto.LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":"Invalid login Details",
		})
		return
	}

	email := strings.ToLower(strings.TrimSpace(req.Email))

	var user models.User

	if err := config.DB.Where("email = ?", email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":"Invalid email or password",
		})
		return
	}

	if user.PasswordHash == "" ||
		!services.CheckPassword(user.PasswordHash, req.Password) {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error":"Invalid email or password",
			})
			return
	}

	token, err := services.GenerateToken(user.ID)

	if err != nil {
		log.Printf("Token generation failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":"Could not create token",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":"Login Successful",
		"token": token,
		"user": gin.H{
			"id": user.ID,
			"name": user.Name,
			"email": user.Email,
		},
	})

}