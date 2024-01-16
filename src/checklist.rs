use crate::Conn;

use axum::{
    extract::{self, Path},
    http::StatusCode,
    response::IntoResponse,
    Extension, Json,
};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use tracing::{error, instrument};
use ts_rs::TS;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow, TS)]
#[sqlx(rename_all = "UPPERCASE")]
#[ts(export, export_to = "frontend/src/bindings/List.ts")]
pub struct List {
    #[ts(type = "number")]
    id: i64,
    title: String,

    #[sqlx(skip)]
    items: Vec<Item>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow, TS)]
#[sqlx(rename_all = "UPPERCASE")]
#[ts(export, export_to = "frontend/src/bindings/Item.ts")]
pub struct Item {
    #[ts(type = "number")]
    id: i64,
    content: Option<String>,
    complete: bool,

    #[ts(type = "number")]
    ordinality: i64,

    #[ts(type = "number")]
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

#[instrument(level = "info", skip(conn))]
pub async fn get_list(
    Extension(conn): Extension<Conn>,
    Path(list_id): Path<i64>,
) -> impl IntoResponse {
    tracing::info!("get_lists {}", list_id);
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

#[instrument(level = "info", skip(conn), ret)]
pub async fn update_list_title(
    Extension(conn): Extension<Conn>,
    Path(list_id): Path<i64>,
    Json(new_title): extract::Json<String>,
) -> impl IntoResponse {
    let query = sqlx::query!(
        "Update list set title = $1 where id = $2",
        new_title,
        list_id
    );

    if let Err(e) = query.execute(conn.as_ref()).await {
        error!("{}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    } else {
        StatusCode::OK
    }
}

#[instrument(level = "info", skip(conn), ret)]
pub async fn update_item(
    Extension(conn): Extension<Conn>,
    Path(item_id): Path<i64>,
    Json(item): extract::Json<Item>,
) -> impl IntoResponse {
    let query = sqlx::query!(
        "Update item set content = $1, complete = $2, ordinality = $3 where id = $4",
        item.content,
        item.complete,
        item.ordinality,
        item.id
    );

    if let Err(e) = query.execute(conn.as_ref()).await {
        error!("{}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    } else {
        StatusCode::OK
    }
}

#[instrument(level = "info", skip(conn, items), ret)]
pub async fn batch_update_items(
    Extension(conn): Extension<Conn>,
    Json(items): extract::Json<Vec<Item>>,
) -> impl IntoResponse {
    tracing::info!("batch_update_items_list {}", items.len());

    for item in items {
        let query = sqlx::query!(
            "Update item set content = $1, complete = $2, ordinality = $3 where id = $4",
            item.content,
            item.complete,
            item.ordinality,
            item.id,
        );

        if let Err(e) = query.execute(conn.as_ref()).await {
            error!("{}", e);
            return StatusCode::INTERNAL_SERVER_ERROR;
        }
    }

    StatusCode::OK
}

#[instrument(level = "info", skip(conn), ret)]
pub async fn create_item(
    Extension(conn): Extension<Conn>,
    Path((parent_id, ordinality)): Path<(i64, i64)>,
) -> impl IntoResponse {
    let id: i64 = sqlx::query_scalar!(
        "Insert into item (ORDINALITY, PARENT_LIST) values ($1, $2) returning id",
        ordinality,
        parent_id
    )
    .fetch_one(conn.as_ref())
    .await
    .unwrap();

    Json(Item::new(id, ordinality, parent_id))
}

#[instrument(level = "info", skip(conn), ret)]
pub async fn delete_item(
    Extension(conn): Extension<Conn>,
    Path(item_id): Path<i64>,
) -> impl IntoResponse {
    if let Err(e) = sqlx::query_scalar!("DELETE FROM ITEM WHERE id = $1", item_id)
        .execute(conn.as_ref())
        .await
    {
        error!("{e}");
        StatusCode::INTERNAL_SERVER_ERROR
    } else {
        StatusCode::OK
    }
}

#[instrument(level = "info", skip(conn), ret)]
pub async fn delete_list(
    Extension(conn): Extension<Conn>,
    Path(list_id): Path<i64>,
) -> impl IntoResponse {
    // Cascade the delete of LIST into ITEM
    if let Err(e) = sqlx::query_scalar!(
        "BEGIN TRANSACTION;
        PRAGMA FOREIGN_KEYS = ON;
        DELETE FROM LIST WHERE ID = $1;
        COMMIT;
        PRAGMA FOREIGN_KEYS=OFF;
    ",
        list_id
    )
    .execute(conn.as_ref())
    .await
    {
        error!("{e}");
        StatusCode::INTERNAL_SERVER_ERROR
    } else {
        StatusCode::OK
    }
}

#[instrument(level = "info", skip(conn, _user_id))]
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
