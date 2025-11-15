use actix_web::http::StatusCode;
use serde::Serialize;

#[derive(Serialize)]
pub struct ApiError {
    status_code: String,
    message: String,
    error: String,
}

impl ApiError {
    pub fn new(status_code: StatusCode, message: String, error: String) -> ApiError {
        ApiError {
            status_code: status_code.to_string(),
            message,
            error,
        }
    }
}
