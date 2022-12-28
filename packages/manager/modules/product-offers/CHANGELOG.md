# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.3.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@5.3.0...@ovh-ux/manager-product-offers@5.3.1) (2022-12-12)


### Bug Fixes

* **web:** add new domain pricing mode ([#8516](https://github.com/ovh/manager/issues/8516)) ([afc7b97](https://github.com/ovh/manager/commit/afc7b97829270a7b2557b98e5f7ab10bfbb0ecda))





# [5.3.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@5.2.0...@ovh-ux/manager-product-offers@5.3.0) (2022-06-14)


### Features

* bump @ovh-ux/ui-kit to v6.1.0 ([a1eaaa5](https://github.com/ovh/manager/commit/a1eaaa5cb68652d1d600ba02e0d27de557de94e5))



# [5.2.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@5.1.3...@ovh-ux/manager-product-offers@5.2.0) (2022-06-08)


### Features

* **hosting.offer:** re-implement detach addon of start10M ([#7311](https://github.com/ovh/manager/issues/7311)) ([cf02a8c](https://github.com/ovh/manager/commit/cf02a8c77b563cc711b373733e7ed46ea671cae3))



## [5.1.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@5.1.2...@ovh-ux/manager-product-offers@5.1.3) (2022-06-07)


### Bug Fixes

* **deps:** upgrade `ovh-api-services` to `v14.0.6` ([#7273](https://github.com/ovh/manager/issues/7273)) ([90698c8](https://github.com/ovh/manager/commit/90698c8c025bba09dd8e1baf64ccc0eecd56d3a8))



## [5.1.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@5.1.1...@ovh-ux/manager-product-offers@5.1.2) (2022-03-24)


### Bug Fixes

* **deps:** upgrade `@ovh-ux/ui-kit` to `v5.3.3` ([#6745](https://github.com/ovh/manager/issues/6745)) ([38d1144](https://github.com/ovh/manager/commit/38d11445b3671755758d153a4f4a166c7946705c)), closes [ovh/ovh-ui-kit#777](https://github.com/ovh/ovh-ui-kit/issues/777)



## [5.1.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@5.1.0...@ovh-ux/manager-product-offers@5.1.1) (2021-11-04)


### Bug Fixes

* bump ng-ovh-payment-method to next major ([687f1e4](https://github.com/ovh/manager/commit/687f1e47daefb5c19563c5c434fa281a70be9049))



# [5.1.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@5.0.1...@ovh-ux/manager-product-offers@5.1.0) (2021-08-25)


### Features

* **deps:** upgrade `@ovh-ux/ui-kit` to `v5.0.0` ([d09ca10](https://github.com/ovh/manager/commit/d09ca10f4b7ca629e0b2f1fcb59278ea7f309a9e))



## [5.0.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@5.0.0...@ovh-ux/manager-product-offers@5.0.1) (2021-04-26)


### Bug Fixes

* **product-offers:** fix on get plancode ([543d6d9](https://github.com/ovh/manager/commit/543d6d9b752cf2e5ab46607687a897804fe57015))



# [5.0.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@4.0.7...@ovh-ux/manager-product-offers@5.0.0) (2021-04-26)


### Bug Fixes

* **product-offers:** use prorata date on services workflow ([6334d38](https://github.com/ovh/manager/commit/6334d38ccaa5e690848bd454a1218ff1b53ea481))
* **product-offers:** use timeout for auto focus next step ([5a2944e](https://github.com/ovh/manager/commit/5a2944e229b46bf68e9c29320b0c698436de70aa))


### Features

* **product-offers:** add callback on steps submit ([ab42456](https://github.com/ovh/manager/commit/ab424566bfd43ad9848ad335a87a146d1649954e))
* **product-offers:** allow display of current option price ([9b67cea](https://github.com/ovh/manager/commit/9b67cea1fb8d5e9284ac9ad5016b2190d2c23ea4))
* **product-offers:** change service to handle upgrades ([77bdc97](https://github.com/ovh/manager/commit/77bdc9787f05eade80d41d5da6382ca5a11cfcd8))
* **product-offers:** handle upgrades for services workflow type ([d7a404c](https://github.com/ovh/manager/commit/d7a404cdfe4ef1e31e4656966180341b83ed6946))


### BREAKING CHANGES

* **product-offers:** 1. the workflowOptions property 'detachPlancodes' becomes 'plancodes'. So all detach use of the component must change their property name to be set correctly.
2. name of the services workflow validate result is renamed `result` (was `detachResult` before)



## [4.0.7](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@4.0.6...@ovh-ux/manager-product-offers@4.0.7) (2021-03-02)


### Bug Fixes

* bump semver range for @ovh-ux/manager-config package ([5f3eda1](https://github.com/ovh/manager/commit/5f3eda16abd4df3b46cdde241c827a1d1d6dc80c))



## [4.0.6](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@4.0.5...@ovh-ux/manager-product-offers@4.0.6) (2021-02-02)


### Bug Fixes

* bump semver range for @ovh-ux/manager-config package ([ca04d19](https://github.com/ovh/manager/commit/ca04d19b7a038544f1b5e3b211d0a1c3b70a0d5b))



## [4.0.5](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@4.0.4...@ovh-ux/manager-product-offers@4.0.5) (2021-01-04)


### Bug Fixes

* bump semver range for @ovh-ux/manager-config package ([23b469f](https://github.com/ovh/manager/commit/23b469f6264610c47076da908f688e8069f19c76))



## [4.0.4](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@4.0.3...@ovh-ux/manager-product-offers@4.0.4) (2020-10-28)


### Bug Fixes

* **peer-deps:** upgrade @ovh-ux/ui-kit to v4.4.1 ([8254623](https://github.com/ovh/manager/commit/82546237336e185ae7d973a1bb2aabddbb50112e))



## [4.0.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@4.0.2...@ovh-ux/manager-product-offers@4.0.3) (2020-10-20)


### Bug Fixes

* **deps:** upgrade ovh-api-services to v11.0.0 ([#3869](https://github.com/ovh/manager/issues/3869)) ([df90e4d](https://github.com/ovh/manager/commit/df90e4de660920e3cd07b2ff6b4452b0aa861377))



## [4.0.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@4.0.1...@ovh-ux/manager-product-offers@4.0.2) (2020-10-13)


### Bug Fixes

* **deps:** upgrade to @ovh-ux/manager-config v2.0.0 ([ca3f955](https://github.com/ovh/manager/commit/ca3f9554c13b1436cbdeed3de8ac69e399d5dd93))



## [4.0.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@4.0.0...@ovh-ux/manager-product-offers@4.0.1) (2020-09-04)


### Bug Fixes

* **product-offer:** fix contracts agreements check ([#3575](https://github.com/ovh/manager/issues/3575)) ([f1a7b88](https://github.com/ovh/manager/commit/f1a7b8848772a15172dab4b38d92b7e4637c5fdd))



# [4.0.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@3.1.2...@ovh-ux/manager-product-offers@4.0.0) (2020-09-03)


### Bug Fixes

* **product-offers:** allow to order if no contracts ([#3570](https://github.com/ovh/manager/issues/3570)) ([38d6adb](https://github.com/ovh/manager/commit/38d6adb85eb04dafb7649e90ebcff6354674c1c9))


### Features

* **product.offers:** add all default pricing modes in constant ([c84ba83](https://github.com/ovh/manager/commit/c84ba839fd7fe25032e2b36e04ad4d2f02a529e2))


### BREAKING CHANGES

* **product.offers:** change the constant object 'PRICING_MODE', and so requires adaptation of 'PRICING_MODE.DEFAULT' uses
Signed-off-by: Jérémy De-Cesare <jeremy.de-cesare@corp.ovh.com>



## [3.1.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@3.1.1...@ovh-ux/manager-product-offers@3.1.2) (2020-08-21)


### Bug Fixes

* **product.offers:** set timeout to fix stepper index incrementation ([#3480](https://github.com/ovh/manager/issues/3480)) ([6f68caa](https://github.com/ovh/manager/commit/6f68caa8831e38a03c3d7fd1a097732e78022cd2))



## [3.1.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@3.1.0...@ovh-ux/manager-product-offers@3.1.1) (2020-08-18)


### Bug Fixes

* **language:** use convertLanguageFromOVHToBCP47 from config ([92eec09](https://github.com/ovh/manager/commit/92eec09b64fa5963d0e0dbc41e904f1f999f6325))
* **locale:** move locale detection in bootstrapApplication ([92d1050](https://github.com/ovh/manager/commit/92d1050613a2466ce2447e2c3d322ae81165530a))



# [3.1.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@3.0.0...@ovh-ux/manager-product-offers@3.1.0) (2020-08-05)


### Features

* **pricing:** add PRICING_MODE constant ([a32e1c4](https://github.com/ovh/manager/commit/a32e1c46cccb42368ff31b46308cebb362449fcb))



# [3.0.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@2.0.0...@ovh-ux/manager-product-offers@3.0.0) (2020-07-29)


### Features

* upgrade ovh-ui-kit to v4 ([f48f258](https://github.com/ovh/manager/commit/f48f2587c367b06939c452428c5783c2fb1c1b8d))


### BREAKING CHANGES

* bump ovh-ui-kit to latest major

Signed-off-by: Axel Peter <axel.peter@live.com>



# [2.0.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@1.3.1...@ovh-ux/manager-product-offers@2.0.0) (2020-07-08)


### Bug Fixes

* **i18n:** restore CDS translations commit [CDS 467] ([ca4a5e2](https://github.com/ovh/manager/commit/ca4a5e2cf353a064e70fb2527cd0557563d72f98))
* **product-offers:** add prorata duration date ([aaa56c7](https://github.com/ovh/manager/commit/aaa56c7a592f9d58bb5030c136722c6044cff2e4))


### Features

* **product-offer:** allow changing plan code dynamically ([727281a](https://github.com/ovh/manager/commit/727281aa1a47291741d08afdce6708b865285a67))


### BREAKING CHANGES

* **product-offer:** - allow changing plan code dynamically for Order workflow
- remove possibility to have set the planCode by a property

Signed-off-by: Frederic Espiau <frederic.espiau@corp.ovh.com>



## [1.3.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@1.3.0...@ovh-ux/manager-product-offers@1.3.1) (2020-06-09)


### Bug Fixes

* **emailpro:** fix header tabs button ([47d208b](https://github.com/ovh/manager/commit/47d208b44dcad2fedab44b6771d4da79a80dbfc9))



# [1.3.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@1.2.0...@ovh-ux/manager-product-offers@1.3.0) (2020-06-02)


### Bug Fixes

* **i18n:** add missing translations [CDS 410] ([19f33b5](https://github.com/ovh/manager/commit/19f33b5f2e4893f855068f4f908aea5792a20ebe))
* **i18n:** add missing translations [CDS 414] ([7601c89](https://github.com/ovh/manager/commit/7601c89ff863c8fbbcbe76442a1ceca13051ced4))
* **product-offers:** fix test is free with extra pricing ([e51ca0c](https://github.com/ovh/manager/commit/e51ca0cb4bcad9f2949e87fcb01d390a2085a2a7))


### Features

* **product-offers:** add termination date if extra pricing not free ([7e52024](https://github.com/ovh/manager/commit/7e52024a97f5a999e97a03b40ec7b6816ce3e1a2))
* autopay detach if it is free ([7e4d76c](https://github.com/ovh/manager/commit/7e4d76c0112672805678b4661c425fe59f5b189c))



# [1.2.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@1.1.1...@ovh-ux/manager-product-offers@1.2.0) (2020-05-13)


### Features

* **product-offers:** force camel case payment method param ([38917ff](https://github.com/ovh/manager/commit/38917ff88e0c56ea41badf7c233fa22b4c6b3975))



## [1.1.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@1.1.0...@ovh-ux/manager-product-offers@1.1.1) (2020-05-04)


### Bug Fixes

* **workflow:** autopay order only if customer has payment mean ([#2881](https://github.com/ovh/manager/issues/2881)) ([5b73b3c](https://github.com/ovh/manager/commit/5b73b3c5cf4ef7388787524ea47ec7a3eff52290))



# [1.1.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@1.0.4...@ovh-ux/manager-product-offers@1.1.0) (2020-04-28)


### Bug Fixes

* display text depending on price ([7ea01d1](https://github.com/ovh/manager/commit/7ea01d1c2b922b7847bcd3bf23aa02abde061621))


### Features

* update dns zone standalone order ([16b5fd7](https://github.com/ovh/manager/commit/16b5fd75bc2622574a0dadd8b613031fe5b7ef77))



## [1.0.4](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@1.0.3...@ovh-ux/manager-product-offers@1.0.4) (2020-04-15)


### Performance Improvements

* import dynamically moment locales ([#2755](https://github.com/ovh/manager/issues/2755)) ([5f3320d](https://github.com/ovh/manager/commit/5f3320d92802a1f4a6d65baf60f74917b8e58f4a))



## [1.0.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@1.0.2...@ovh-ux/manager-product-offers@1.0.3) (2020-04-01)


### Bug Fixes

* **i18n:** add missing translations [CDS 314] ([6cb1de2](https://github.com/ovh/manager/commit/6cb1de2873cb762174dd19f86cfd7ed8fff2b654))



## [1.0.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@1.0.1...@ovh-ux/manager-product-offers@1.0.2) (2020-03-18)


### Bug Fixes

* **deps:** use latest for @ovh-ux/manager-core ([#2394](https://github.com/ovh/manager/issues/2394)) ([df1a12b](https://github.com/ovh/manager/commit/df1a12bc132cebb55f0a70a317e406ee78574faa))
* **i18n:** add missing translations [CDS 304] ([597a3cc](https://github.com/ovh/manager/commit/597a3cc4040ff6aa62df01693efa02a16fa41b8b))
* **i18n:** add missing translations [CDS 305] ([d672369](https://github.com/ovh/manager/commit/d6723692af4b6908c09d92fb8071982f45258143))
* **i18n:** add missing translations [CDS 306] ([cc24d7b](https://github.com/ovh/manager/commit/cc24d7b4bccd25c2b5e2d7d95c6525850a7d0d4f))
* **i18n:** add missing translations [CDS 307] ([f5295a2](https://github.com/ovh/manager/commit/f5295a2c34752721d7cc4c7cb01516f1ac295b2d))
* **i18n:** add missing translations [CDS 311] ([de12c2a](https://github.com/ovh/manager/commit/de12c2a807d080b4718225995e0b191110c1e523))



## [1.0.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@1.0.0...@ovh-ux/manager-product-offers@1.0.1) (2020-03-04)


### Bug Fixes

* **deps:** use latest for @ovh-ux/manager-core ([#2394](https://github.com/ovh/manager/issues/2394)) ([fd0a25b](https://github.com/ovh/manager/commit/fd0a25b11bd5119649daf3b1605bb56bf70f3ff9))



# [1.0.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-product-offers@0.0.0...@ovh-ux/manager-product-offers@1.0.0) (2020-03-04)


### Features

* **modules:** add product offers module ([2c82a07](https://github.com/ovh/manager/commit/2c82a07359c0c225d95272c435a0544a79b0aef5))
* **modules.product.offers:** display renew extra pricing even if free ([c7f331e](https://github.com/ovh/manager/commit/c7f331e3481821ab33a44dbdc766b2701f0946fa))


### BREAKING CHANGES

* **modules:** This module initialize the component 'product-offers'
