# sao-ovh-manager-app

> Scaffolding tool for standalone applications.

## Why?

The monorepo houses four (Web, Dedicated, Cloud and Telecom) large [AngularJS](https://angularjs.org/) applications that has been developed as a [Monolithic application](https://en.wikipedia.org/wiki/Monolithic_application).

We introduce this tiny module to easily scaffold a bare minimum structure to be able to modularize parts of the large application.

The goal is to facilitate the reusability of the codebase.

## Usage

Generate an application named `foo`:

```sh
$ yarn run generate:app ./packages/manager/apps/foo
```

[View a demo](https://github.com/ovh/manager/blob/master/DEVELOP.md#generate-module).

## Related

- [sao-ovh-manager-module](https://github.com/ovh/manager/tree/master/packages/manager/tools/sao-ovh-manager-module) - Scaffolding tool for standalone modules.

## License

[BSD-3-Clause](https://github.com/ovh/manager/tree/master/LICENSE) © OVH SAS
