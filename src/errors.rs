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

impl From<reqwest::Error> for ApiError {
    fn from(err: reqwest::Error) -> Self {
        ApiError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            String::from("Could not complete remote request"),
            err.to_string(),
        )
    }
}

impl From<rocksdb::Error> for ApiError {
    fn from(err: rocksdb::Error) -> Self {
        ApiError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            String::from("Database error"),
            err.to_string(),
        )
    }
}

impl From<shakmaty::fen::ParseFenError> for ApiError {
    fn from(err: shakmaty::fen::ParseFenError) -> Self {
        ApiError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            String::from("Could not parse FEN"),
            err.to_string(),
        )
    }
}
