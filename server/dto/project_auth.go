package dto

type ProjectRegisterRequest struct {
	Name 		string 		`json:"name" binding:"required,min=3,max=100"`
	Email 		string 		`json:"email" binding:"required,email,max=255"`
	Password 	string 		`json:"password" binding:"required,min=8,max=72"`
}

type ProjectLoginRequest struct {
	Email 		string 		`json:"email" binding:"required,email,max=255"`
	Password 	string 		`json:"password" binding:"required,min=8,max=72"`
}