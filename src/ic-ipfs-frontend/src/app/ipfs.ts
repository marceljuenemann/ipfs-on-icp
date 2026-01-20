import { Blocks, createHelia } from 'helia';
import { CID } from 'multiformats/cid';
import { unixfs } from '@helia/unixfs';

export type IpfsBlock = { cid: CID, bytes: Uint8Array };
export type UnixFsBlocks = { rootCid: CID, blocks: IpfsBlock[] };

/**
 * Converts raw bytes into an array of IPFS blocks.
 */
export async function bytesToBlocks(bytes: Uint8Array): Promise<UnixFsBlocks> {
  const helia = await createHelia({ start: false });
  const fs = unixfs(helia);
  const cid = await fs.addBytes(bytes);
  return {
    rootCid: cid,
    blocks: await Array.fromAsync(allBlocks(helia.blockstore))
  }
}

async function* allBlocks(blockstore: Blocks): AsyncGenerator<IpfsBlock> {
  for await (const block of blockstore.getAll()) {
    for await (const bytes of block.bytes) {
      yield { cid: block.cid, bytes };
      break;  // TODO: Support blocks with multiple chunks.
    }
  }
}
