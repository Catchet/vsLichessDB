use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct ChessPosStats {
    // as returned from Lichess API
    pub white: i64,
    pub draws: i64,
    pub black: i64,
    pub moves: Vec<ChessMoveStats>,
    // pub topGames: Vec<ChessGame>,
    pub opening: Option<ChessOpening>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChessMoveStats {
    pub uci: String,
    pub san: String,
    pub average_rating: i32,
    pub white: i64,
    pub draws: i64,
    pub black: i64,
    // pub game: Option<ChessGame>,
    pub opening: Option<ChessOpening>,
}

#[derive(Serialize, Deserialize)]
pub struct ChessOpening {
    pub eco: String,
    pub name: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LichessQueryParams {
    pub fen: String,
    pub speeds: String,
    pub top_games: u8,
    pub recent_games: u8,
}
