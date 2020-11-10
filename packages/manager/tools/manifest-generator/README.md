# Manifest Generator

> Manifest Generator for OVHcloud Manager.

[![Downloads](https://badgen.net/npm/dt/@ovh-ux/manager-manifest-generator)](https://npmjs.com/package/@ovh-ux/manager-manifest-generator) [![Dependencies](https://badgen.net/david/dep/ovh-ux/manager/packages/manager/tools/manifest-generator)](https://npmjs.com/package/@ovh-ux/manager-manifest-generator?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/manager/packages/manager/tools/manifest-generator)](https://npmjs.com/package/@ovh-ux/manager-manifest-generator?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

## Installation

```sh
yarn global add @ovh-ux/manager-manifest-generator
```

or

```sh
yarn add @ovh-ux/manager-manifest-generator
```

## Usage

### CLI

```sh
manager-manifest-generator --help
Usage: manager-manifest-generator [options] <basePath>

Options:
  -V, --version                output the version number
  --application <application>  application name (default: "application")
  -f, --file <filename>        manifest file name (default: "manifest.json")
  --verbose                    output extra debugging
  -h, --help                   display help for command

```

*Options*

* `-f, --file <filename>`: Define manifest file name
* `--application <application>`: Define application name
* `-V, --version`: Display version number
* `-h, --help`: Display help

*Examples*

To generate a `manifest.json` for `hub` application dist

```sh
$ manager-manifest-generator ./packages/manager/apps/hub/dist
```

To generate a `app.json` for `hub` application dist

```sh
$ manager-manifest-generator ./packages/manager/apps/hub/dist -f app.json
```

To generate a `manifest.json` for `hub` application dist, with name defined to `hub`

```sh
$ manager-manifest-generator ./packages/manager/apps/hub/dist --application hub
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
