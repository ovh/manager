# µFrontend framework

> Micro frontend framework for OVHcloud applications.

## Installation

```sh
yarn add @ovh-ux/ufrontend
```

## Usage

### Application

For a standalone application, you need to register it using the *registerApplication*
method exported by the *@ovh-ux/ufrontend/application* package. This call acts as a bootstrap
for the application, initializing the micro frontend framework and returning a promise
that will resolve to an initial configuration. See *@ovh-ux/manager-config* for configuration
attributes.

```js
import registerApplication from '@ovh-ux/ufrontend/application';

registerApplication().then(({ config }) => {
  // initialization your application here
});
```

### Fragment

Fragments have a dedicated *registerFragment* method that is exported by the *@ovh-ux/ufrontend/fragment*
package. This method needs to be called in order to initialize, load asynchronously and inject the
fragment at runtime. It returns a promise that resolve with the *parent* element of the fragment and with
the initial configuration object.

Each fragment is identified with a unique identifier, passed when registering the fragment. Please ensure
the uniqueness of the fragment name when registering a new one.


```js
import registerFragment from '@ovh-ux/ufrontend/fragment';

registerFragment('myFragmentId').then(({ parent, config }) => {
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

```js
import { listen } from '@ovh-ux/ufrontend/communication';

const unbind = listen((event) => {
  // handle event here
  // if (event.id === 'foo') { ... }
});

// stop listening
// unbind();
```

Emitting an event

```js
import { emit } from '@ovh-ux/ufrontend/communication';

emit({
  id: 'foo',
  arg: 'bar',
});
```

Emitting with a custom timeout value

```js
import { emit } from '@ovh-ux/ufrontend/communication';

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
