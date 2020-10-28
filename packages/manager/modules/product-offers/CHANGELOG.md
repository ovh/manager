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
