# manager-telecom-spare

Application to test standalone telecom-spare component which allows authorized users to manage the spare of modems and phones.

## Installation

Foremost, you should launch a global installation at the root folder of this repository:

```sh
yarn install
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
# Build the `manager-telecom-spare` workspace and all the nested workspaces in development mode and watch only `manager-telecom-spare` workspace
yarn start:dev
# Build and watch the `manager-telecom-spare` workspace and all the nested workspaces in development mode
yarn start:watch
```

## How to test ?

In a first terminal, go to the telecom-spare app directory
```sh
yarn run start:dev
```

In a second terminal, go to the telecom-spare module directory
```sh
yarn run dev:watch
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh-ux/manager/issues/new) or working on some of the [open issues](https://github.com/ovh-ux/manager/issues), our [contributing guide](CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
