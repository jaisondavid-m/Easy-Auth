package dto

type UpdateOriginsRequest struct {
	Origins []string `json:"origins" binding:"required"`
}