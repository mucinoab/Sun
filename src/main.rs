mod checklist;

use crate::checklist::get_lists;

use std::sync::Arc;

use axum::{
    routing::{get, get_service},
    Extension, Router,
};
use sqlx::{Sqlite, SqlitePool};
use tokio::net::TcpListener;
use tower_http::{
    compression::CompressionLayer,
    cors::{Any, CorsLayer},
    services::ServeDir,
    trace::TraceLayer,
};

pub(crate) type Conn = Arc<SqlitePool>;
pub const DB_URL: &str = "sqlite://base.db";
use sqlx::migrate::MigrateDatabase;
use tracing::{debug, error, info};

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    if !Sqlite::database_exists(DB_URL).await.unwrap_or(false) {
        info!("Creating database {}", DB_URL);
        if let Err(e) = Sqlite::create_database(DB_URL).await {
            error!("Failed to create database: {}", e);
        } else {
            info!("Database created");
        }
    } else {
        debug!("Database already exists");
    }

    let mut pool: Conn = Arc::new(SqlitePool::connect(DB_URL).await.unwrap());
    let listener = TcpListener::bind("0.0.0.0:8080").await.unwrap();

    let app = Router::new()
        .route("/lists/:id", get(get_lists))
        .fallback_service(get_service(ServeDir::new("./frontend/dist/")))
        .layer(Extension(pool))
        .layer(CorsLayer::new().allow_origin(Any))
        .layer(TraceLayer::new_for_http())
        .layer(CompressionLayer::new());

    tracing::info!("listening on http://0.0.0.0:8080");

    if let Err(e) = axum::serve(listener, app).await {
        error!("Failed to start server: {}", e);
    }
}
