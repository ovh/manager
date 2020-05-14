# manager-enterprise-cloud-database

## Install

```sh
yarn add @ovh-ux/manager-enterprise-cloud-database
```

## Usage

```js
import 'angular';
import managerEnterpriseCloudDatabase from '@ovh-ux/manager-enterprise-cloud-database';

angular.module('myApp', [managerEnterpriseCloudDatabase]);
```

## Build

```sh
# Build in production mode
yarn start
```

## Development

If you want to contribute to the project, follow theses instructions:

Foremost, you should launch a global installation at the root folder of this repository:

```sh
yarn install
```

Then you just have to start the project in development mode. For this, two choices are possible according to your needs:

```sh
# Build the `manager-enterprise-cloud-database` workspace and all the nested workspaces in development mode and watch only `manager-enterprise-cloud-database` workspace
yarn start:dev
# Build and watch the `manager-enterprise-cloud-database` workspace and all the nested workspaces in development mode
yarn start:watch
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
