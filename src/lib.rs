pub mod errors;

use std::sync::Arc;
use rocksdb::DB;
use serde::{Deserialize, Serialize};
use shakmaty::fen::Fen;

use crate::errors::ApiError;

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

#[derive(Serialize, Deserialize)]
pub struct LichessQueryParams {
    fen: String,
    speeds: Vec<String>,
    topGames: u8,
    recentGames: u8,
}

const LICHESS_API_URL: &str = "https://api.lichess.ovh/opening-explorer";
pub async fn query_lichess(client: &reqwest::Client, fen: Fen) -> Result<ChessPosStats, ApiError> {
    let params = LichessQueryParams {
        fen: fen.to_string(),
        speeds: vec![String::from("blitz"), String::from("rapid"), String::from("classical"), String::from("correspondence")],
        topGames: 0,
        recentGames: 0
    };
    let response = client.get(LICHESS_API_URL).query(&params).send().await?;
    let data: ChessPosStats = response.json().await?;
    Ok(data)
}
