use crate::Conn;

use axum::{
    extract::Path,
    http::StatusCode,
    response::{IntoResponse, Response},
    Extension, Json,
};
use serde::{Deserialize, Serialize};
use sqlx::{
    types::chrono::{DateTime, Utc},
    FromRow,
};
use tracing::instrument;
use ts_rs::TS;

pub static USER_BASE: &str = "/user";
pub static TRIP_BASE: &str = "/trip";
pub static BY_USER: &str = "/:user_id/trips";
pub static BY_ID: &str = "/:trip_id";

#[derive(Deserialize, Serialize, Debug, FromRow, TS)]
#[sqlx(rename_all = "UPPERCASE")]
#[ts(export, export_to = "../frontend/src/bindings/Note.ts")]
pub struct Note {
    pub id: i32,
    pub title: String,
    pub content: Option<String>,
    #[ts(type = "number")]
    pub created_at: DateTime<Utc>,
    #[ts(type = "number")]
    pub updated_at: DateTime<Utc>,
    pub parent_trip: i32,
}

#[derive(Deserialize, Serialize, Debug, FromRow, TS)]
#[sqlx(rename_all = "UPPERCASE")]
#[ts(export, export_to = "../frontend/src/bindings/Trip.ts")]
pub struct Trip {
    pub id: i32,
    pub user_id: i32,
    pub title: String,
    pub image: Option<String>,
    #[ts(type = "number")]
    pub start_date: DateTime<Utc>,
    #[ts(type = "number")]
    pub end_date: DateTime<Utc>,
    #[ts(type = "number")]
    pub created_at: DateTime<Utc>,
    #[ts(type = "number")]
    pub updated_at: DateTime<Utc>,
}

#[derive(Deserialize, Serialize, Debug, FromRow)]
struct Id(i32);

#[instrument(level = "info", skip(conn, user_id))]
pub async fn get_trip_by_user(
    Extension(conn): Extension<Conn>,
    Path(user_id): Path<i64>,
) -> impl IntoResponse {
    let trips: Vec<Id> = sqlx::query_as(
        "SELECT ID
        FROM TRIP
        WHERE USER_ID = ?
        ORDER BY UPDATED_AT DESC",
    )
    .bind(user_id)
    .fetch_all(conn.as_ref())
    .await
    .expect("Failed to fetch trips by user id");

    Json(trips)
}

#[instrument(level = "info", skip(conn, trip_id))]
pub async fn get_trip_by_id(
    Extension(conn): Extension<Conn>,
    Path(trip_id): Path<i64>,
) -> Response {
    let trip: Option<Trip> = sqlx::query_as(
        "SELECT *
        FROM TRIP
        WHERE ID = ?
        LIMIT 1",
    )
    .bind(trip_id)
    .fetch_optional(conn.as_ref())
    .await
    .expect("Failed to fetch trips by user id");

    if let Some(trip) = trip {
        Json(trip).into_response()
    } else {
        StatusCode::NOT_FOUND.into_response()
    }
}
