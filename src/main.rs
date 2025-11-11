use actix_web::{App, HttpServer};

#[actix_web::main]
pub async fn main() -> std::io::Result<()> {

    HttpServer::new(|| {
        App::new()
            .app_data(db)
            .service(hello)
            .service(echo)
            .route("/hey", web::get().to(manual_hello))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
