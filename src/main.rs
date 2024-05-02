mod signup;
mod trip;

use std::sync::Arc;

use axum::{
    routing::{get, post},
    Extension, Router,
};
use sqlx::{migrate::MigrateDatabase, Sqlite, SqlitePool};
use tokio::net::TcpListener;
use tower_http::{
    compression::CompressionLayer,
    cors::{Any, CorsLayer},
    services::ServeDir,
    trace::{self, TraceLayer},
};
use tracing::{debug, error, info, Level};

pub type Conn = Arc<SqlitePool>;
pub const DB_URL: &str = "sqlite://data/base.db";

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

    info!("Running migrations...");

    let migrations = std::path::Path::new("./migrations");
    let migration_results = sqlx::migrate::Migrator::new(migrations)
        .await
        .expect("Failed to run migrations")
        .run(pool.as_ref())
        .await;

    match migration_results {
        Ok(_) => {
            info!("Migration success");
        }
        Err(e) => {
            error!("error: {}", e);
        }
    }

    let user_api = Router::new().route(trip::BY_USER, get(trip::get_trip_by_user));
    let trip_api = Router::new().route(trip::BY_ID, get(trip::get_trip_by_id));

    let app = Router::new()
        // Others
        .nest_service("/public/", ServeDir::new("./frontend/public/"))
        .nest_service("/", ServeDir::new("./frontend/dist/"))
        .route("/signup", post(signup::accept_form))
        .route("/login", post(signup::login_check))
        .nest(trip::USER_BASE, user_api)
        .nest(trip::TRIP_BASE, trip_api)
        .layer(Extension(pool))
        .layer(CorsLayer::new().allow_origin(Any))
        .layer(CompressionLayer::new())
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(trace::DefaultMakeSpan::new().level(Level::INFO))
                .on_response(trace::DefaultOnResponse::new().level(Level::INFO)),
        );

    tracing::info!("listening on http://0.0.0.0:8080");

    if let Err(e) = axum::serve(listener, app).await {
        error!("Failed to start server: {}", e);
    }
}
