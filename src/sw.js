/* eslint-disable comma-dangle */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */
/* eslint-disable import/no-extraneous-dependencies */
import { CacheableResponsePlugin } from 'workbox-cacheable-response/CacheableResponsePlugin';
import { CacheFirst } from 'workbox-strategies/CacheFirst';
import { NetworkOnly } from 'workbox-strategies/NetworkOnly';
import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute';
import { registerRoute } from 'workbox-routing/registerRoute';

import { matchPrecache } from 'workbox-precaching/matchPrecache';

import { setCatchHandler } from 'workbox-routing/setCatchHandler';

precacheAndRoute(self.__WB_MANIFEST, {
  ignoreURLParametersMatching: [/.*/],
});

registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
);

registerRoute(
  ({ request }) => request.destination === 'document',
  new NetworkOnly({
    cacheName: 'htmlcache',
  })
);

setCatchHandler(async ({ event }) => {
  if (event.request.destination === 'document') {
    return matchPrecache('offline.html');
  }
  return Response.error();
});
