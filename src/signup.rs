use crate::Conn;

use std::hash::{DefaultHasher, Hasher};

use axum::{
    http::StatusCode,
    response::{IntoResponse, Redirect, Response},
    Extension, Form,
};
use rand::prelude::*;
use serde::Deserialize;
use sqlx::FromRow;
use tracing::{error, instrument};

#[derive(Deserialize, Debug, FromRow)]
#[sqlx(rename_all = "UPPERCASE")]
pub struct SignUp {
    username: String,
    email: String,
    password: String,
    salt: Option<String>,
}

fn hash_password(password: &str, salt: Option<String>) -> (String, String) {
    let salt = salt.unwrap_or_else(|| random::<u64>().to_string());

    let mut hasher = DefaultHasher::new();
    hasher.write(password.as_bytes());
    hasher.write(salt.as_bytes());

    (hasher.finish().to_string(), salt)
}

#[instrument(level = "info", skip(sign_up, state))]
pub async fn accept_form(state: Extension<Conn>, Form(sign_up): Form<SignUp>) -> Response {
    let (hashed_password, salt) = hash_password(&sign_up.password, None);
    let result = sqlx::query(
        "INSERT INTO USER
            (USERNAME, EMAIL, PASSWORD, SALT)
        VALUES (?, ?, ?, ?)
        ",
    )
    .bind(sign_up.username)
    .bind(sign_up.email)
    .bind(hashed_password)
    .bind(salt)
    .execute(state.0.as_ref())
    .await;

    if result.is_ok() {
        Redirect::to("/").into_response()
    } else {
        error!("Failed to create user: {:?}", result);
        Redirect::to("/").into_response()
    }
}

#[derive(Deserialize, Debug)]
pub struct Login {
    email: String,
    password: String,
}

#[instrument(level = "info", skip(login, state))]
pub async fn login_check(state: Extension<Conn>, Form(login): Form<Login>) -> Response {
    let user: Option<SignUp> = sqlx::query_as(
        "SELECT
            USERNAME, EMAIL, PASSWORD, SALT
        FROM USER
        WHERE EMAIL = ?",
    )
    .bind(login.email)
    .fetch_optional(state.0.as_ref())
    .await
    .expect("Failed to fetch credentials");

    // TODO In the real world, we should use a constant time comparison function
    // to avoid timing attacks.
    if user.is_none() {
        return StatusCode::UNAUTHORIZED.into_response();
    } else {
        // TODO Save the user session in a cookie
        let user = user.unwrap();
        let (hashed_password, _) = hash_password(&login.password, user.salt);

        if user.password == hashed_password {
            Redirect::to("/").into_response()
        } else {
            return StatusCode::UNAUTHORIZED.into_response();
        }
    }
}
