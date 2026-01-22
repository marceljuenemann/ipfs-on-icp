import { BACKEND } from '../agents';
import { Injectable } from '@angular/core';
import { IpfsBlock } from './ipfs';

export type UploadResult = 'success' | 'duplicate' | { error: string };

@Injectable({
  providedIn: 'root',
})
export class Backend {

  // TODO: Before uploading, check whether block is already present.
  // That saves a lot of cycles.
  async uploadBlock(block: IpfsBlock, password: string): Promise<UploadResult> {
    try {
      const result = await BACKEND.blockstore_put(block.cid.toString(), block.bytes, password);
      if ('Ok' in result) {
        return result.Ok ? 'success' : 'duplicate';
      } else {
        return { error: result.Err };
      }
    } catch (e) {
      return { error: (e as Error).message };
    }
  }
}
