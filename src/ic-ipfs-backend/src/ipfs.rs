use multihash_codetable::{Code, MultihashDigest};
use cid::Cid;
use std::convert::TryFrom;

const RAW: u64 = 0x55;

pub fn parse_cid(cid: &str) -> Result<Vec<u8>, String> {

    let h = Code::Sha2_256.digest("Hello World!".as_bytes());

    let cid = Cid::new_v1(RAW, h);

    ic_cdk::println!("CID: {}", cid.to_string());
    Ok(cid.to_bytes())
}
