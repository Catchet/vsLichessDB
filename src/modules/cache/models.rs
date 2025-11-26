use serde::{Deserialize, Serialize};

use crate::modules::chess::models::ChessPosStats;

#[derive(Serialize, Deserialize)]
pub struct CacheEntry {
    pub stats: ChessPosStats,
    // access_count: i32,
    // created_by: String,
    // created_at: DateTime<Utc>,
    // last_accessed: DateTime<Utc>
}
