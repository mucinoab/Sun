use crate::Conn;

use axum::{extract::Path, response::IntoResponse, Extension, Json};
use serde::{Deserialize, Serialize};
use sqlx::{
    types::chrono::{DateTime, Utc},
    FromRow,
};
use tracing::instrument;
use ts_rs::TS;

pub static TRIP_BASE: &str = "/trip";
pub static BY_USER: &str = "/:user_id";

#[derive(Deserialize, Serialize, Debug, FromRow, TS)]
#[sqlx(rename_all = "UPPERCASE")]
#[ts(export, export_to = "frontend/src/bindings/Note.ts")]
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
#[ts(export, export_to = "frontend/src/bindings/Trip.ts")]
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

#[instrument(level = "info", skip(conn, user_id))]
pub async fn get_trip_by_user(
    Extension(conn): Extension<Conn>,
    Path(user_id): Path<i32>,
) -> impl IntoResponse {
    let trips: Vec<Trip> = sqlx::query_as(
        "SELECT id
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
