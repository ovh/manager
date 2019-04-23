## [6.0.1](https://github.com/ovh-ux/ng-ovh-mondial-relay/compare/v6.0.0...v6.0.1) (2019-04-23)


### Bug Fixes

* **controller:** set loading init to false correctly ([#26](https://github.com/ovh-ux/ng-ovh-mondial-relay/issues/26)) ([cfe6060](https://github.com/ovh-ux/ng-ovh-mondial-relay/commit/cfe6060))



# [6.0.0](https://github.com/ovh-ux/ng-ovh-mondial-relay/compare/v5.0.0...v6.0.0) (2019-04-23)


### Bug Fixes

* remove form action when submit search ([039eddb](https://github.com/ovh-ux/ng-ovh-mondial-relay/commit/039eddb))


### Code Refactoring

* rename component and direct use of constants ([cb45577](https://github.com/ovh-ux/ng-ovh-mondial-relay/commit/cb45577))


### BREAKING CHANGES

* component is now named as `ovhMondialRelay`
  Before:

  ```html
  <div data-mondial-relay
       data-ng-model="$ctrl.selectedRelay">
  </div>
  ```

  After:

  ```html
  <ovh-mondial-relay data-ng-model="$ctrl.selectedRelay"></ovh-mondial-relay>
  ```



# [5.0.0](https://github.com/ovh-ux/ng-ovh-mondial-relay/compare/v4.1.1...v5.0.0) (2019-02-19)


### Code Refactoring

* update stack with component-rollup-config ([#18](https://github.com/ovh-ux/ng-ovh-mondial-relay/issues/18)) ([d52ec1d](https://github.com/ovh-ux/ng-ovh-mondial-relay/commit/d52ec1d))


### BREAKING CHANGES

* module is now named `ngOvhMondialRelay`



# Changelog

## [4.0.0] - 2018-04-05

- Upgrade ovh-api-services to v3.0.0.

## [3.0.0] - 2017-11-06

- Remove OvhApiServices dependency.
- Remove common-style classes and jshint.

## [2.0.0]

- Update ovh-api-services name into directive controller.
