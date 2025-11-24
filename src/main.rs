use actix_files::Files;
use actix_web::{App, HttpServer, web};
use rocksdb::{DB, Options};
use std::sync::Arc;
use vs_lichess_db::modules::{cache::models::ChessCache, chess};

#[actix_web::main]
pub async fn main() -> std::io::Result<()> {
    let db_path = "./lichess_cache";
    let mut opts = Options::default();
    opts.create_if_missing(true);

    let db = Arc::new(DB::open(&opts, db_path).expect("Failed to establish database"));

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(ChessCache { db: db.clone() }))
            .service(chess::router::controller())
            .service(
                Files::new("/", "./frontend/dist")
                    .index_file("index.html")
                    .prefer_utf8(true),
            )
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
