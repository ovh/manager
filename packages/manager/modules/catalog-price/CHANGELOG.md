# [1.3.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-catalog-price@1.2.2...@ovh-ux/manager-catalog-price@1.3.0) (2020-11-19)


### Bug Fixes

* **i18n:** add missing translations [CDS 672] ([980aa6b](https://github.com/ovh/manager/commit/980aa6bf26b4281eb007effba060432cb3686bb8))


### Features

* add fromToPrice property ([9b351cf](https://github.com/ovh/manager/commit/9b351cfaf69c152f5398063ebe8cc79d54b58f32))
* **hosting:** add Shared CDN ([7494079](https://github.com/ovh/manager/commit/7494079ea3307b20c9c2eccb2c3f70e3b1c1c6a9))



## [1.2.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-catalog-price@1.2.1...@ovh-ux/manager-catalog-price@1.2.2) (2020-10-13)


### Bug Fixes

* **deps:** upgrade to @ovh-ux/manager-config v2.0.0 ([ca3f955](https://github.com/ovh/manager/commit/ca3f9554c13b1436cbdeed3de8ac69e399d5dd93))



## [1.2.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-catalog-price@1.2.0...@ovh-ux/manager-catalog-price@1.2.1) (2020-08-18)


### Bug Fixes

* **locale:** move locale detection in bootstrapApplication ([92d1050](https://github.com/ovh/manager/commit/92d1050613a2466ce2447e2c3d322ae81165530a))
* **locale:** use user locale from manager-config ([81e8d10](https://github.com/ovh/manager/commit/81e8d1009455d7524ee86a5183a8db517640ef41))



# [1.2.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-catalog-price@1.1.0...@ovh-ux/manager-catalog-price@1.2.0) (2020-07-16)


### Features

* **catalog-price:** precision parameters added ([4491e89](https://github.com/ovh/manager/commit/4491e894686ec59ee42a686e0094e1ee3b73554b))



# [1.1.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-catalog-price@1.0.2...@ovh-ux/manager-catalog-price@1.1.0) (2020-05-13)


### Features

* **dedicated.cloud:** add veeam backup storage ([#2320](https://github.com/ovh/manager/issues/2320)) ([61f53d4](https://github.com/ovh/manager/commit/61f53d4b6507158941a76defbc72b7302a4206f3))



## [1.0.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-catalog-price@1.0.1...@ovh-ux/manager-catalog-price@1.0.2) (2020-03-18)


### Bug Fixes

* **deps:** use latest for @ovh-ux/manager-core ([#2394](https://github.com/ovh/manager/issues/2394)) ([df1a12b](https://github.com/ovh/manager/commit/df1a12bc132cebb55f0a70a317e406ee78574faa))
* **i18n:** add missing translations [CDS 307] ([f5295a2](https://github.com/ovh/manager/commit/f5295a2c34752721d7cc4c7cb01516f1ac295b2d))
* **i18n:** add missing translations [CDS 311] ([de12c2a](https://github.com/ovh/manager/commit/de12c2a807d080b4718225995e0b191110c1e523))



## [1.0.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-catalog-price@1.0.0...@ovh-ux/manager-catalog-price@1.0.1) (2020-03-04)


### Bug Fixes

* **deps:** use latest for @ovh-ux/manager-core ([#2394](https://github.com/ovh/manager/issues/2394)) ([fd0a25b](https://github.com/ovh/manager/commit/fd0a25b11bd5119649daf3b1605bb56bf70f3ff9))



# [1.0.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-catalog-price@0.0.0...@ovh-ux/manager-catalog-price@1.0.0) (2020-03-04)


### Features

* **modules:** add catalog price as an independant module ([e464422](https://github.com/ovh/manager/commit/e46442241e7d2402b8d7c97838cc12d65f3ad1d1))


### BREAKING CHANGES

* **modules:** This component is just the export of the one located in web/app/components/manager-order-catalog-price.
The web located component should be replaced by the new one (refactor will be done once this module is released)
