import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { createHelia } from 'helia';
import { bytesToBlocks } from './ipfs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ipfs-on-icp');
  selectedFile: File | null = null;
  uploadResult: string | null = null;

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Selected file:', file);
      this.selectedFile = file;

      const blocks = await bytesToBlocks(new Uint8Array(await file.arrayBuffer()));
      console.log('Converted to blocks:', blocks);
    }
  }

  async uploadFile(): Promise<void> {
    if (!this.selectedFile) return;

    try {
      const data = await this.selectedFile.arrayBuffer();
      // TODO: Call store_block canister method with file data and CID
      this.uploadResult = `Uploading ${this.selectedFile.name} (${this.selectedFile.size} bytes)...`;
      console.log('File ready to upload:', this.selectedFile.name);
    } catch (error) {
      this.uploadResult = `Error: ${error}`;
    }
  }

  async init() {
    /*
    const resp = await fetch('http://uxrrr-q7777-77774-qaaaq-cai.raw.localhost:4943/ipfs/bafkreieq5jui4j25lacwomsqgjeswwl3y5zcdrresptwgmfylxo2depppq');
    */

    /*
    const fetch = await createVerifiedFetch({
      gateways: [
        // TODO: configure based on canister environment var.
        'http://uxrrr-q7777-77774-qaaaq-cai.raw.localhost:4943'
//        'https://trustless-gateway.link'
      ],
      routers: [],
      allowInsecure: true,  // TODO: dev only
      allowLocal: true  // TODO: dev only
    })

    const resp = await fetch('ipfs://bafkreid7qoywk77r7rj3slobqfekdvs57qwuwh5d2z3sqsw52iabe3mqne', {
      onProgress: (event) => {
        console.log(event);
      }
    });


    console.log(resp);
    console.log(await resp.text());
    */
  }
}
