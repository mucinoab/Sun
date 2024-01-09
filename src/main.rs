mod checklist;

use crate::checklist::get_lists;

use std::sync::Arc;

use axum::{
    routing::{get, get_service},
    Extension, Router,
};
use sqlx::SqlitePool;
use tokio::net::TcpListener;
use tower_http::{
    compression::CompressionLayer,
    cors::{Any, CorsLayer},
    services::ServeDir,
    trace::TraceLayer,
};

pub(crate) type Conn = Arc<SqlitePool>;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let listener = TcpListener::bind("0.0.0.0:8080").await.unwrap();
    let mut pool: Conn = Arc::new(SqlitePool::connect("sqlite::memory:").await.unwrap());

    let app = Router::new()
        .route("/lists/:id", get(get_lists))
        .fallback_service(get_service(ServeDir::new("./frontend/dist/")))
        .layer(Extension(pool))
        .layer(CorsLayer::new().allow_origin(Any))
        .layer(TraceLayer::new_for_http())
        .layer(CompressionLayer::new());

    tracing::info!("listening on http://0.0.0.0:8080");

    if let Err(e) = axum::serve(listener, app).await {
        tracing::error!("Failed to start server: {}", e);
    }
}
