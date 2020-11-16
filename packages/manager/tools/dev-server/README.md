# Manager Dev Server

> Dev server for OVHcloud Manager.

[![Downloads](https://badgen.net/npm/dt/@ovh-ux/manager-dev-server)](https://npmjs.com/package/@ovh-ux/manager-dev-server) [![Dependencies](https://badgen.net/david/dep/ovh-ux/manager/packages/manager/tools/dev-server)](https://npmjs.com/package/@ovh-ux/manager-dev-server?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/manager/packages/manager/tools/dev-server)](https://npmjs.com/package/@ovh-ux/manager-dev-server?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

## Installation

```sh
yarn global add @ovh-ux/manager-dev-server
```

or

```sh
yarn add @ovh-ux/manager-dev-server
```

## Usage

### API

```js
const { defaultConfig } = require('@ovh-ux/manager-dev-server');

console.log(defaultConfig);
// { port: 3000, region: 'eu' }
```

or

```js
const { devServer } = require('@ovh-ux/manager-dev-server');

// start a dev server to serve '.' on region: ca, port: 1234 with local2API
// return an express app
devServer('.', 'ca', '1234', { local2API: true, localRegistry: false });
```


### CLI

#### Help

```sh
manager-dev-server --help
Usage: manager-dev-server <path>

Options:
  -V, --version          output the version number
  -r, --region <region>  Region (EU|CA|US) (default: "eu")
  -p, --port <port>      server port (default: 3000)
  --local2API            Use local2API proxy (localhost:8080)
  --localRegistry        Use localRegistry proxy (localhost:8888)
  -h, --help             output usage information

```

#### Options

* `-V, --version` : Display version number
* `-r, --region <region>` : Region to use (default to `eu` or `REGION` environment variable).
* `-p, --port <port>`: Port (default to `3000`or or `PORT` environment variable)
* `--local2API`: Use local2API proxy (to localhost:8080)
* `--localRegistry`: Use localRegistry proxy (to localhost:8888)
* `-h, --help`: Display help

#### Examples

```sh
$ manager-dev-server ./packages/manager/apps/hub/dist

Serve: ./packages/manager/apps/hub/dist - region: eu - localhost:3000

$ manager-dev-server ./packages/manager/apps/hub/dist -p 1234

Serve: ./packages/manager/apps/hub/dist - region: eu - localhost:1234

$ manager-dev-server ./packages/manager/apps/hub/dist -r ca

Serve: ./packages/manager/apps/hub/dist - region: ca - localhost:3000

$ manager-dev-server ./packages/manager/apps/hub/dist --local2API
[HPM] Proxy created: /  -> http://localhost:8080
[HPM] Proxy rewrite rule created: "^/engine/2api/" ~> "/"
[HPM] Subscribed to http-proxy events: [ 'error', 'close' ]

Serve: ./packages/manager/apps/hub/dist - region: eu - localhost:3000

$ manager-dev-server ./packages/manager/apps/hub/dist -r ca -p 1234 --local2API
[HPM] Proxy created: /  -> http://localhost:8080
[HPM] Proxy rewrite rule created: "^/engine/2api/" ~> "/"
[HPM] Subscribed to http-proxy events: [ 'error', 'close' ]

Serve: ./packages/manager/apps/hub/dist - region: ca - localhost:1234
```

## Related

* [manager-dev-server-config](https://github.com/ovh/manager/tree/master/packages/manager/tools/dev-server-config) - OVHcloud manager shared dev server configuration

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
