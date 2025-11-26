use actix_web::{App, HttpServer, middleware::Logger, web};
use vs_lichess_db::modules::chess;

#[actix_web::main]
pub async fn main() -> std::io::Result<()> {
    let db_path = "./lichess_cache";
    let db = sled::open(db_path).expect("Failed to open sled database");

    let client = reqwest::Client::new();

    env_logger::init_from_env(env_logger::Env::default().default_filter_or("info"));

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .app_data(web::Data::new(client.clone()))
            .app_data(web::Data::new(db.clone()))
            .service(chess::router::controller())
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
