use std::str;

use actix_web::{
    HttpResponse, ResponseError,
    http::{StatusCode, header},
    mime, web,
};
use derive_more::derive::Display;
use serde::Serialize;
use shakmaty::Chess;

#[derive(Serialize, Display, Debug)]
#[display("{message}")]
pub struct ApiError {
    status_code: u16,
    message: String,
    error: String,
}

impl ApiError {
    pub fn new(status_code: StatusCode, message: &str, error: String) -> ApiError {
        ApiError {
            status_code: status_code.as_u16(),
            message: message.into(),
            error,
        }
    }

    pub fn msg(status_code: StatusCode, message: &str) -> ApiError {
        ApiError {
            status_code: status_code.as_u16(),
            message: message.into(),
            error: "ApiError".into(),
        }
    }
}

impl ResponseError for ApiError {
    fn status_code(&self) -> StatusCode {
        StatusCode::from_u16(self.status_code).unwrap_or(StatusCode::INTERNAL_SERVER_ERROR)
    }

    fn error_response(&self) -> actix_web::HttpResponse<actix_web::body::BoxBody> {
        HttpResponse::build(self.status_code())
            .insert_header(header::ContentType(mime::APPLICATION_JSON))
            .json(web::Json(self))
    }
}

impl From<reqwest::Error> for ApiError {
    fn from(err: reqwest::Error) -> Self {
        ApiError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            "Could not complete remote request",
            err.to_string(),
        )
    }
}

impl From<sled::Error> for ApiError {
    fn from(err: sled::Error) -> Self {
        ApiError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            "Database error",
            err.to_string(),
        )
    }
}

impl From<serde_json::Error> for ApiError {
    fn from(err: serde_json::Error) -> Self {
        ApiError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            "Could not deserialize object",
            err.to_string(),
        )
    }
}

impl From<str::Utf8Error> for ApiError {
    fn from(err: str::Utf8Error) -> Self {
        ApiError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            "Could not deserialize object",
            err.to_string(),
        )
    }
}

impl From<shakmaty::fen::ParseFenError> for ApiError {
    fn from(err: shakmaty::fen::ParseFenError) -> Self {
        ApiError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            "Could not parse FEN",
            err.to_string(),
        )
    }
}

impl From<shakmaty::PositionError<Chess>> for ApiError {
    fn from(err: shakmaty::PositionError<Chess>) -> Self {
        ApiError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            "Could not convert FEN to valid position",
            err.to_string(),
        )
    }
}
