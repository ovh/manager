## [2.0.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-config@2.0.0...@ovh-ux/manager-config@2.0.1) (2020-10-28)


### Bug Fixes

* **environment.service:** temporarily fallback for cs_CZ language ([f527be7](https://github.com/ovh/manager/commit/f527be7afc8bea21b72991a0193ba47ecff682dd))
* export localeStorageKey constant as default ([bbe4cdd](https://github.com/ovh/manager/commit/bbe4cdd05d6a6b8f971b3bc0fe8fedc1b25b1e6d))
* **locale:** add missing cs_CZ entry ([9aedddb](https://github.com/ovh/manager/commit/9aedddb65553d80c967056bf52e2c33055987e65))



# [2.0.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-config@1.1.1...@ovh-ux/manager-config@2.0.0) (2020-10-13)


### Code Refactoring

* **locale:** remove FI entry from language menu picker ([014d810](https://github.com/ovh/manager/commit/014d810e21f79b0ebf50d0aaf133328d37c4ba4b))


### BREAKING CHANGES

* **locale:** Remove entry `Suomi` from the language menu picker.
  As `fr_FR` is the default locale, we explicitly redirect `fi_FI`
  customer to the `en_GB` locale.



## [1.1.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-config@1.1.0...@ovh-ux/manager-config@1.1.1) (2020-09-04)


### Bug Fixes

* **config:** fix user language ([#3574](https://github.com/ovh/manager/issues/3574)) ([c43463e](https://github.com/ovh/manager/commit/c43463eca8f9b7e0fce2cc5f7e83cd869e3b0ac9))



# [1.1.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-config@1.0.0...@ovh-ux/manager-config@1.1.0) (2020-08-18)


### Features

* **config:** add user locale in config ([4c78627](https://github.com/ovh/manager/commit/4c786275764dd2e4c194710f8cacce38e3b35f4f))



# [1.0.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-config@0.4.0...@ovh-ux/manager-config@1.0.0) (2020-08-05)


### Bug Fixes

* **config:** check environment region before update ([a704a3d](https://github.com/ovh/manager/commit/a704a3d613f0c42217b3dc00f0f8b47caa938351))


### BREAKING CHANGES

* **config:** Environment `region` allowed values are `EU`, `CA` and `US`

Signed-off-by: Cyrille Bourgois <cyrille.bourgois@corp.ovh.com>



# [0.4.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-config@0.3.1...@ovh-ux/manager-config@0.4.0) (2019-10-28)


### Features

* version number ([#1525](https://github.com/ovh/manager/issues/1525)) ([6ba9b98](https://github.com/ovh/manager/commit/6ba9b980f775a9d79027ce8455b907c9e145f3dc))



## [0.3.1](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-config@0.3.0...@ovh-ux/manager-config@0.3.1) (2019-10-17)


### Bug Fixes

* **deps:** upgrade @ovh-ux/component-rollup-config to v7.0.0 ([#1469](https://github.com/ovh-ux/manager/issues/1469)) ([bbc8794](https://github.com/ovh-ux/manager/commit/bbc8794))



# [0.3.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-config@0.2.0...@ovh-ux/manager-config@0.3.0) (2019-07-05)


### Features

* add new packages ([09b5158](https://github.com/ovh-ux/manager/commit/09b5158))



# [0.2.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-config@0.1.0...@ovh-ux/manager-config@0.2.0) (2019-03-22)


### Features

* **pci:** add @ovh-ux/manager-pci package ([#230](https://github.com/ovh-ux/manager/issues/230)) ([9c36a75](https://github.com/ovh-ux/manager/commit/9c36a75))



# [0.1.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-config@0.1.0-alpha.0...@ovh-ux/manager-config@0.1.0) (2019-03-19)


### Bug Fixes

* remove prerelease state ([8708ce0](https://github.com/ovh-ux/manager/commit/8708ce0))



# [0.1.0-alpha.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-config@0.0.0...@ovh-ux/manager-config@0.1.0-alpha.0) (2019-03-19)


### Features

* init new package for manager configuration ([37358b3](https://github.com/ovh-ux/manager/commit/37358b3))



