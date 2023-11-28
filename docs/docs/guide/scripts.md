# Scripts

Our [`package.json`](package.json) houses a collection of [run-scripts](https://docs.npmjs.com/cli/run-script) that we use to maintain, test, build, and publish the OVHcloud Manager, notably:

## Table of Content

<!--lint disable no-shortcut-reference-link no-undefined-references-->
[[toc]]

### Generate a module (or an Application)

![generate module](/assets/img/generate-module-app.gif)

```sh
# `foo` is the name of your module.
$ yarn run generate:module ./packages/manager/modules/foo

# `foo` is the name of your application.
$ yarn run generate:app ./packages/manager/apps/foo

# `foo` is the name of your micro-application.
$ yarn run generate:uapp

# start the application
$ yarn && cd packages/manager/apps/foo && yarn run start:dev
```

Now you are able to visit `http://localhost:9000/#!/foo` (route based on the module name).
