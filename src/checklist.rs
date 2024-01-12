use crate::Conn;

use axum::{
    extract::{self, Path},
    http::StatusCode,
    response::IntoResponse,
    Extension, Json,
};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use tracing::error;
use ts_rs::TS;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow, TS)]
#[sqlx(rename_all = "UPPERCASE")]
#[ts(export, export_to = "frontend/src/bindings/List.ts")]
pub struct List {
    id: i64,
    title: String,

    #[sqlx(skip)]
    items: Vec<Item>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow, TS)]
#[sqlx(rename_all = "UPPERCASE")]
#[ts(export, export_to = "frontend/src/bindings/Item.ts")]
pub struct Item {
    id: i64,
    content: Option<String>,
    complete: bool,
    ordinality: i64,
    parent_list: i64,
}

impl Item {
    fn new(id: i64, ordinality: i64, parent: i64) -> Self {
        Self {
            id,
            content: None,
            complete: false,
            ordinality,
            parent_list: parent,
        }
    }
}

pub async fn get_list(
    Extension(conn): Extension<Conn>,
    Path(list_id): Path<i64>,
) -> impl IntoResponse {
    tracing::info!("get_list {}", list_id);

    let mut list: List = sqlx::query_as("SELECT id, title FROM LIST where id = $1")
        .bind(list_id)
        .fetch_one(conn.as_ref())
        .await
        .unwrap();

    let mut items: Vec<Item> = sqlx::query_as(
        "SELECT ID, CONTENT, COMPLETE, ORDINALITY, PARENT_LIST FROM ITEM where parent_list = $1",
    )
    .bind(list.id)
    .fetch_all(conn.as_ref())
    .await
    .unwrap();

    items.sort_by(|a, b| a.ordinality.cmp(&b.ordinality));

    list.items = items;

    Json(list)
}

pub async fn set_item(
    Extension(conn): Extension<Conn>,
    Path(item_id): Path<i64>,
    Json(item): extract::Json<Item>,
) -> impl IntoResponse {
    tracing::info!("set_list {}, {:?}", item_id, item);

    let query =
        sqlx::query("Update item set content = $1, complete = $2, ordinality = $3 where id = $4")
            .bind(item.content)
            .bind(item.complete)
            .bind(item.ordinality)
            .bind(item.id);

    if let Err(e) = query.execute(conn.as_ref()).await {
        error!("{}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    } else {
        StatusCode::OK
    }
}

pub async fn create_item(
    Extension(conn): Extension<Conn>,
    Path((parent_id, ordinality)): Path<(i64, i64)>,
) -> impl IntoResponse {
    tracing::info!("create_item {}", parent_id);

    // Insert into ITEM (content, COMPLETE, ORDINALITY, PARENT_LIST) values ('Websocket setup to comunicate changes', false, 1, 4);
    let id: i64 = sqlx::query_scalar(
        "Insert into item (ORDINALITY, PARENT_LIST) values ($1, $2) returning id",
    )
    .bind(ordinality)
    .bind(parent_id)
    .fetch_one(conn.as_ref())
    .await
    .unwrap();

    Json(Item::new(id, ordinality, parent_id))
}

pub async fn get_lists_ids(
    Extension(conn): Extension<Conn>,
    Path(_user_id): Path<String>,
) -> impl IntoResponse {
    tracing::info!("get_lists_ids {}", _user_id);
    // TODO filter by user id
    let ids: Vec<i64> = sqlx::query!("SELECT id FROM LIST;")
        .fetch_all(conn.as_ref())
        .await
        .unwrap()
        .iter()
        .map(|r| r.ID)
        .collect();

    Json(ids)
}
