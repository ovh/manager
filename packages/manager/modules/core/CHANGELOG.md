# [6.0.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-core@5.3.1...@ovh-ux/manager-core@6.0.0) (2019-06-18)


### Code Refactoring

* remove otrs configuration from core ([#871](https://github.com/ovh-ux/manager/issues/871)) ([5ccf535](https://github.com/ovh-ux/manager/commit/5ccf535))


### BREAKING CHANGES

* Remove OTRS dependency in @ovh-ux/manager-core



## [5.3.1](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-core@5.3.0...@ovh-ux/manager-core@5.3.1) (2019-06-17)


### Bug Fixes

* **core:** add missing clipboard component translations ([#861](https://github.com/ovh-ux/manager/issues/861)) ([3013eb2](https://github.com/ovh-ux/manager/commit/3013eb2))



# [5.3.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-core@5.2.5...@ovh-ux/manager-core@5.3.0) (2019-06-14)


### Features

* allow trailing slashes in url ([#843](https://github.com/ovh-ux/manager/issues/843)) ([d885a22](https://github.com/ovh-ux/manager/commit/d885a22))



## [5.2.5](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-core@5.2.4...@ovh-ux/manager-core@5.2.5) (2019-05-21)


### Bug Fixes

* **i18n:** add missing translations ([2326761](https://github.com/ovh-ux/manager/commit/2326761))



## [5.2.4](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-core@5.2.3...@ovh-ux/manager-core@5.2.4) (2019-05-20)


### Bug Fixes

* **i18n:** add missing translations ([7ef3b3f](https://github.com/ovh-ux/manager/commit/7ef3b3f))



## [5.2.3](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-core@5.2.2...@ovh-ux/manager-core@5.2.3) (2019-05-17)


### Bug Fixes

* **i18n:** add missing translations ([78a4159](https://github.com/ovh-ux/manager/commit/78a4159))



## [5.2.2](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-core@5.2.1...@ovh-ux/manager-core@5.2.2) (2019-05-15)


### Bug Fixes

* **i18n:** add missing translations ([80eea5b](https://github.com/ovh-ux/manager/commit/80eea5b))



## [5.2.1](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-core@5.2.0...@ovh-ux/manager-core@5.2.1) (2019-05-14)


### Bug Fixes

* **i18n:** add missing translations ([471503c](https://github.com/ovh-ux/manager/commit/471503c))



# [5.2.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-core@5.1.0...@ovh-ux/manager-core@5.2.0) (2019-05-09)


### Bug Fixes

* **i18n:** add missing translations ([0568a65](https://github.com/ovh-ux/manager/commit/0568a65))


### Features

* **core.translate:** set oui translations once they are loaded ([104643a](https://github.com/ovh-ux/manager/commit/104643a))
* add otrs module ([7469919](https://github.com/ovh-ux/manager/commit/7469919))



# [5.1.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-core@5.0.0...@ovh-ux/manager-core@5.1.0) (2019-05-07)


### Features

* **core:** add oui-file translations ([#432](https://github.com/ovh-ux/manager/issues/432)) ([d821dc8](https://github.com/ovh-ux/manager/commit/d821dc8))
* **navbar:** add managers navbar ([cb13bfb](https://github.com/ovh-ux/manager/commit/cb13bfb))
* **storages.volume-snapshots:** add volume-snapshots list ([#359](https://github.com/ovh-ux/manager/issues/359)) ([c8a63fd](https://github.com/ovh-ux/manager/commit/c8a63fd))



# [5.0.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-core@5.0.0-alpha.0...@ovh-ux/manager-core@5.0.0) (2019-03-19)


### Bug Fixes

* replace TARGET by coreConfig ([928a6f4](https://github.com/ovh-ux/manager/commit/928a6f4))



# [5.0.0-alpha.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-core@4.0.1...@ovh-ux/manager-core@5.0.0-alpha.0) (2019-03-19)


### Features

* replace TARGET by [@ovh-ux](https://github.com/ovh-ux)/manager-config environment service ([355cede](https://github.com/ovh-ux/manager/commit/355cede))


### BREAKING CHANGES

* host project should import @ovh-ux/manager-config

Until this package uses @ovh-ux/manager-config, the host project should import @ovh-ux/manager-config, as following:

Before:

yarn add @ovh-ux/manager-core

After:

yarn add @ovh-ux/manager-config
yarn add @ovh-ux/manager-core



## [4.0.1](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-core@4.0.0...@ovh-ux/manager-core@4.0.1) (2019-03-13)


### Bug Fixes

* **manager-core:** add missing peerDeps ngOvhSwimmingPoll ([6e3df1f](https://github.com/ovh-ux/manager/commit/6e3df1f))



# [4.0.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-core@3.0.0...@ovh-ux/manager-core@4.0.0) (2019-03-13)


### Build System

* **deps:** upgrade dependencies ([#252](https://github.com/ovh-ux/manager/issues/252)) ([f87f7b7](https://github.com/ovh-ux/manager/commit/f87f7b7))


### BREAKING CHANGES

* **deps:** replace both `@ovh-ux/ng-ovh-apiv7` and `ovh-angular-swimming-poll` by `@ovh-ux/ng-ovh-api-wrappers` and `@ovh-ux/ng-ovh-swimming-poll`



# [3.0.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-core@2.0.0...@ovh-ux/manager-core@3.0.0) (2019-02-26)


### Build System

* **deps:** upgrade ng-ovh-apiv7 to v2.0.0 ([ac6ac62](https://github.com/ovh-ux/manager/commit/ac6ac62))


### BREAKING CHANGES

* **deps:** replace `ovh-angular-apiv7` by `@ovh-ux/ng-ovh-apiv7`



# [2.0.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-core@1.2.0...@ovh-ux/manager-core@2.0.0) (2019-01-29)


### Build System

* **deps:** upgrade ng-ovh-http to v4.0.1-beta.0 ([b2e4388](https://github.com/ovh-ux/manager/commit/b2e4388))
* **deps:** upgrade ng-ovh-sso-auth to v4.0.0-beta.0 ([8acac96](https://github.com/ovh-ux/manager/commit/8acac96))
* **deps:** upgrade ng-translate-async-loader to v2.0.0 ([40e8ea7](https://github.com/ovh-ux/manager/commit/40e8ea7))


### BREAKING CHANGES

* **deps:** replace `@ovh-ux/translate-async-loader` by `@ovh-ux/ng-translate-async-loader`
* **deps:** replace `ovh-angular-sso-auth` by `@ovh-ux/ng-ovh-sso-auth`
* **deps:** replace `ovh-angular-http` by `@ovh-ux/ng-ovh-http`



# [1.2.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-core@1.1.2...@ovh-ux/manager-core@1.2.0) (2019-01-15)


### Features

* **core:** add ovh-ui-angular translations ([a5adff5](https://github.com/ovh-ux/manager/commit/a5adff5))
* **core:** add sso config for ws servicetype ([906528d](https://github.com/ovh-ux/manager/commit/906528d))



## [1.1.2](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-core@1.1.1...@ovh-ux/manager-core@1.1.2) (2019-01-10)



## [1.1.1](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-core@1.1.0...@ovh-ux/manager-core@1.1.1) (2019-01-03)


### Bug Fixes

* rework imports to improve standalone modules ([9cdabab](https://github.com/ovh-ux/manager/commit/9cdabab))



# [1.1.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-core@1.1.0-alpha.0...@ovh-ux/manager-core@1.1.0) (2018-12-12)


### Bug Fixes

* **core:** update ngInject annotations ([bb989b6](https://github.com/ovh-ux/manager/commit/bb989b6))


### Features

* **core:** add translation configuration ([d71117f](https://github.com/ovh-ux/manager/commit/d71117f))


### Performance Improvements

* **lodash:** avoid importing global lodash ([294b3f7](https://github.com/ovh-ux/manager/commit/294b3f7))



# [1.0.0-alpha.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-core@0.0.0...@ovh-ux/manager-core@1.0.0-alpha.0) (2018-11-26)



