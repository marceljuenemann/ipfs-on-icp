import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { createVerifiedFetch } from '@helia/verified-fetch';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ipfs-on-icp');

  constructor() {
    this.init();
  }

  async init() {

    /*
    const resp = await fetch('http://uxrrr-q7777-77774-qaaaq-cai.raw.localhost:4943/ipfs/bafkreieq5jui4j25lacwomsqgjeswwl3y5zcdrresptwgmfylxo2depppq');
    */

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
  }
}
