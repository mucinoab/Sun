use axum::{extract::Path, response::IntoResponse, Extension, Json};
use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[typeshare]
#[derive(Debug, Serialize, Deserialize)]
pub struct List {
    title: String,
    items: Vec<Item>,
}

#[typeshare]
#[derive(Debug, Serialize, Deserialize)]
pub struct Item {
    content: String,
    complete: bool,
}

use sqlx::SqliteConnection;

use crate::Conn;

#[axum::debug_handler]
pub async fn get_lists(
    Extension(conn): Extension<Conn>,
    Path(_user_id): Path<String>,
) -> impl IntoResponse {
    let account = sqlx::query!("SELECT * FROM (SELECT (1) AS ID, 'HERP DERPINSON' AS NAME)")
        .fetch_one(conn.as_ref())
        .await
        .unwrap();

    let v: Vec<List> = vec![];
    Json(v)
}

pub fn save(Extension(conn): Extension<SqliteConnection>, Json(payload): Json<Item>) {
    //
}
