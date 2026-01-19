mod ipfs;

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[ic_cdk::update]  // TODO: Guard the upload. Maybe also inspect message?
fn store_block(cid: String, data: Vec<u8>) -> Result<(), String> {
    ipfs::parse_cid(&cid);
    Ok(())
}

ic_cdk::export_candid!();
