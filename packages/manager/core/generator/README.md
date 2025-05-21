# OMG (@ovh-ux/manager-generator)

> Generate standalone manager applications easily.

## Why?

The monorepo houses four (Web, Dedicated, Cloud and Telecom) large [AngularJS](https://angularjs.org/) applications that has been developed as a [Monolithic application](https://en.wikipedia.org/wiki/Monolithic_application).

We introduce this generator to easily scaffold a bare minimum structure to be able to modularize parts of the large application using our new React stack.

The goal is to facilitate the reusability of the codebase.

## Usage

At the root of the monorepo, simply run:

```sh
$ yarn workspace @ovh-ux/manager-generator run start
$ # or
$ pnpm omg
```

Then choose what you want to generate!

## The app generator

This will scaffold a basic standalone app with:

- shell integration
- tanstack-query enabled
- a basic routing with onboarding, listing and dashboard pages

## License

[BSD-3-Clause](https://github.com/ovh/manager/tree/master/LICENSE) © OVH SAS
