package services

import (

	"os"
	"errors"
	"strconv"

	"github.com/golang-jwt/jwt/v5"

)

func ValidateToken(tokenString string) (uint, error) {
	secret := os.Getenv("JWT_SECRET")
	if len(secret) < 32 {
		return 0, errors.New("invalid JWT secret configuration")
	}

	token, err := jwt.Parse(tokenString,
		func(token *jwt.Token) (interface{}, error) {
		if token.Method != jwt.SigningMethodHS256 {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(secret), nil
	}, jwt.WithValidMethods([]string{"HS256"}))

	if err != nil || token == nil || !token.Valid {
		return 0, errors.New("invalid or expired token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return 0, errors.New("invalid token claims")
	}

	var userID uint64

	switch sub := claims["sub"].(type) {
	case float64:
		if sub <= 0 || sub > float64(^uint(0)>>1) || sub != float64(uint64(sub)) {
			return 0, errors.New("Invalid user ID")
		}
		userID = uint64(sub)
	case string:
		id, err := strconv.ParseUint(sub, 10, 32)
		if err != nil || id == 0 {
			return 0, errors.New("invalid user ID")
		}
		userID = id
	default:
		return 0, errors.New("missing or invalid subject claim")
	}

	// sub, err := claims.GetSubject()
	// if err != nil || sub == "" {
		
	// }

	// id, err := strconv.ParseUint(sub, 10, 32)
	// if err != nil || id == 0 {
	// 	return 0, errors.New("invalid user ID")
	// }

	return uint(userID), nil
}