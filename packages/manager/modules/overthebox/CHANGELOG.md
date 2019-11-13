# [5.0.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-overthebox@4.3.4...@ovh-ux/manager-overthebox@5.0.0) (2019-11-13)


### Code Refactoring

* rename `ng-uirouter-title` to `ng-ui-router-title` ([a7631fa](https://github.com/ovh/manager/commit/a7631fac619f9052cac9ab7770bc31b8631b8285))


### BREAKING CHANGES

* module is now named as `ngUiRouterTitle

Signed-off-by: Antoine Leblanc <antoine.leblanc@corp.ovh.com>



## [4.3.4](https://github.com/ovh/manager/compare/@ovh-ux/manager-overthebox@4.3.3...@ovh-ux/manager-overthebox@4.3.4) (2019-10-24)


### Bug Fixes

* set a custom port for OTB remote access works now correctly ([ca912c7](https://github.com/ovh/manager/commit/ca912c7a17e6a9863943bbec32dde886d16d84c8))



## [4.3.3](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-overthebox@4.3.2...@ovh-ux/manager-overthebox@4.3.3) (2019-10-17)


### Bug Fixes

* **deps:** upgrade @ovh-ux/component-rollup-config to v7.0.0 ([#1469](https://github.com/ovh-ux/manager/issues/1469)) ([bbc8794](https://github.com/ovh-ux/manager/commit/bbc8794))



## [4.3.2](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-overthebox@4.3.1...@ovh-ux/manager-overthebox@4.3.2) (2019-09-03)


### Bug Fixes

* fix version for tuc ([836fed6](https://github.com/ovh-ux/manager/commit/836fed6))



## [4.3.1](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-overthebox@4.3.0...@ovh-ux/manager-overthebox@4.3.1) (2019-07-15)


### Bug Fixes

* bump lodash to version >= 4.17.14 ([#1072](https://github.com/ovh-ux/manager/issues/1072)) ([1a32ddc](https://github.com/ovh-ux/manager/commit/1a32ddc))



# [4.3.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-overthebox@4.2.3...@ovh-ux/manager-overthebox@4.3.0) (2019-07-05)


### Features

* add new packages ([09b5158](https://github.com/ovh-ux/manager/commit/09b5158))



## [4.2.3](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-overthebox@4.2.2...@ovh-ux/manager-overthebox@4.2.3) (2019-06-12)


### Bug Fixes

* **i18n:** add missing translations ([674cabc](https://github.com/ovh-ux/manager/commit/674cabc))



## [4.2.2](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-overthebox@4.2.1...@ovh-ux/manager-overthebox@4.2.2) (2019-05-14)


### Bug Fixes

* **i18n:** add missing translations ([471503c](https://github.com/ovh-ux/manager/commit/471503c))



## [4.2.1](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-overthebox@4.2.0...@ovh-ux/manager-overthebox@4.2.1) (2019-05-13)


### Bug Fixes

* **deps:** upgrade ng-ovh-telecom-universe-components to v3.0.3 ([574ff83](https://github.com/ovh-ux/manager/commit/574ff83))



# [4.2.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-overthebox@4.1.0...@ovh-ux/manager-overthebox@4.2.0) (2019-05-07)


### Bug Fixes

* **i18n:** add missing translations ([20c33e1](https://github.com/ovh-ux/manager/commit/20c33e1))


### Features

* **storages.volume-snapshots:** add volume-snapshots list ([#359](https://github.com/ovh-ux/manager/issues/359)) ([c8a63fd](https://github.com/ovh-ux/manager/commit/c8a63fd))



# [4.1.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-overthebox@4.0.0...@ovh-ux/manager-overthebox@4.1.0) (2019-03-22)


### Features

* **pci:** add @ovh-ux/manager-pci package ([#230](https://github.com/ovh-ux/manager/issues/230)) ([9c36a75](https://github.com/ovh-ux/manager/commit/9c36a75))



# [4.0.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-overthebox@3.0.0...@ovh-ux/manager-overthebox@4.0.0) (2019-03-19)


### Code Refactoring

* bump all packages to [@ovh-ux](https://github.com/ovh-ux)/manager-core@^5.0.0 ([7cbc70a](https://github.com/ovh-ux/manager/commit/7cbc70a))


### BREAKING CHANGES

* Until theses packages has a dependency to @ovh-ux/manager-core@^5.0.0, the host project needs to import @ovh-ux/manager-config

Before:

yarn add @ovh-ux/manager-core

Now:

yarn add @ovh-ux/manager-config
yarn add @ovh-ux/manager-core



# [3.0.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-overthebox@2.0.1...@ovh-ux/manager-overthebox@3.0.0) (2019-03-13)


### Build System

* **deps:** upgrade dependencies ([#252](https://github.com/ovh-ux/manager/issues/252)) ([f87f7b7](https://github.com/ovh-ux/manager/commit/f87f7b7))


### BREAKING CHANGES

* **deps:** replace both `@ovh-ux/ng-ovh-apiv7` and `ovh-angular-swimming-poll` by `@ovh-ux/ng-ovh-api-wrappers` and `@ovh-ux/ng-ovh-swimming-poll`



## [2.0.1](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-overthebox@2.0.0...@ovh-ux/manager-overthebox@2.0.1) (2019-02-28)


### Bug Fixes

* **i18n:** add missing translations ([1c99f17](https://github.com/ovh-ux/manager/commit/1c99f17))
* **i18n:** add missing translations ([701d753](https://github.com/ovh-ux/manager/commit/701d753))



# [2.0.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-overthebox@1.1.5...@ovh-ux/manager-overthebox@2.0.0) (2019-01-29)


### Build System

* **deps:** upgrade ng-ovh-telecom-universe-components to v2.0.1 ([3ffc516](https://github.com/ovh-ux/manager/commit/3ffc516))
* **deps:** upgrade ng-translate-async-loader to v2.0.0 ([40e8ea7](https://github.com/ovh-ux/manager/commit/40e8ea7))


### BREAKING CHANGES

* **deps:** replace `@ovh-ux/translate-async-loader` by `@ovh-ux/ng-translate-async-loader`
* **deps:** replace `@ovh-ux/telecom-universe-components` by `@ovh-ux/ng-ovh-telecom-universe-components`



## [1.1.5](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-overthebox@1.1.4...@ovh-ux/manager-overthebox@1.1.5) (2019-01-21)


### Bug Fixes

* **overthebox:** retrieve i18n translations ([cbfc8bb](https://github.com/ovh-ux/manager/commit/cbfc8bb))
* **telecom-styles:** fix elements using rem ([00c5425](https://github.com/ovh-ux/manager/commit/00c5425))



## [1.1.4](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-overthebox@1.1.3...@ovh-ux/manager-overthebox@1.1.4) (2019-01-17)


### Bug Fixes

* **overthebox:** add serviceName in updateName event ([f471fad](https://github.com/ovh-ux/manager/commit/f471fad))



## [1.1.3](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-overthebox@1.1.2...@ovh-ux/manager-overthebox@1.1.3) (2019-01-17)


### Bug Fixes

* **overthebox:** add missing ng-ovh-contracts dependency ([6f61f65](https://github.com/ovh-ux/manager/commit/6f61f65))



## [1.1.2](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-overthebox@1.1.1...@ovh-ux/manager-overthebox@1.1.2) (2019-01-17)


### Bug Fixes

* use new component to display contracts ([f0e0a1b](https://github.com/ovh-ux/manager/commit/f0e0a1b))
* **overthebox:** add warning module ([3d5328c](https://github.com/ovh-ux/manager/commit/3d5328c))
* **overthebox-app:** update tests ([b372189](https://github.com/ovh-ux/manager/commit/b372189))



## [1.1.1](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-overthebox@1.1.0...@ovh-ux/manager-overthebox@1.1.1) (2019-01-10)



# [1.1.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-overthebox@1.0.0...@ovh-ux/manager-overthebox@1.1.0) (2019-01-03)


### Bug Fixes

* rework imports to improve standalone modules ([9cdabab](https://github.com/ovh-ux/manager/commit/9cdabab))
* use [@ovh-ux](https://github.com/ovh-ux)/manager-telecom-styles ([d9d6f3f](https://github.com/ovh-ux/manager/commit/d9d6f3f))


### Features

* add new worspace to test overTheBox module in standalone ([b6ec049](https://github.com/ovh-ux/manager/commit/b6ec049))



# [1.0.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-overthebox@1.0.0-alpha.2...@ovh-ux/manager-overthebox@1.0.0) (2018-12-12)


### Bug Fixes

* add missing dependencies ([adb3e60](https://github.com/ovh-ux/manager/commit/adb3e60))
* update ng-uirouter-title usage ([440fbc5](https://github.com/ovh-ux/manager/commit/440fbc5))
* **i18n:** add missing translations ([dbc8faa](https://github.com/ovh-ux/manager/commit/dbc8faa))
* **overthebox:** add [@ovh-ux](https://github.com/ovh-ux)/manager-core dependency ([ae14632](https://github.com/ovh-ux/manager/commit/ae14632))
* **overthebox:** add missing modify translation ([#52](https://github.com/ovh-ux/manager/issues/52)) ([5f42bf8](https://github.com/ovh-ux/manager/commit/5f42bf8))


### Features

* add lazyload on multiple components and styles ([abb6047](https://github.com/ovh-ux/manager/commit/abb6047))


### Performance Improvements

* **lodash:** avoid importing global lodash ([294b3f7](https://github.com/ovh-ux/manager/commit/294b3f7))



# [1.0.0-alpha.2](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-overthebox@1.0.0-alpha.1...@ovh-ux/manager-overthebox@1.0.0-alpha.2) (2018-12-05)


### Bug Fixes

* **overthebox:** add [@ovh-ux](https://github.com/ovh-ux)/manager-core dependency ([4a80a8c](https://github.com/ovh-ux/manager/commit/4a80a8c))



# [1.0.0-alpha.1](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-overthebox@1.0.0-alpha.0...@ovh-ux/manager-overthebox@1.0.0-alpha.1) (2018-11-28)


### Bug Fixes

* **overthebox:** add prepare script ([0cc3efb](https://github.com/ovh-ux/manager/commit/0cc3efb))



# [1.0.0-alpha.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-overthebox@0.0.0...@ovh-ux/manager-overthebox@1.0.0-alpha.0) (2018-11-26)



