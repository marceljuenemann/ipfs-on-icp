import { Injectable } from '@angular/core';
import { IpfsBlock } from './ipfs';

export type UploadResult = 'success' | 'duplicate' | { error: string };

@Injectable({
  providedIn: 'root',
})
export class Backend {


  async uploadBlock(block: IpfsBlock): Promise<UploadResult> {
    return 'success';
  }

}
