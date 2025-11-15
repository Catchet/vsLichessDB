pub mod errors;

use std::sync::Arc;
use rocksdb::DB;

pub struct ChessCache {
    pub db: Arc<DB>
}
