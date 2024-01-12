use crate::Conn;

use axum::{extract::Path, response::IntoResponse, Extension, Json};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, SqliteConnection};
use typeshare::typeshare;

#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
#[sqlx(rename_all = "UPPERCASE")]
pub struct List {
    id: i64,
    title: String,

    #[sqlx(skip)]
    items: Vec<Item>,
}

#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
#[sqlx(rename_all = "UPPERCASE")]
pub struct Item {
    id: i64,
    content: Option<String>,
    complete: bool,
    ordinality: i64,
    parent_list: i64,
}

#[axum::debug_handler]
pub async fn get_lists(
    Extension(conn): Extension<Conn>,
    Path(_user_id): Path<String>,
) -> impl IntoResponse {
    tracing::info!("lists {}", _user_id);

    let mut lists: Vec<List> = sqlx::query_as("SELECT id, title FROM LIST;")
        .fetch_all(conn.as_ref())
        .await
        .unwrap();

    for list in lists.iter_mut() {
        let mut items : Vec<Item> = sqlx::query_as(
             &format!("SELECT ID, CONTENT, COMPLETE, ORDINALITY, PARENT_LIST FROM ITEM where parent_list = {};", list.id),
         )
         .fetch_all(conn.as_ref())
         .await
         .unwrap();

        items.sort_by(|a, b| a.ordinality.cmp(&b.ordinality));

        list.items = items;
    }

    Json(lists)
}

pub fn save(Extension(conn): Extension<SqliteConnection>, Json(payload): Json<Item>) {
    //
}
