# µFrontend framework

> Micro frontend framework for OVHcloud applications.

## Installation

```sh
yarn add @ovh-ux/ufrontend
```

## Usage

### Application

For a standalone application, you need to register it using the *registerApplication*
method exported by the *@ovh-ux/ufrontend* package. This call acts as a bootstrap
for the application, initializing the micro frontend framework and returning a promise
that will resolve to an initial environment. See *@ovh-ux/manager-config* for environment
attributes.

```ts
import { registerApplication } from '@ovh-ux/ufrontend';

registerApplication('myApplicationName').then(({ environment }) => {
  // initialization your application here
});
```

### Fragment

Fragments have a dedicated *registerFragment* method that is exported by the *@ovh-ux/ufrontend*
package. This method needs to be called in order to initialize, load asynchronously and inject the
fragment at runtime. It returns a promise that resolve with the *parent* element of the fragment and with
the initial environment object.

Each fragment is identified with a unique identifier, passed when registering the fragment. Please ensure
the uniqueness of the fragment name when registering a new one.


```ts
import { registerFragment } from '@ovh-ux/ufrontend';

registerFragment('myFragmentId').then(({ parent, environment }) => {
  // render the fragment on 'parent' element
});
```

#### Integration in application

A fragment is used in an application using a web-component, see example bellow.

```html
<ovh-fragment
  id="myFragmentId"
  version="1.x.x">
</ovh-fragment>
```

There are two mandatory attributes :
* The fragment unique id, corresponding to the one used during the fragment registration.
* The fragment version, following semver syntax. Used to identify which version of the fragment will be dynamically injected into the micro application.

### Communication

Fragments and application can communicate using events. Messages between application and fragments can be exchanged,
but it's also possible to exchange messages between fragments.
Due to the asynchronous nature of the framework, events are given a timeout value.

* Events are alive as long as their timeout does not expire. Whoever is listening during
an event lifetime will receive that event.
* Events are sent once per listener.
* It's possible to unbind a listener (see example).
* When an event timeout expires, the event is discarded and won't be sent anymore.

#### Example

Listening for events

```ts
import { listen } from '@ovh-ux/ufrontend';

const unbind = listen((event) => {
  // handle event here
  // if (event.id === 'foo') { ... }
});

// stop listening
// unbind();
```

Emitting an event

```ts
import { emit } from '@ovh-ux/ufrontend';

emit({
  id: 'foo',
  arg: 'bar',
});
```

Emitting with a custom timeout value

```ts
import { emit } from '@ovh-ux/ufrontend';

emit(
  {
    id: 'foo',
    arg: 'bar',
  },
  {
    timeout: 500, // 500ms timeout
  },
);
```

### URL Builder

URL builder is here to help us to build links between applications.
When you want to build an URL for an outside application, you will use `url-builder` to build the URL.

#### Examples

Build the URL that redirect to `#/catalog` state from the `https://www.ovh.com/manager/` base URL with query parameter (`expand`)

```ts
import { buildURL } from '@ovh-ux/ufrontend';

const url = buildURL('https://www.ovh.com/manager/', '#/catalog', {
  expand: true,
});
// use `url`;
```

Build multiples routes using an array of `{baseURL, path, params}`

```ts
import { buildURLs } from '@ovh-ux/ufrontend';

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
import { buildURLs } from '@ovh-ux/ufrontend';

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
