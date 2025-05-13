# OVH Manager Web

![ovh-manager-web-banner](https://user-images.githubusercontent.com/428384/29673217-d57c0e30-88ee-11e7-843d-f787a17ee2e8.png)

> OVH Control Panel Web UI

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

* [ovh-manager-dedicated](https://github.com/ovh/manager/tree/master/packages/manager/apps/dedicated) - OVH Control Panel Dedicated UI
* [ovh-manager-cloud](https://github.com/ovh/manager/tree/master/packages/manager/apps/cloud) - OVH Control Panel Cloud UI
* [ovh-manager-telecom](https://github.com/ovh/manager/tree/master/packages/manager/apps/telecom) - OVH Control Panel Telecom UI
* [ovh-module-emailpro](https://github.com/ovh/manager/tree/master/packages/manager/modules/emailpro) - Web Module Emailpro
* [ovh-module-exchange](https://github.com/ovh/manager/tree/master/packages/manager/modules/exchange) - Web Module Exchange
* [ovh-module-office](https://github.com/ovh/manager/tree/master/packages/manager/modules/office) - Web Module Office
* [ovh-module-sharepoint](https://github.com/ovh/manager/tree/master/packages/manager/modules/sharepoint) - Web Module Sharepoint

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
