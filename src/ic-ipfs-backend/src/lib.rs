mod ipfs;

use std::vec;

use ic_http_certification::{HttpRequest, HttpResponse, StatusCode};

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[ic_cdk::update]  // TODO: Guard the upload. Maybe also inspect message?
fn store_block(cid: String, data: Vec<u8>) -> Result<(), String> {
    ipfs::parse_cid(&cid);
    Ok(())
}

#[ic_cdk::query]
fn http_request(req: HttpRequest) -> HttpResponse {
    let path = req.get_path().expect("Failed to parse request path");

    ic_cdk::println!("Received HTTP request for path: {}", path);

    let response = HttpResponse::builder()
        .with_status_code(StatusCode::OK)
        .with_body("Hello World!".as_bytes())
        .build();

    response
}

ic_cdk::export_candid!();
