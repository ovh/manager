# [4.0.0](https://github.com/ovh/manager/compare/@ovh-ux/ng-ovh-contracts@3.2.0...@ovh-ux/ng-ovh-contracts@4.0.0) (2020-07-29)


### Features

* upgrade ovh-ui-kit to v4 ([f48f258](https://github.com/ovh/manager/commit/f48f2587c367b06939c452428c5783c2fb1c1b8d))


### BREAKING CHANGES

* bump ovh-ui-kit to latest major

Signed-off-by: Axel Peter <axel.peter@live.com>



# [3.2.0](https://github.com/ovh/manager/compare/@ovh-ux/ng-ovh-contracts@3.1.2...@ovh-ux/ng-ovh-contracts@3.2.0) (2020-06-16)


### Features

* prevent displaying contracts if there is none ([d58885c](https://github.com/ovh/manager/commit/d58885c4d543d1a5334ce983cf8c08202e05a57a))



## [3.1.2](https://github.com/ovh/manager/compare/@ovh-ux/ng-ovh-contracts@3.1.1...@ovh-ux/ng-ovh-contracts@3.1.2) (2020-06-09)


### Bug Fixes

* **emailpro:** fix header tabs button ([47d208b](https://github.com/ovh/manager/commit/47d208b44dcad2fedab44b6771d4da79a80dbfc9))



## [3.1.1](https://github.com/ovh/manager/compare/@ovh-ux/ng-ovh-contracts@3.1.0...@ovh-ux/ng-ovh-contracts@3.1.1) (2020-01-08)


### Bug Fixes

* **i18n:** add missing translations [CDS 199] ([24691eb](https://github.com/ovh/manager/commit/24691eb7a3ef41321610c4e724c540aabd91d3db))
* **i18n:** add missing translations [CDS 200] ([203d3f0](https://github.com/ovh/manager/commit/203d3f0294981f9e3dcc79d9734d9dda38f168d6))



# [3.1.0](https://github.com/ovh/manager/compare/@ovh-ux/ng-ovh-contracts@3.0.1...@ovh-ux/ng-ovh-contracts@3.1.0) (2019-12-19)


### Bug Fixes

* **components.contracts:** fix package scripts ([95d1522](https://github.com/ovh/manager/commit/95d1522c3649f6b03268de7b4ddc692744bab250))
* **components.contracts:** remove unecessary dev deps ([9a70fe7](https://github.com/ovh/manager/commit/9a70fe7fe21b914ef03cef0a404da3e5094967f2))
* **components.contracts:** switch xml to json ([11a499f](https://github.com/ovh/manager/commit/11a499f32859a416b7efac68ec544a2a7bdb02bf))
* **i18n:** add missing translations [CDS 183] ([a936e65](https://github.com/ovh/manager/commit/a936e6537c5bd79ffdf8ae22016a6c688c84da32))
* **i18n:** add missing translations [CDS 184] ([6ec37b2](https://github.com/ovh/manager/commit/6ec37b2226218cecb94307abb01d88ffda824326))
* **i18n:** add missing translations [CDS 187] ([707ec72](https://github.com/ovh/manager/commit/707ec724fe6852a0c5fa855bfb6911fef977df61))
* **i18n:** add missing translations [CDS 196] ([acbb2da](https://github.com/ovh/manager/commit/acbb2da34b2d1c2863fd7c2f6cd187b67e065324))
* **package.json:** set the right repository plus some meta tweaks ([669d293](https://github.com/ovh/manager/commit/669d293f0fc3f55205da11bb4651dc206795b0f3))


### Features

* add inline contract ([#1930](https://github.com/ovh/manager/issues/1930)) ([00409cd](https://github.com/ovh/manager/commit/00409cd7b432bb51523d7ed1a7118271e8c6f0fa))
* **components:** add @ovh-ux/ng-ovh-contracts ([b0de572](https://github.com/ovh/manager/commit/b0de572c1328df402e3b684027253ad46fb88223))



## [3.0.1](https://github.com/ovh-ux/ng-ovh-contracts/compare/v3.0.0...v3.0.1) (2019-11-05)



# [3.0.0](https://github.com/ovh-ux/ng-ovh-contracts/compare/v3.0.0-beta.3...v3.0.0) (2019-08-30)


### Bug Fixes

* **dev-deps:** upgrade some dev dependencies ([#21](https://github.com/ovh-ux/ng-ovh-contracts/issues/21)) ([0300945](https://github.com/ovh-ux/ng-ovh-contracts/commit/0300945))



# [3.0.0-beta.3](https://github.com/ovh-ux/ng-ovh-contracts/compare/v3.0.0-beta.2...v3.0.0-beta.3) (2019-01-16)


### Code Refactoring

* **directive:** add missing ovh prefix ([1f49ebd](https://github.com/ovh-ux/ng-ovh-contracts/commit/1f49ebd))


### BREAKING CHANGES

* **directive:** directive name is now ovhContracts

  Before:

    <div
      data-contracts="Credit.contracts"
      data-full-text="false"
      data-contracts-validated="Credit.contractsAccepted">
    </div>

  After:

    <div
      data-ovh-contracts="Credit.contracts"
      data-full-text="false"
      data-ovh-contracts-validated="Credit.contractsAccepted">
    </div>



# [3.0.0-beta.2](https://github.com/ovh-ux/ng-ovh-contracts/compare/v3.0.0-beta.1...v3.0.0-beta.2) (2019-01-15)


### Bug Fixes

* **directive:** replace jquery.scrollto by animated-scroll-to ([dfe0a45](https://github.com/ovh-ux/ng-ovh-contracts/commit/dfe0a45))



# [3.0.0-beta.1](https://github.com/ovh-ux/ng-ovh-contracts/compare/v3.0.0-beta.0...v3.0.0-beta.1) (2019-01-08)



# [3.0.0-beta.0](https://github.com/ovh-ux/ovh-angular-contracts/compare/v2.0.0...v3.0.0-beta.0) (2018-12-11)


### Bug Fixes

* remove jshint ([1d0287d](https://github.com/ovh-ux/ovh-angular-contracts/commit/1d0287d))
* **controller:** avoid empty contracts array ([e4fb619](https://github.com/ovh-ux/ovh-angular-contracts/commit/e4fb619))
* **deps:** add missing query.scrollto dependency ([63cf1b5](https://github.com/ovh-ux/ovh-angular-contracts/commit/63cf1b5))



