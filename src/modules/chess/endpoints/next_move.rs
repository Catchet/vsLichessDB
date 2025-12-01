use crate::{
    errors::ApiError,
    modules::chess::{
        models::ChessPosStats, query_lichess::query_lichess, util::select_random_move,
    },
};
use actix_web::{
    HttpResponse, get,
    http::StatusCode,
    web::{self, Query},
};
use serde::{Deserialize, Serialize};
use shakmaty::{CastlingMode, Chess, Position, fen::Fen, san::San, uci::UciMove};

#[derive(Deserialize)]
pub struct CalcNextMoveInput {
    fen: String, // FEN struct?
                 // weight dist params
                 // more?
}

#[derive(Serialize)]
pub struct NextMove {
    next_move: String, //Shakmaty struct? e2e4
}

#[get("next-move")]
pub async fn calculate_next_move(
    client: web::Data<reqwest::Client>,
    cache: web::Data<sled::Db>,
    input: Query<CalcNextMoveInput>,
) -> Result<HttpResponse, ApiError> {
    let input = input.into_inner();
    let fen: Fen = input.fen.parse()?;
    let pos: Chess = fen.clone().into_position::<Chess>(CastlingMode::Standard)?;
    if pos.is_game_over() {
        return Err(ApiError::msg(
            StatusCode::BAD_REQUEST,
            "The game is already over",
        ));
    }
    let fen_str = fen.to_string();
    let key = fen_str.as_bytes();

    let stats: ChessPosStats;
    match cache.get(key)? {
        Some(bytes) => {
            let json_str = str::from_utf8(&bytes)?;
            stats = serde_json::from_str(json_str)?;
        }
        None => {
            stats = query_lichess(client.get_ref(), &fen).await?;
            cache.insert(key, serde_json::to_vec(&stats)?)?;
        }
    }

    let selected_move = select_random_move(stats)?;

    let uci = selected_move.parse::<UciMove>()?;
    let mv = uci.to_move(&pos)?;
    let san = San::from_move(&pos, mv);

    let response = NextMove {
        next_move: san.to_string(),
    };
    Ok(HttpResponse::Ok().json(response))
}
