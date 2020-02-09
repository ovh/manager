# sao-ovh-manager-module

> Scaffolding tool for standalone modules.

## Why?

The monorepo houses four (Web, Dedicated, Cloud and Telecom) large [AngularJS](https://angularjs.org/) applications that has been developed as a [Monolithic application](https://en.wikipedia.org/wiki/Monolithic_application).

We introduce this tiny module to easily scaffold a bare minimum structure to be able to modularize parts of the large application.

The goal is to facilitate the reusability of the codebase.

## Usage

Generate a module named `foo`:

```sh
$ yarn run generate:module ./packages/manager/modules/foo
```

[View a demo](https://ovh.github.io/manager/guide/scripts.html#generate-a-module-or-an-application).

## Related

- [sao-ovh-manager-app](https://github.com/ovh/manager/tree/master/packages/manager/tools/sao-ovh-manager-app) - Scaffolding tool for standalone applications.

## License

[BSD-3-Clause](https://github.com/ovh/manager/tree/master/LICENSE) © OVH SAS
