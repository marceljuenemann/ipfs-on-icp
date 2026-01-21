import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { bytesToBlocks, UnixFsBlocks } from './ipfs';
import { Backend, UploadResult } from './backend';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  blocksToUpload = signal<UnixFsBlocks | null>(null);
  uploadStatus = signal<Map<string, UploadResult | 'uploading'>>(new Map());

  constructor(private backend: Backend) {
    this.installServiceWorker();
  }

  // TODO: clean up
  async installServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(
          '/sw.js',
          { scope: '/' }
        );

        if (registration.installing) {
          console.log('Service worker installing');
        } else if (registration.waiting) {
          console.log('Service worker installed');
        } else if (registration.active) {
          console.log('Service worker active');
        }

        console.log('Service worker registered successfully:', registration);
        return registration;
      } catch (error) {
        console.error('Service worker registration failed:', error);
        throw error;
      }
    } else {
      console.warn('Service workers are not supported in this environment');
      throw new Error('Service workers not supported');
    }
  }



  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.blocksToUpload.set(await bytesToBlocks(new Uint8Array(await file.arrayBuffer())));
    }
  }

  async uploadBlocks(): Promise<void> {
    const blocks = this.blocksToUpload()!;
    for (const block of blocks.blocks) {
      this.setUploadStatus(block.cid.toString(), 'uploading');
      this.backend.uploadBlock(block).then(result => {
        this.setUploadStatus(block.cid.toString(), result);
      });
    }
  }

  private setUploadStatus(cid: string, result: UploadResult | 'uploading') {
    // We need to create a new Map to trigger reactivity.
    const statusMap = new Map(this.uploadStatus());
    statusMap.set(cid, result);
    this.uploadStatus.set(statusMap);
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
