# URL Builder

> OVHcloud manager URL Builder

## Installation

```sh
pnpm add @ovh-ux/url-builder
```

## Usage

URL builder is here to help us to build links between applications.
When you want to build an URL for an outside application, you will use `url-builder` to build the URL.

### Examples

Build the URL that redirect to `#/catalog` state from the `https://www.ovh.com/manager/` base URL with query parameter (`expand`)

```ts
import { buildURL } from '@ovh-ux/url-builder';

const url = buildURL('https://www.ovh.com/manager/', '#/catalog', {
  expand: true,
});
// use `url`;
```

Build multiples routes using an array of `{baseURL, path, params}`

```ts
import { buildURLs } from '@ovh-ux/url-builder';

const [dashboard, catalog] = buildURLs([
  {
    baseURL: 'https://www.ovh.com/manager/',
    path: '#/',
    params: { expand: true },
  },
  { baseURL: 'https://www.ovh.com/manager/', path: '#/catalog' },
]);
// use `dashboard` and `catalog` URLs
```

Build multiples routes using an object of `{baseURL, path, params}`

```ts
import { buildURLs } from '@ovh-ux/url-builder';

const { dashboard, catalog } = buildURLs({
  dashboard: {
    baseURL: 'https://www.ovh.com/manager/',
    path: '#/',
    params: { expand: true },
  },
  catalog: { baseURL: 'https://www.ovh.com/manager/', path: '#/catalog' },
  emailDomainProducts: {
    baseURL: 'https://www.ovh.com/manager/',
    path: '#/:product',
    params: { product: 'email_domain' },
  },
});
// use `dashboard` and `catalog` URLs
```
