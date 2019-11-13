# [5.0.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-telecom-dashboard@4.4.1...@ovh-ux/manager-telecom-dashboard@5.0.0) (2019-11-13)


### Code Refactoring

* rename `ng-uirouter-title` to `ng-ui-router-title` ([a7631fa](https://github.com/ovh/manager/commit/a7631fac619f9052cac9ab7770bc31b8631b8285))


### BREAKING CHANGES

* module is now named as `ngUiRouterTitle

Signed-off-by: Antoine Leblanc <antoine.leblanc@corp.ovh.com>



## [4.4.1](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-dashboard@4.4.0...@ovh-ux/manager-telecom-dashboard@4.4.1) (2019-10-17)


### Bug Fixes

* **deps:** upgrade @ovh-ux/component-rollup-config to v7.0.0 ([#1469](https://github.com/ovh-ux/manager/issues/1469)) ([bbc8794](https://github.com/ovh-ux/manager/commit/bbc8794))



# [4.4.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-dashboard@4.3.2...@ovh-ux/manager-telecom-dashboard@4.4.0) (2019-09-10)


### Features

* **telecom-dashboard:** add manager banner ([2ffa978](https://github.com/ovh-ux/manager/commit/2ffa978))



## [4.3.2](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-dashboard@4.3.1...@ovh-ux/manager-telecom-dashboard@4.3.2) (2019-07-22)


### Bug Fixes

* **i18n:** add missing translations ([7c2c4b3](https://github.com/ovh-ux/manager/commit/7c2c4b3))



## [4.3.1](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-dashboard@4.3.0...@ovh-ux/manager-telecom-dashboard@4.3.1) (2019-07-15)


### Bug Fixes

* bump lodash to version >= 4.17.14 ([#1072](https://github.com/ovh-ux/manager/issues/1072)) ([1a32ddc](https://github.com/ovh-ux/manager/commit/1a32ddc))
* **i18n:** add missing translations ([7ef1ec1](https://github.com/ovh-ux/manager/commit/7ef1ec1))
* **i18n:** add missing translations ([c1ad6af](https://github.com/ovh-ux/manager/commit/c1ad6af))



# [4.3.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-dashboard@4.2.2...@ovh-ux/manager-telecom-dashboard@4.3.0) (2019-07-05)


### Features

* add new packages ([09b5158](https://github.com/ovh-ux/manager/commit/09b5158))



## [4.2.2](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-dashboard@4.2.1...@ovh-ux/manager-telecom-dashboard@4.2.2) (2019-06-12)


### Bug Fixes

* **telecom.dashboard:** correct reference to the vip status ([d328547](https://github.com/ovh-ux/manager/commit/d328547))



## [4.2.1](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-dashboard@4.2.0...@ovh-ux/manager-telecom-dashboard@4.2.1) (2019-05-13)


### Bug Fixes

* **deps:** upgrade ng-ovh-telecom-universe-components to v3.0.3 ([574ff83](https://github.com/ovh-ux/manager/commit/574ff83))



# [4.2.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-dashboard@4.1.0...@ovh-ux/manager-telecom-dashboard@4.2.0) (2019-05-07)


### Features

* **storages.volume-snapshots:** add volume-snapshots list ([#359](https://github.com/ovh-ux/manager/issues/359)) ([c8a63fd](https://github.com/ovh-ux/manager/commit/c8a63fd))



# [4.1.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-dashboard@4.0.0...@ovh-ux/manager-telecom-dashboard@4.1.0) (2019-03-22)


### Features

* **pci:** add @ovh-ux/manager-pci package ([#230](https://github.com/ovh-ux/manager/issues/230)) ([9c36a75](https://github.com/ovh-ux/manager/commit/9c36a75))



# [4.0.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-dashboard@3.0.0...@ovh-ux/manager-telecom-dashboard@4.0.0) (2019-03-19)


### Code Refactoring

* bump all packages to [@ovh-ux](https://github.com/ovh-ux)/manager-core@^5.0.0 ([7cbc70a](https://github.com/ovh-ux/manager/commit/7cbc70a))


### BREAKING CHANGES

* Until theses packages has a dependency to @ovh-ux/manager-core@^5.0.0, the host project needs to import @ovh-ux/manager-config

Before:

yarn add @ovh-ux/manager-core

Now:

yarn add @ovh-ux/manager-config
yarn add @ovh-ux/manager-core



# [3.0.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-dashboard@2.0.0...@ovh-ux/manager-telecom-dashboard@3.0.0) (2019-03-14)


### Build System

* **deps:** upgrade ng-at-internet to v4.0.0 ([#265](https://github.com/ovh-ux/manager/issues/265)) ([e89e179](https://github.com/ovh-ux/manager/commit/e89e179))


### BREAKING CHANGES

* **deps:** replace `ng-at-internet` by `@ovh-ux/ng-at-internet`



# [2.0.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-dashboard@1.0.0...@ovh-ux/manager-telecom-dashboard@2.0.0) (2019-03-13)


### Build System

* **deps:** upgrade dependencies ([#252](https://github.com/ovh-ux/manager/issues/252)) ([f87f7b7](https://github.com/ovh-ux/manager/commit/f87f7b7))


### BREAKING CHANGES

* **deps:** replace both `@ovh-ux/ng-ovh-apiv7` and `ovh-angular-swimming-poll` by `@ovh-ux/ng-ovh-api-wrappers` and `@ovh-ux/ng-ovh-swimming-poll`



# [1.0.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-dashboard@0.1.1...@ovh-ux/manager-telecom-dashboard@1.0.0) (2019-01-29)


### Build System

* **deps:** upgrade ng-ovh-telecom-universe-components to v2.0.1 ([3ffc516](https://github.com/ovh-ux/manager/commit/3ffc516))


### BREAKING CHANGES

* **deps:** replace `@ovh-ux/telecom-universe-components` by `@ovh-ux/ng-ovh-telecom-universe-components`



## [0.1.1](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-dashboard@0.1.0...@ovh-ux/manager-telecom-dashboard@0.1.1) (2019-01-23)


### Bug Fixes

* **telecom-dashboard:** lint scripts entries to fix package main entry ([4bdd422](https://github.com/ovh-ux/manager/commit/4bdd422))



# [0.1.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-dashboard@0.0.0...@ovh-ux/manager-telecom-dashboard@0.1.0) (2019-01-21)


### Bug Fixes

* **telecom dashboard:** update LICENCE ([0423a9d](https://github.com/ovh-ux/manager/commit/0423a9d))
* **telecom-dashboard:** code review ([ce9697a](https://github.com/ovh-ux/manager/commit/ce9697a))
* **telecom-dashboard:** imports ([a6ae3c7](https://github.com/ovh-ux/manager/commit/a6ae3c7))
* **telecom-dashboard:** use litteral string for imports ([42461db](https://github.com/ovh-ux/manager/commit/42461db))
* **telecom-styles:** fix elements using rem ([00c5425](https://github.com/ovh-ux/manager/commit/00c5425))


### Features

* telecom dashboard wip ([61bd4f3](https://github.com/ovh-ux/manager/commit/61bd4f3))
* **telecom-dashboard:** wip ([8370234](https://github.com/ovh-ux/manager/commit/8370234))



