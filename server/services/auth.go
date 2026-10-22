package services

import (
	"os"
	"errors"
	"time"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string,error){
	hash, err := bcrypt.GenerateFromPassword(
		[]byte(password),bcrypt.DefaultCost,
	)
	return string(hash),err
}

func CheckPassword(hash,password string) bool {
	return bcrypt.CompareHashAndPassword(
		[]byte(hash), []byte(password),
	) == nil
}

func GenerateToken(userID uint) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if len(secret) < 32 {
		return "", errors.New("JWT_SECRET must be at least 32 characters")
	}
	claims := jwt.MapClaims{
		"sub": userID,
		"exp": time.Now().Add(24 * time.Hour).Unix(),
		"iat": time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}