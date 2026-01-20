import { Blocks, createHelia, Helia } from 'helia';
import { CID } from 'multiformats/cid';
import { unixfs } from '@helia/unixfs';

export type IpfsBlock = { cid: CID, bytes: Uint8Array };

/**
 * Converts raw bytes into an array of IPFS blocks.
 */
export async function bytesToBlocks(bytes: Uint8Array): Promise<IpfsBlock[]> {
  const helia = await createHelia({ start: false });
  const fs = unixfs(helia);

        /*
        const cid = await fs.addFile({
          path: file.name,
          content: uint8Array
        });
        */

  const cid = await fs.addBytes(bytes);


  return await Array.fromAsync(dumpBlockstore(helia.blockstore));
}

async function* dumpBlockstore(blockstore: Blocks): AsyncGenerator<IpfsBlock> {
  for await (const block of blockstore.getAll()) {
    for await (const bytes of block.bytes) {
      yield { cid: block.cid, bytes };
      break;  // TODO: Support blocks with multiple chunks.
    }
  }
}
