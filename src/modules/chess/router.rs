use actix_web::{Scope, web::scope};

use crate::modules::chess::endpoints::next_move::calculate_next_move;

pub fn controller() -> Scope {
    scope("/chess").service(calculate_next_move)
}
