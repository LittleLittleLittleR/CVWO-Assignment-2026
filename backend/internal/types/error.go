package types

type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message,omitempty"`
}

var InternalServerError = ErrorResponse{
	Error:   "internal_server_error",
	Message: "An unexpected error occurred. Please try again later.",
}

var BadRequestError = ErrorResponse{
	Error:   "bad_request",
	Message: "The request could not be understood or was missing required parameters.",
}

var NotFoundError = ErrorResponse{
	Error:   "not_found",
	Message: "The requested resource could not be found.",
}