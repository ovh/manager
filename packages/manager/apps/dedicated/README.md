# OVH Manager Dedicated

![ovh-manager-web-dedicated](https://user-images.githubusercontent.com/428384/36022099-219b3188-0d88-11e8-9bae-31d593e67e76.png)

> OVH Control Panel Dedicated UI

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

* [ovh-manager-web](https://github.com/ovh/manager/tree/master/packages/manager/apps/web) - OVH Control Panel Web UI
* [ovh-manager-cloud](https://github.com/ovh/manager/tree/master/packages/manager/apps/cloud) - OVH Control Panel Cloud UI
* [ovh-manager-telecom](https://github.com/ovh/manager/tree/master/packages/manager/apps/telecom) - OVH Control Panel Telecom UI

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
