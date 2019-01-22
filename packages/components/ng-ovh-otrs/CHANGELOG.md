# [7.0.0-beta.1](https://github.com/ovh-ux/ng-ovh-otrs/compare/v7.0.0-beta.0...v7.0.0-beta.1) (2019-01-22)


### Bug Fixes

* **popup.service:** rename duplicate properties ([80b684c](https://github.com/ovh-ux/ng-ovh-otrs/commit/80b684c))
* add dynamic translations and remove drag'n'drop error ([6a77fd4](https://github.com/ovh-ux/ng-ovh-otrs/commit/6a77fd4))



# [7.0.0-beta.0](https://github.com/ovh-ux/ng-ovh-otrs/compare/v7.0.0-alpha.1...v7.0.0-beta.0) (2019-01-18)


### Code Refactoring

* add missing ng prefix to the angular module name ([8b74854](https://github.com/ovh-ux/ng-ovh-otrs/commit/8b74854))


### BREAKING CHANGES

* module is now named as `ngOvhOtrs`



# [6.3.0](https://github.com/ovh-ux/ng-ovh-otrs/compare/v6.2.2...v6.3.0) (2018-11-08)


### Bug Fixes

* remove package-lock.json and add .npmrc file ([2aed6b1](https://github.com/ovh-ux/ng-ovh-otrs/commit/2aed6b1))


### Features

* **tracking:** add tracking on request creation ([3e2ac69](https://github.com/ovh-ux/ng-ovh-otrs/commit/3e2ac69))



# [7.0.0-alpha.1](https://github.com/ovh-ux/ovh-angular-otrs/compare/v6.2.3-alpha.0...v7.0.0-alpha.1) (2019-01-17)



# [7.0.0-alpha.0](https://github.com/ovh-ux/ovh-angular-otrs/compare/v6.2.3-alpha.0...v7.0.0-alpha.0) (2019-01-17)



## [6.2.3-alpha.0](https://github.com/ovh-ux/ovh-angular-otrs/compare/v6.2.2...v6.2.3-alpha.0) (2019-01-17)


### Bug Fixes

* **bootstrap:** remove bootstrap import ([713c5cb](https://github.com/ovh-ux/ovh-angular-otrs/commit/713c5cb))
* **bootstrap:** remove bootstrap import ([bbd75bf](https://github.com/ovh-ux/ovh-angular-otrs/commit/bbd75bf))
* **eslint:** add missing angular imports ([9091c2e](https://github.com/ovh-ux/ovh-angular-otrs/commit/9091c2e))



# Changelog

## [4.0.1] - 2018-04-11
- Add provider to set a base URL tickets.

## [4.0.0] - 2018-03-30
- Add missing intervention feature
### Breaking change
- requires ovh-api-services v3.0.0

## [3.0.0] - 2017-09-07
- Show all services of all universes for ticket creation.
- Add universe filter for ticket creation.
- Always redirect to support request list of Dedicated universe.
### Breaking change
- MANAGER_URLS constant must exist in applications using this dependency.


## [2.0.0] - 2017-08-31
- Every service has been prefixed by OvhApi.
- Upgrade ovh-api-services to version 2.
