use std::sync::Arc;

use axum::{Extension, Router};
use sqlx::{migrate::MigrateDatabase, Sqlite, SqlitePool};
use tokio::net::TcpListener;
use tower_http::{
    compression::CompressionLayer,
    cors::{Any, CorsLayer},
    services::ServeDir,
    trace::TraceLayer,
};
use tracing::{debug, error, info};

pub type Conn = Arc<SqlitePool>;
pub const DB_URL: &str = "sqlite://base.db";

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .init();

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

    let pool: Conn = Arc::new(SqlitePool::connect(DB_URL).await.unwrap());
    let listener = TcpListener::bind("0.0.0.0:8080").await.unwrap();

    let app = Router::new()
        // Others
        .nest_service("/public/", ServeDir::new("./frontend/public/"))
        .nest_service("/", ServeDir::new("./frontend/dist/"))
        .layer(Extension(pool))
        .layer(CorsLayer::new().allow_origin(Any))
        .layer(CompressionLayer::new())
        .layer(TraceLayer::new_for_http());

    tracing::info!("listening on http://0.0.0.0:8080");

    if let Err(e) = axum::serve(listener, app).await {
        error!("Failed to start server: {}", e);
    }
}
