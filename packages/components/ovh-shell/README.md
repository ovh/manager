# @ovh-ux/shell

The goal of this lib is to provide utilities to communicate with a Shell. It exposes an API for that purpose, it also exposes a list of Plugins you can use with the Shell.

## Table of contents

- [Lib usage](#usage)
- [API Docs](#api)
  - [Shell methods](#shell)
    - [initShell](#initShell)
  - [Plugins API](#plugin)
    - [i18n](#i18n)
    - [routing](#routing)

## Usage

To use this lib, you have to add `@ovh-ux/shell` to your dependencies and then build the package under `packages/components/ovh-shell/`.

The lib is fully tree-shaked, so to import something you just have to import it as an esModule :

```ts
import { shell } from '@ovh-ux/shell';
```

## API

### Shell

#### `initShell`

This method initializes a Shell given an iframe. You can initiate a Shell without an iframe, but keep in mind that the communications will use the `window` object instead of the `iframe.contentWindow` object.

_Example :_

```ts
import { shell } from '@ovh-ux/shell';

const shellApi = shell.initShell(yourIframe);
```

This method inits a shell and returns an API that allows you to communicate with it.

The returned object contains the following methods :

- `emitEvent`(`(eventId: string, data: unknown) => void`) : This method allows to emit a custom event from the Shell.
  - `eventId`: The `name`/`id` of your event.
  - `data`: Contains the data you want to send with your event. It can be everything that can be parsed by the navigator, objects such as callbacks or Promises won't work.

- `registerPlugin`(`(pluginId: string, pluginApi: Record<string, Callback>) => void`): Register a plugin by giving its id and API.
  - `pluginId`: Your plugin `name`/`id`.
  - `pluginAPI`: This is an object that contains your plugin API. An API is basically just multiple callbacks indentified by a string.

*Example of plugin API* :

```js
const api = {
  enablePlugin: () => enable(),
  rename: (newName) => pluginRename(newName),
};
```

- `setPluginAvailability`(`(pluginId: string, availability: boolean) => void`): Toggles plugin availability. If plugin isn't available, shell won't run it.
  - `pluginId`: Your plugin `name`/`id`.
  - `availabilty`: A boolean that sets the availability of a plugin to the desired value.

### Plugin

The lib exposes a set of plugins already ready to use, to save you the time of creating them for each app.
Available plugins :

- i18n
- routing

#### `i18n`

- `getLocale`(`(shell: Shell, environment: Environment) => string`): Given a shell and an environment, returns the current locale of the user.
- `setLocale`(`(locale: string) => void`): Sets new user locale based on given parameter.

*Example :*

```js
import { plugin } from '@ovh-ux/shell';

const i18n = plugin.i18n(shell, environment);

// Get locale
const currentLocale = i18n.getLocale();

// Set locale
i18n.setLocale('en_GB');
```

#### `routing`

- `initRouting`(`iframe: HTMLFrameElement`) : Initializes routing for the manager based on the URL in the iframe.

*Example :*

```js
import { plugin } from '@ovh-ux/shell';

const routingPlugin = plugin.routing;

routingPlugin.initRouting(iframe);
```
