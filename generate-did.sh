#!/usr/bin/env bash

# Workaround for a bug in cargo-did?!
generate-did ic-ipfs-backend
cp target/wasm32-unknown-unknown/release/ic_ipfs_backend.wasm target/wasm32-unknown-unknown/release/ic-ipfs-backend.wasm 
generate-did ic-ipfs-backend
dfx generate
