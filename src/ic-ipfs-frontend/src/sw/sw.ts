/// <reference lib="webworker" />

import { createVerifiedFetch } from '@helia/verified-fetch';
import { clientsClaim } from 'workbox-core';
import { registerRoute } from 'workbox-routing';

declare const self: ServiceWorkerGlobalScope;

// Active as soon as possible.
clientsClaim();
self.skipWaiting();

const verifiedFetch = createVerifiedFetch({
  gateways: [
    // TODO: configure based on canister environment var.
    'http://uxrrr-q7777-77774-qaaaq-cai.raw.localhost:4943',
    'https://trustless-gateway.link'
  ],
  routers: [],  // No p2p fetching.
  allowInsecure: true,  // TODO: dev only
  allowLocal: true  // TODO: dev only
})

// IPFS handling.
// TODO: Implement caching strategies for IPFS content.
registerRoute(
  // TODO: Do not allow for direct navigations, otherwise every file could read cookies.
  ({ url }) => url.pathname.startsWith('/ipfs/') || url.pathname.startsWith('/ipns/'),
  async ({ url }) => {
    // TODO: Handle errors.
    const fetch = await verifiedFetch;
    return await fetch(url.pathname);
  }
);
