use std::sync::Arc;
use actix_web::{App, HttpServer, web};
use rocksdb::{DB, Options};
use vs_lichess_db::ChessCache;

#[actix_web::main]
pub async fn main() -> std::io::Result<()> {
    let db_path = "./lichess_cache";
    let mut opts = Options::default();
    opts.create_if_missing(true);

    let db = Arc::new(DB::open(&opts, db_path).expect("Failed to establish database"));

    HttpServer::new(|| {
        App::new()
            .app_data(web::Data::new(ChessCache { db: db.clone() }))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
