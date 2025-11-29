use crate::{errors::ApiError, modules::chess::models::ChessPosStats};
use actix_web::http::StatusCode;
use rand::Rng;

// TODO: Weighted selection based on input parameters
pub fn select_random_move(
    pos_stats: ChessPosStats, /* settings: SelectionParameters */
) -> Result<String, ApiError> {
    let mut total = 0;
    for chess_move in pos_stats.moves.iter() {
        total += chess_move.white + chess_move.draws + chess_move.white;
    }
    if total <= 0 {
        return Err(ApiError::msg(
            StatusCode::INTERNAL_SERVER_ERROR,
            "Error selecting random move (not enough games)",
        ));
    }
    let mut rand_n = rand::rng().random_range(1..=total);
    for chess_move in pos_stats.moves.into_iter() {
        rand_n -= chess_move.white + chess_move.draws + chess_move.white;
        if rand_n <= 0 {
            return Ok(chess_move.uci);
        }
    }
    Err(ApiError::msg(
        StatusCode::INTERNAL_SERVER_ERROR,
        "Error selecting random move",
    ))
}
