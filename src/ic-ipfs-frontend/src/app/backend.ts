import { createActor, ic_ipfs_backend } from 'declarations/ic-ipfs-backend';

import { Injectable, isDevMode } from '@angular/core';
import { IpfsBlock } from './ipfs';
import { ActorSubclass } from '@icp-sdk/core/agent';
import { _SERVICE } from 'declarations/ic-ipfs-backend/ic-ipfs-backend.did';

export type UploadResult = 'success' | 'duplicate' | { error: string };

@Injectable({
  providedIn: 'root',
})
export class Backend {
  private actor: ActorSubclass<_SERVICE>;

  constructor() {
    // TODO: put this into actors.ts. Don't use index.js from the declarations,
    // as that always throws an error when using with ng serve.
    if (isDevMode()) {
      this.actor = createActor(
        globalThis.process.env['CANISTER_ID_IC_IPFS_BACKEND'],
        { agentOptions: { host: 'http://localhost:4943' } }
      );
    } else {
      this.actor = ic_ipfs_backend;
    }
  }

  async uploadBlock(block: IpfsBlock): Promise<UploadResult> {
    const msg = await this.actor.greet(block.cid.toString());
    console.log(msg);
    return 'success';
  }

}
