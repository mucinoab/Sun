use crate::Conn;

use std::hash::{DefaultHasher, Hasher};

use axum::{
    response::{IntoResponse, Redirect, Response},
    Extension, Form,
};
use rand::prelude::*;
use serde::Deserialize;
use tracing::{error, instrument};

#[derive(Deserialize, Debug)]
pub struct SignUp {
    username: String,
    email: String,
    password: String,
}

#[instrument(level = "info", skip(sign_up, state))]
pub async fn accept_form(state: Extension<Conn>, Form(sign_up): Form<SignUp>) -> Response {
    let (hashed_password, salt) = hash_password(&sign_up.password);
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

fn hash_password(password: &str) -> (String, String) {
    let salt = random::<u64>().to_string();

    let mut hasher = DefaultHasher::new();
    hasher.write(password.as_bytes());
    hasher.write(salt.as_bytes());

    (hasher.finish().to_string(), salt)
}
