## [5.0.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-telecom-task-app@5.0.2...@ovh-ux/manager-telecom-task-app@5.0.3) (2020-03-04)


### Bug Fixes

* **deps:** use latest for @ovh-ux/manager-core ([#2394](https://github.com/ovh/manager/issues/2394)) ([fd0a25b](https://github.com/ovh/manager/commit/fd0a25b11bd5119649daf3b1605bb56bf70f3ff9))



## [5.0.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-telecom-task-app@5.0.1...@ovh-ux/manager-telecom-task-app@5.0.2) (2019-11-22)


### Bug Fixes

* **deps:** upgrade ovh-api-services to v9.27.1 ([fb116c4](https://github.com/ovh/manager/commit/fb116c4a0e9085c71e8fe1266b818f3464e5bc94))



## [5.0.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-telecom-task-app@5.0.0...@ovh-ux/manager-telecom-task-app@5.0.1) (2019-11-15)


### Bug Fixes

* **deps:** upgrade ovh-api-services to v9.26.0 ([#1789](https://github.com/ovh/manager/issues/1789)) ([90361dc](https://github.com/ovh/manager/commit/90361dc945014853db1cf4535e2d5b89b67efbea))



# [5.0.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-telecom-task-app@4.1.3...@ovh-ux/manager-telecom-task-app@5.0.0) (2019-11-13)


### Code Refactoring

* rename `ng-uirouter-title` to `ng-ui-router-title` ([a7631fa](https://github.com/ovh/manager/commit/a7631fac619f9052cac9ab7770bc31b8631b8285))


### BREAKING CHANGES

* module is now named as `ngUiRouterTitle

Signed-off-by: Antoine Leblanc <antoine.leblanc@corp.ovh.com>



## [4.1.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-telecom-task-app@4.1.2...@ovh-ux/manager-telecom-task-app@4.1.3) (2019-10-25)


### Bug Fixes

* bump ovh-ui-angular to v3.9.9 ([#1593](https://github.com/ovh/manager/issues/1593)) ([2ff2f81](https://github.com/ovh/manager/commit/2ff2f813f43453744c5927efc5687a7bb79674e1))



## [4.1.2](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-task-app@4.1.1...@ovh-ux/manager-telecom-task-app@4.1.2) (2019-09-03)


### Bug Fixes

* fix version for tuc ([836fed6](https://github.com/ovh-ux/manager/commit/836fed6))



## [4.1.1](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-task-app@4.1.0...@ovh-ux/manager-telecom-task-app@4.1.1) (2019-08-29)


### Bug Fixes

* **deps:** bump ovh-ui-angular to v3.7.4 ([#1245](https://github.com/ovh-ux/manager/issues/1245)) ([33ba95c](https://github.com/ovh-ux/manager/commit/33ba95c))



# [4.1.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-task-app@4.0.1...@ovh-ux/manager-telecom-task-app@4.1.0) (2019-08-12)


### Features

* **core:** add request-tagger interceptor ([e797d9d](https://github.com/ovh-ux/manager/commit/e797d9d))



## [4.0.1](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-task-app@4.0.0...@ovh-ux/manager-telecom-task-app@4.0.1) (2019-05-13)


### Bug Fixes

* **deps:** upgrade ng-ovh-telecom-universe-components to v3.0.3 ([574ff83](https://github.com/ovh-ux/manager/commit/574ff83))



# [4.0.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-task-app@3.0.0...@ovh-ux/manager-telecom-task-app@4.0.0) (2019-03-19)


### Code Refactoring

* bump all packages to [@ovh-ux](https://github.com/ovh-ux)/manager-core@^5.0.0 ([7cbc70a](https://github.com/ovh-ux/manager/commit/7cbc70a))


### BREAKING CHANGES

* Until theses packages has a dependency to @ovh-ux/manager-core@^5.0.0, the host project needs to import @ovh-ux/manager-config

Before:

yarn add @ovh-ux/manager-core

Now:

yarn add @ovh-ux/manager-config
yarn add @ovh-ux/manager-core



# [3.0.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-task-app@2.0.0...@ovh-ux/manager-telecom-task-app@3.0.0) (2019-03-13)


### Build System

* **deps:** upgrade dependencies ([#252](https://github.com/ovh-ux/manager/issues/252)) ([f87f7b7](https://github.com/ovh-ux/manager/commit/f87f7b7))


### BREAKING CHANGES

* **deps:** replace both `@ovh-ux/ng-ovh-apiv7` and `ovh-angular-swimming-poll` by `@ovh-ux/ng-ovh-api-wrappers` and `@ovh-ux/ng-ovh-swimming-poll`



# [2.0.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-task-app@1.0.0...@ovh-ux/manager-telecom-task-app@2.0.0) (2019-02-26)


### Build System

* **deps:** upgrade ng-ovh-apiv7 to v2.0.0 ([ac6ac62](https://github.com/ovh-ux/manager/commit/ac6ac62))


### BREAKING CHANGES

* **deps:** replace `ovh-angular-apiv7` by `@ovh-ux/ng-ovh-apiv7`



# [1.0.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-task-app@0.1.1...@ovh-ux/manager-telecom-task-app@1.0.0) (2019-01-29)


### Build System

* **deps:** upgrade ng-ovh-telecom-universe-components to v2.0.1 ([3ffc516](https://github.com/ovh-ux/manager/commit/3ffc516))


### BREAKING CHANGES

* **deps:** replace `@ovh-ux/telecom-universe-components` by `@ovh-ux/ng-ovh-telecom-universe-components`



## [0.1.1](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-task-app@0.1.0...@ovh-ux/manager-telecom-task-app@0.1.1) (2019-01-21)


### Bug Fixes

* **telecom-styles:** fix elements using rem ([00c5425](https://github.com/ovh-ux/manager/commit/00c5425))



# [0.1.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-telecom-task-app@0.0.0...@ovh-ux/manager-telecom-task-app@0.1.0) (2019-01-15)


### Features

* add telecom task app ([2b8a05c](https://github.com/ovh-ux/manager/commit/2b8a05c))



