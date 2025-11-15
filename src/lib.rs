pub mod errors;

use std::sync::Arc;
use rocksdb::DB;
use serde::{Deserialize, Serialize};

pub struct ChessCache {
    pub db: Arc<DB>
}

#[derive(Serialize, Deserialize)]
pub struct ChessPosStats {
    // as returned from Lichess API
    pub white: i32,
    pub draws: i32,
    pub black: i32,
    pub moves: Vec<ChessMoveStats>,
    // pub topGames: Vec<ChessGame>,
    pub opening: Option<ChessOpening>,
}

#[derive(Serialize, Deserialize)]
pub struct ChessMoveStats {
    pub uci: String,
    pub san: String,
    pub averageRating: i32,
    pub white: i32,
    pub draws: i32,
    pub black: i32,
    // pub game: Option<ChessGame>,
    pub opening: Option<ChessOpening>
}

#[derive(Serialize, Deserialize)]
pub struct ChessOpening {
    pub eco: String,
    pub name: String,
}
