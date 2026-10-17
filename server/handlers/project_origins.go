package handlers

import (
	"net/http"
	"net/url"
	"strings"

	"server/config"
	"server/dto"
	"server/models"

	"github.com/gin-gonic/gin"
)

func normalizeOrigin(value string) (string, bool) {

	value = strings.TrimSpace(value)

	u, err := url.Parse(value)

	if err != nil || u.Host == "" {
		return "", false
	}

	if u.Scheme != "http" && u.Scheme != "https" {
		return "", false
	}

	if u.Path != "" && u.Path != "/" ||
		u.RawQuery != "" ||
		u.Fragment != "" ||
		u.User != nil {
			return "", false
		}

	if u.Hostname() == "" {
		return "", false
	}

	u.Host = strings.ToLower(u.Host)

	return strings.TrimRight(u.Scheme+"://"+u.Host, "/"), true
}

func UpdateProjectOrigins(c *gin.Context) {

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized",
		})
		return
	}

	projectID := c.Param("projectID")

	var project models.Project

	if err := config.DB.Where("id = ? AND owner_id = ?", projectID, userID).First(&project).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Project not found",
		})
		return
	}

	var req dto.UpdateOriginsRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid origins",
		})
		return
	}

	if len(req.Origins) == 0 || len(req.Origins) > 5 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Provide between 1 and 5 origins",
		})
		return
	}

	origins := make([]string, 0, len(req.Origins))
	seen := make(map[string]bool)

	for _, value := range req.Origins {
		origin, valid := normalizeOrigin(value)
		if !valid {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid origin: " + value,
			})
		}
		if !seen[origin] {
			origins = append(origins,origin)
			seen[origin] = true
		}
	}

	if err := config.DB.Model(&project).Update("allowed_origins", origins).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not update origins",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Allowed origins updated",
		"origins": origins,
	})

}