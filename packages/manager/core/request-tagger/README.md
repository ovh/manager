# Request Tagger

> OVHcloud manager request Tagger

## Installation

```sh
pnpm install @ovh-ux/request-tagger
```

## Usage

Request Tagger is here to help us tag API requests, providing 4 headers :

* `X-OVH-MANAGER-NAVIGATION-ID`: A unique navigation identifier (common for all calls in the same session)
* `X-OVH-MANAGER-REQUEST-ID`: A request identifier (based on date + incremented session index)
* `X-OVH-MANAGER-PAGE`: The origin page of the request
* `X-OVH-MANAGER-VERSION`: The application version


### Examples

Get Headers for HTTP calls to `/engine/apiv6/me` on `homepage` page in application `v1.0.0`.

```ts
import { defineApplicationVersion, defineApplicationPage, getHeaders } from '@ovh-ux/request-tagger';

defineApplicationVersion('v1.0.0')
defineApplicationPage('homepage');
const headers = getHeaders('/engine/apiv6/me');
// inject headers in http call
```

Add headers overrides based on API url pattern

```ts
import { Header, defineApplicationVersion, defineApplicationPage, getHeaders } from '@ovh-ux/request-tagger';

defineApplicationVersion('v1.0.0')
addHeadersOverride('^/engine/2api/notification', {
  [Header.PAGE]: 'notification-sidebar',
});
defineApplicationPage('homepage');
const headers = getHeaders('/engine/2api/notification');
// inject headers in http call
```
