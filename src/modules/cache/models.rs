use std::sync::Arc;

use rocksdb::DB;
use serde::{Deserialize, Serialize};

use crate::modules::chess::models::ChessPosStats;

pub struct ChessCache {
    pub db: Arc<DB>,
}

#[derive(Serialize, Deserialize)]
pub struct CacheEntry {
    pub stats: ChessPosStats,
    // access_count: i32,
    // created_by: String,
    // created_at: DateTime<Utc>,
    // last_accessed: DateTime<Utc>
}
