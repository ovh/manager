# Manager Registry

> Registry for OVHcloud Manager.

[![Downloads](https://badgen.net/npm/dt/@ovh-ux/manager-registry)](https://npmjs.com/package/@ovh-ux/manager-registry) [![Dependencies](https://badgen.net/david/dep/ovh-ux/manager/packages/manager/tools/registry)](https://npmjs.com/package/@ovh-ux/manager-registry?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/manager/packages/manager/tools/registry)](https://npmjs.com/package/@ovh-ux/manager-registry?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

## Installation

```sh
yarn global add @ovh-ux/manager-registry
```

or

```sh
yarn add @ovh-ux/manager-registry
```

## Usage

### CLI

```sh
manager-registry --help
Usage: manager-registry [options] [command]

Options:
  -V, --version          output the version number
  -h, --help             output usage information

Commands:
  dev <fragmentsPath>    Dev server for local fragments
  static <registryPath>  Static registry commands
  help [cmd]             display help for [cmd]

```

*Common Options*

* `-V, --version`: Display version number
* `-h, --help`: Display help

#### Dev

> Help to serve a registry from dev fragments environment

```sh
manager-registry dev --help
Usage: manager-registry-dev [options] <fragmentsPath>

Options:
  -V, --version                          output the version number
  -p, --port <port>                      server port (default: 8888)
  -e, --regexp <pattern>                 filter fragment pattern (default: [])
  --fallbackRegistry <fallbackRegistry>  Fallback server registry url
  -h, --help                             output usage information

```

*Options*

* `-p, --port <port>`: Server port (default: 8888)
* `-e, --regexp <pattern>`: Allows to filter fragments served (multiple allowed)
* `--fallbackRegistry <fallbackRegistry>`: Fallback server registry url

*Examples*

```sh
$ manager-registry dev ./packages/manager/fragments
Serve: ./packages/manager/fragments - localhost:8888

$ manager-registry dev ./packages/manager/fragments -p 1234
Serve: ./packages/manager/fragments - localhost:1234
```

To serve fragments from dev environmment, and fallback missing fragments to another registry:
```sh
$ manager-registry dev ./packages/manager/fragments --fallbackRegistry http://localhost:1234
Serve: ./packages/manager/fragments - localhost:8888
Fallback registry: http://localhost:1234
```


To serve only the `navbar` fragment:
```sh
$ manager-registry dev ./packages/manager/fragments -e navbar
Serve: ./packages/manager/fragments - localhost:8888
```

To serve only fragments with name following `*bar` and `!sidebar` patterns (e.g. `navbar`, `userbar`):
```sh
$ manager-registry dev ./packages/manager/fragments -e '*bar' -e '!sidebar'
Serve: ./packages/manager/fragments - localhost:8888
```

#### Static

> Help to manage a static registry

```sh
manager-registry static --help
Usage: manager-registry-static [options] [command]

Options:
  -V, --version                                   output the version number
  -h, --help                                      output usage information

Commands:
  generate-manifests <registryPath>               Generate manifest for static registry
  serve <registryPath>                            Serve a static registry
  add <registryPath> <fragmentPath>               Add a fragment in static registry
  sync <sourceRegistryPath> <targetRegistryPath>  Sync two registry folders
  help [cmd]                                      display help for [cmd]

```

##### Generate Manifests

> Will generate and write manifest for registry and fragments.

```sh
$ manager-registry static generate-manifests --help
Usage: manager-registry-static-generate-manifests [options] <registryPath>

Options:
  -V, --version                          output the version number
  --fallbackRegistry <fallbackRegistry>  Fallback server registry url
  -h, --help                             output usage information
```

*Options*

* `--fallbackRegistry <fallbackRegistry>`: Fallback server registry url

*Examples*

```sh
$ manager-registry static generate-manifests ./path/to/static/registry
Manifests are generated for static registry in ./path/to/static/registry
```

To generate manifests with static fragments and fallback registry informations:

```sh
$ manager-registry static generate-manifests ./path/to/static/registry --fallbackRegistry http://localhost:1234
Manifests are generated for static registry in ./path/to/static/registry with fallback informations from http://localhost:1234
```


##### Serve

> Will serve a static registry

```sh
$ manager-registry static serve --help
Usage: manager-registry-static-serve [options] <registryPath>

Options:
  -V, --version      output the version number
  -p, --port <port>  server port (default: 8888)
  -h, --help         output usage information
```

*Examples*

```sh
$ manager-registry static serve ./path/to/static/registry -p 1234
Serve: ./path/to/static/registry - localhost:1234
```

##### Add fragment

> Add a fragment dist to a static registry

```sh
$ manager-registry static add --help
Usage: manager-registry-static-add [options] <registryPath> <fragmentPath>

Options:
  -V, --version  output the version number
  -h, --help     output usage information
```

*Examples*

Add a fragment dist (containing a `manifest.json`) in a static registry:

```sh
$ manager-registry static add ./path/to/static/registry ./path/to/fragment/dist
Fragment "fragment@1.0.O" added in registry ./path/to/static/registry
```

Trying to add an existant fragment version in a static registry:

```sh
$ manager-registry static add ./path/to/static/registry ./path/to/fragment/dist
Fragment "fragment@1.0.O" already exists in ./path/to/static/registry
```

##### Sync registry

> Sync two registry directories (will add missing fragment from source to target directory)

```sh
$ manager-registry static sync --help
Usage: manager-registry-static-sync [options] <sourceRegistryPath> <targetRegistryPath>

Options:
  -V, --version  output the version number
  -h, --help     output usage information
```

*Example*

Sync a static registry with an another existing static registry

```sh
$ manager-registry static sync ./path/to/static/registry ./path/to/another/static/registry
Fragment "fragment@1.0.O" added in registry ./path/to/another/static/registry
```

## Related

* [dev-server-config](https://github.com/ovh/manager/tree/master/packages/manager/tools/dev-server-config) - OVHcloud manager shared dev server configuration

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
