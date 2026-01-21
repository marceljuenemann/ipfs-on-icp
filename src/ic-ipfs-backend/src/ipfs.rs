use std::{str::FromStr};

use multihash_codetable::{Code, MultihashDigest};
use cid::{Cid};
use ic_stable_structures::{BTreeMap, DefaultMemoryImpl, Memory};

/// Stores IPFS blocks in stable memory.
pub struct StableBlockstore<M: Memory = DefaultMemoryImpl> {
    // Note: Using a BTree so we can support deletions in the future.
    // If we don't want to support deletions, we should use stable::Log instead.
    blocks: BTreeMap<Vec<u8>, Vec<u8>, M>
}

impl<M: Memory> StableBlockstore<M> {
    pub fn init(memory: M) -> Self {
        Self {
            blocks: BTreeMap::init(memory)
        }
    }

    pub fn put(&mut self, cid: &Cid, data: Vec<u8>) -> Result<bool, String> {
        let hash = cid.hash().digest().to_vec();
        if self.blocks.contains_key(&hash) {
            return Ok(false);
        }
        // TODO: Should we support other hash functions than SHA2-256?
        if cid.hash().code() != 0x12 {
            return Err(format!("Unsupported hash function. Only SHA2-256 is supported. Got: {}", cid.hash().code()));
        }
        verify_sha2_256(&data, &hash)?;
        self.blocks.insert(hash, data);
        Ok(true)
    }

    pub fn get(&self, cid: &Cid) -> Option<Vec<u8>> {
        self.blocks.get(&cid.hash().digest().to_vec())
    }


}

pub fn parse_cid(cid_str: String) -> Result<Cid, String> {
    Cid::from_str(&cid_str).map_err(|e| e.to_string())
}

fn verify_sha2_256(data: &Vec<u8>, expected_hash: &Vec<u8>) -> Result<(), String> {
    let actual_hash = Code::Sha2_256.digest(data).digest().to_vec();
    if &actual_hash == expected_hash {
        Ok(())
    } else {
        Err(format!("SHA2-256 mismatch. Expected: {:?}. Actual: {:?}", expected_hash, actual_hash))
    }
}
