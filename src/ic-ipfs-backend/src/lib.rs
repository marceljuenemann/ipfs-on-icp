mod ipfs;

use ic_http_certification::{HttpRequest, HttpResponse, StatusCode};
use ic_stable_structures::{DefaultMemoryImpl, memory_manager::{MemoryId, MemoryManager, VirtualMemory}};
use std::{cell::RefCell, vec};

use ipfs::StableBlockstore;

use crate::ipfs::parse_cid;

type Memory = VirtualMemory<DefaultMemoryImpl>;
const MEMORY_ID_BLOCKSTORE: MemoryId = MemoryId::new(0);

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));
    static BLOCKSTORE: RefCell<StableBlockstore<Memory>> = RefCell::new(
        StableBlockstore::init(MEMORY_MANAGER.with(|m| m.borrow().get(MEMORY_ID_BLOCKSTORE))),
    );
}

/// Stores an IPFS block identified by its CID.
/// Returns true if the block was inserted and
/// false if the block already existed.
#[ic_cdk::update]  // TODO: Guard the upload. Maybe also inspect message?
fn blockstore_put(cid_str: String, data: Vec<u8>) -> Result<bool, String> {
    let cid = parse_cid(cid_str)?;
    BLOCKSTORE.with(|bs| bs.borrow_mut().put(&cid, data))
}

#[ic_cdk::query]
fn http_request(req: HttpRequest) -> HttpResponse {
    let path = req.get_path().expect("Failed to parse request path");

    if path.starts_with("/ipfs") {
        // Note: parse_cid supports parsing with /ipfs prefix.
        let cid = parse_cid(path);
        if cid.is_err() {
            return HttpResponse::bad_request(
                format!("Failed to parse CID: {}", cid.err().unwrap()).into_bytes(),
                vec![]
            ).build();
        }

        let block = BLOCKSTORE.with(|bs| bs.borrow().get(&cid.unwrap()));
        if block.is_some() {
            let response = HttpResponse::builder()
                .with_status_code(StatusCode::OK)
                .with_body(block.unwrap())
                .with_headers(vec![
                    ("Content-type".to_string(), "application/vnd.ipld.raw".to_string())
                ])
                .build();
            return response;
        }
    }

    return HttpResponse::not_found("".as_bytes(), vec![]).build();
}

ic_cdk::export_candid!();
