package services

import (
	"net/http"
	"net/url"
	"server/config"
	"server/models"
	"strings"

	"github.com/gin-gonic/gin"
)

func normalizeProjectOrigin(value string) (string, bool) {

	value = strings.TrimSpace(value)

	u, err := url.Parse(value)
	if err != nil || u.Host == "" {
		return "", false
	}

	if u.Scheme != "http" && u.Scheme != "https" {
		return "", false
	}

	if (u.Path != "" && u.Path != "/") ||
		u.RawQuery != "" || u.Fragment != "" ||
		u.User != nil {
			return "", false
		}

	if u.Hostname() == "" {
		return "", false
	}

	u.Host = strings.ToLower(u.Host)

	return u.Scheme + "://" + u.Host, true

}

func ValidateProjectOrigins(c *gin.Context) bool {

	projectID := c.Param("projectID")
	origin := c.GetHeader("Origin")

	if origin == "" {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "Missing Origin header",
		})
		return false
	}

	normalized, valid := normalizeProjectOrigin(origin)
	if !valid {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "Invalid origin",
		})
		return false
	}

	var project models.Project
	if err := config.DB.First(&project, "id = ?", projectID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Project not found",
		})
		return false
	}

	for _, allowed := range project.AllowedOrigins {
		saved, ok := normalizeProjectOrigin(allowed)
		if ok && saved == normalized {
			return true
		}
	}

	c.JSON(http.StatusForbidden, gin.H{
		"error": "This frontend origin is not allowed",
	})

	return false

}

