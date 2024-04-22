# References: 
#   https://endler.dev/2020/rust-compile-times/#bonus-speed-up-rust-docker-builds-whale
#   https://www.augmentedmind.de/2022/02/06/optimize-docker-image-size/

# TODO: avoid using so much apt-get

# Step 1: Compute a recipe file
FROM rust:1.77-slim-bookworm as planner
WORKDIR app
RUN cargo install cargo-chef
COPY ./Cargo.toml ./src .
RUN cargo chef prepare --recipe-path recipe.json

# Step 2: Cache project dependencies, for rust
FROM rust:1.77-slim-bookworm as cacher_rust
WORKDIR app/
RUN cargo install cargo-chef
COPY --from=planner /app/recipe.json recipe.json
RUN apt-get update && apt-get install -y --no-install-recommends pkg-config libssl-dev && apt-get clean && rm -rf /var/lib/apt/lists/* && cargo chef cook --release --recipe-path recipe.json

# Step 2.1: Cache project dependencies, for node
FROM node:current-alpine as cacher_node
WORKDIR app/
COPY ./frontend/package*.json ./frontend/yarn.lock ./
RUN yarn install --immutable && yarn cache clean

# Step 3: Build the binary
FROM rust:1.77-slim-bookworm as builder_rust
WORKDIR app
RUN mkdir -p src
COPY ./Cargo.toml .
COPY ./src ./src
COPY ./base.db .
# Copy over the cached dependencies from above
COPY --from=cacher_rust /app/target target
COPY --from=cacher_rust /usr/local/cargo /usr/local/cargo
# Install native tls dependencies
RUN cargo build --release

# Step 3.1: Build the React project
FROM node:current-alpine as builder_node
WORKDIR app
COPY ./frontend/ .
# Copy over the cached dependencies from cacher_node
COPY --from=cacher_node /app/node_modules node_modules
RUN yarn run build

FROM debian:bookworm-slim as runtime
RUN mkdir -p frontend/public frontend/dist
COPY --from=builder_node /app/public/ frontend/public/
COPY --from=builder_node /app/dist/ frontend/dist/
COPY --from=builder_rust /app/target/release/sun .
COPY --from=builder_rust /app/base.db .
ENTRYPOINT ["/sun"]
