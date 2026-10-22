package services

import (

	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"

)

func GenerateProjectUserToken(userID uint, projectID string) (string, error) {

	secret := os.Getenv("JWT_SECRET")

	if len(secret) < 32 {
		return "", errors.New("JWT_SECRET must be at lease 32 characters")
	}

	claims := jwt.MapClaims{
		"sub": userID,
		"project_id": projectID,
		"token_type": "project_user",
		"exp": time.Now().Add(15*time.Minute).Unix(),
		"iat": time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(secret))

}