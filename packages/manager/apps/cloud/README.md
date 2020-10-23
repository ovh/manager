# OVH Manager Cloud

![ovh-manager-cloud-banner](https://user-images.githubusercontent.com/428384/45947336-1a5c9280-bff4-11e8-981a-a065002093a6.png)

> OVH Control Panel Cloud UI

## Table of Contents

* [Prerequisites](#prerequisites)
* [Install](#install)
* [Usage](#usage)
* [Test](#test)
* [Related](#related)
* [Contributing](#contributing)
* [License](#license)

## Prerequisites

* Node.js v8+
* Yarn v1.10.0

## Install

```sh
yarn install
```

## Usage

In order to run the manager in the development mode, you first you have to activate the developer mode in the [Manager V6](https://www.ovh.com/manager/dedicated/#/useraccount/advanced).

Once you have enabled the development mode just ran:

```sh
yarn start
```

And now open `http://localhost:9000`.

## Test

```sh
yarn test
```

## Related

* [Web Control Panel UI](https://github.com/ovh/manager/tree/master/packages/manager/apps/web).
* [Dedicated Control Panel UI](https://github.com/ovh/manager/tree/master/packages/manager/apps/dedicated).
* [Telecom Control Panel UI](https://github.com/ovh/manager/tree/master/packages/manager/apps/telecom).

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
