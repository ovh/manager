# @ovh-ux/shell

The goal of this lib is to provide utilities to communicate with a Shell. It exposes an API for that purpose, it also exposes a list of Plugins you can use with the Shell.

## Table of contents

- [Lib usage](#usage)
- [API Docs](#api)
  - [Shell methods](#shell)
    - [initShell](#initShell)
  - [Plugins API](#plugins)
    - [i18n](#i18n)
    - [routing](#routing)
    - [auth](#auth)
    - [ux](#ux)
    - [tracking](#tracking)
    - [navigation](#navigation)

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

```ts
const api = {
  enablePlugin: () => enable(),
  rename: (newName) => pluginRename(newName),
};
```

- `setPluginAvailability`(`(pluginId: string, availability: boolean) => void`): Toggles plugin availability. If plugin isn't available, shell won't run it.
  - `pluginId`: Your plugin `name`/`id`.
  - `availabilty`: A boolean that sets the availability of a plugin to the desired value.

### Plugins

The lib exposes a set of plugins already ready to use, to save you the time of creating them for each app.
Available plugins :

- i18n
- routing
- auth
- ux
- tracking
- navigation

#### `i18n`

- `getLocale`(`(shell: Shell, environment: Environment) => string`): Given a shell and an environment, returns the current locale of the user.
- `setLocale`(`(locale: string) => void`): Sets new user locale based on given parameter.

*Example :*

```ts
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

```ts
import { plugin } from '@ovh-ux/shell';

const routingPlugin = plugin.routing;

routingPlugin.initRouting(iframe);
```

#### `auth`

- `login()`: Login to the manager.
- `logout()`: Logout from the manager.

*Example :*

```ts
import { plugin } from '@ovh-ux/shell';

const { auth } = plugin;

auth.login();
auth.logout();
```

#### `ux`

This plugin handles everything that is UI related, such as elements shown or hidden, the state or position of certain elements etc.
Currently, it handles the state of the account sidebar, notifications sidebar and verifies cookie verification for the ssoAuthModal.

- `isAccountSidebarVisible`:(`() => boolean`) : Returns if Account Sidebar is shown or not.
- `isNotificationsSidebarVisible`:(`() => boolean`)
- `showAccountSidebar`:(`() => void`)
- `hideAccountSidebar`:(`() => void`)
- `enableAccountSidebarVisibilityToggle`:(`() => void`) : Allow the visibility of the sidebar to be toggled. If it is disabled, you won't be able to open or close the sidebar.
- `disableAccountSidebarVisibilityToggle`:(`() => void`) : Same logic as the previous function.
- `toggleNotificationsSidebarVisibility`:(`() => void`)
- `toggleAccountSidebarVisibility`:(`() => void`)
- `getUserIdCookie`: (`() => string`): Returns the latest value of `USER_ID` cookie.
- `getSSOAuthModalMode`:(`(oldUserID: string) => string`): Returns the mode in which the SSOAuth Modal is in. Three possible values : 'CONNECTED_TO_DISCONNECTED', 'DISCONNECTED_TO_CONNECTED', 'CONNECTED_TO_OTHER'.

*Example :*

```ts
import { plugin } from '@ovh-ux/shell';

const { ux } = plugin;

ux.showAccountSidebar();
```

#### `tracking`

The tracking API exposes everything that the library `ovh-at-internet` exposes with the same signature.
So basically, you can use all the functions exposed by `ovh-at-internet` the same way via this plugin.

*Example :*

```ts
import { plugin } from '@ovh-ux/shell';

const { tracking } = plugin;
const pageData: PageData = { /* Your data */ };

tracking.trackPage(pageData);
```

#### `navigation`

The navigation plugin allows you to navigate within the container. You can use to navigate to an another app or to an external link for example.

- `getURL`: (`(application: ApplicationId, path: string, params: Record<string, string | number | boolean>) => string`) : Returns a calculated URL of where you want to go.
- `navigateTo`: (`(application: ApplicationId,path: string,params: Record<string, string | number | boolean>,options: navigationOptions) => PromiseLike<void>`): Handles navigation between apps.
