use shakmaty::fen::Fen;

use crate::{
    errors::ApiError,
    modules::chess::models::{ChessPosStats, LichessQueryParams},
};

const LICHESS_API_URL: &str = "https://explorer.lichess.ovh/lichess";
pub async fn query_lichess(client: &reqwest::Client, fen: Fen) -> Result<ChessPosStats, ApiError> {
    let params = LichessQueryParams {
        fen: fen.to_string(),
        speeds: String::from("blitz,rapid,classical,correspondence"),
        top_games: 0,
        recent_games: 0,
    };
    let response = client.get(LICHESS_API_URL).query(&params).send().await?;
    let data: ChessPosStats = response.json().await?;
    Ok(data)
}
