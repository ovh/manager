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



