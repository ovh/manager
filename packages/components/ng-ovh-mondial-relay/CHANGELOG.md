## [7.0.1](https://github.com/ovh/manager/compare/@ovh-ux/ng-ovh-mondial-relay@7.0.0...@ovh-ux/ng-ovh-mondial-relay@7.0.1) (2020-06-02)


### Bug Fixes

* **i18n:** add missing translations [CDS 405] ([70ed18d](https://github.com/ovh/manager/commit/70ed18d223a1e23f8f792a235e51bdfb27cd95e3))
* **i18n:** add missing translations [CDS 406] ([07d8386](https://github.com/ovh/manager/commit/07d8386a3b64403d4c838db7b57731837c9f82a1))



# [7.0.0](https://github.com/ovh/manager/compare/@ovh-ux/ng-ovh-mondial-relay@6.0.3...@ovh-ux/ng-ovh-mondial-relay@7.0.0) (2020-05-13)


### Bug Fixes

* **controller:** set loading init to false correctly ([#26](https://github.com/ovh/manager/issues/26)) ([0d8d014](https://github.com/ovh/manager/commit/0d8d0145b71cbc9dfbed9eb96895f235ba0082a1))


### Code Refactoring

* update stack with component-rollup-config ([#18](https://github.com/ovh/manager/issues/18)) ([4868e00](https://github.com/ovh/manager/commit/4868e00efacdd38f729bd3d58b1a92a35378de4d))


### Features

* **leaflet:** select radio button for clicked relay on map ([7614d6e](https://github.com/ovh/manager/commit/7614d6ece616d8af410353116878e02430fa0ed0))


### BREAKING CHANGES

* module is now named `ngOvhMondialRelay`



## [6.0.3](https://github.com/ovh-ux/ng-ovh-mondial-relay/compare/v6.0.2...v6.0.3) (2020-01-08)



## [6.0.2](https://github.com/ovh-ux/ng-ovh-mondial-relay/compare/v6.0.1...v6.0.2) (2019-11-05)



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
