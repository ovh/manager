# ovh.github.io/manager

This site is built with [VuePress][]. Site content is written in Markdown format located in `docs`.

## Developing

1. Clone repository

```sh
$ git clone git@github.com:ovh/manager.git
```

2. Install dependencies

```sh
$ pnpm
```

3. Start local development environment

```sh
$ pnpm --filter @ovh-ux/manager-documentation run docs:dev
```

## Deploying

```sh
$ pnpm --filter @ovh-ux/manager-documentation run docs:deploy
```

[vuepress]: https://vuepress.vuejs.org/
