# OVH Manager Development

If you've made it this far, **thank you**! We appreciate your contribution, and hope that this document helps you along the way. If you have any questions or problems, don't hesitate to [file an issue](https://github.com/ovh-ux/manager/issues/new).

## Install

Run `yarn install` to install the npm dependencies.

## Scripts

Our [`package.json`](package.json) houses a collection of [run-scripts](https://docs.npmjs.com/cli/run-script) that we use to maintain, test, build, and publish the OVH Manager, notably:

* `split` runs `scripts/split.js`, which generate a subtree branch (from the current one) for the specified package.

### Split a module

```sh
yarn run split --help
```

![](media/split-module-1.png)

![](media/split-module-2.png)
