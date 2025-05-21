# Scripts

Our [`package.json`](package.json) houses a collection of [run-scripts](https://docs.npmjs.com/cli/run-script) that we use to maintain, test, build, and publish the OVHcloud Manager, notably:

## Table of Content

<!--lint disable no-shortcut-reference-link no-undefined-references-->
[[toc]]

### Generate a Micro Application

```sh
# `foo` is the name of your micro-application.
$ pnpm generate:uapp

# start the application
$ pnpm && cd packages/manager/apps/foo && pnpm start:dev
```

Now you are able to visit `http://localhost:9000/#!/foo` (route based on the module name).
