import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { bytesToBlocks, UnixFsBlocks } from './ipfs';
import { Backend, UploadResult } from './backend';
import { Workbox } from 'workbox-window';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  serviceWorker = new Workbox('/sw.js');
  serviceWorkerActive = signal(false);

  blocksToUpload = signal<UnixFsBlocks | null>(null);
  uploadStatus = signal<Map<string, UploadResult | 'uploading'>>(new Map());

  constructor(private backend: Backend) {
    this.installServiceWorker();
  }

  async installServiceWorker() {
    this.serviceWorker.register();
    await this.serviceWorker.active;
    this.serviceWorkerActive.set(true);
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.blocksToUpload.set(await bytesToBlocks(new Uint8Array(await file.arrayBuffer())));
    }
  }

  async uploadBlocks(): Promise<void> {
    const pw = prompt('Enter admin password:');
    if (!pw) return;
    const blocks = this.blocksToUpload()!;
    for (const block of blocks.blocks) {
      this.setUploadStatus(block.cid.toString(), 'uploading');
      this.backend.uploadBlock(block, pw!).then(result => {
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
}
