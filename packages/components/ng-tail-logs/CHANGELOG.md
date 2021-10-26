## [2.0.6](https://github.com/ovh/manager/compare/@ovh-ux/ng-tail-logs@2.0.5...@ovh-ux/ng-tail-logs@2.0.6) (2021-10-26)


### Bug Fixes

* **dev-deps:** upgrade @ovh-ux/component-rollup-config to `v11.0.0` ([3ae659b](https://github.com/ovh/manager/commit/3ae659bea59244fd5660375b9dac52055cc374b0))



## [2.0.5](https://github.com/ovh/manager/compare/@ovh-ux/ng-tail-logs@2.0.4...@ovh-ux/ng-tail-logs@2.0.5) (2021-06-29)


### Bug Fixes

* **deps:** upgrade `@ovh-ux/component-rollup-config` to `v10.0.0` ([8eac31f](https://github.com/ovh/manager/commit/8eac31f81e46d1570c131cf55788d6435842ab6d))



## [2.0.4](https://github.com/ovh/manager/compare/@ovh-ux/ng-tail-logs@2.0.3...@ovh-ux/ng-tail-logs@2.0.4) (2021-01-13)


### Bug Fixes

* update semver range for @ovh-ux/component-rollup-config ([dda59c6](https://github.com/ovh/manager/commit/dda59c6b71cb4ad9ab98f06a0bf995a7eb45a1d9))



## [2.0.3](https://github.com/ovh/manager/compare/@ovh-ux/ng-tail-logs@2.0.2...@ovh-ux/ng-tail-logs@2.0.3) (2020-04-01)


### Bug Fixes

* **service:** use uniqBy instead of uniq ([#38](https://github.com/ovh/manager/issues/38)) ([0c447bd](https://github.com/ovh/manager/commit/0c447bde5e26dfac11434ffe89bccef72984321c)), closes [#19](https://github.com/ovh/manager/issues/19)



## [2.0.2](https://github.com/ovh-ux/ng-tail-logs/compare/v2.0.1...v2.0.2) (2020-02-11)


### Bug Fixes

* **service:** use uniqBy instead of uniq ([#38](https://github.com/ovh-ux/ng-tail-logs/issues/38)) ([94ba684](https://github.com/ovh-ux/ng-tail-logs/commit/94ba684f51aceac7f970d59e5174fd0ae13cd49b)), closes [#19](https://github.com/ovh-ux/ng-tail-logs/issues/19)



## [2.0.1](https://github.com/ovh-ux/ng-tail-logs/compare/v2.0.0...v2.0.1) (2020-01-07)



# [2.0.0](https://github.com/ovh-ux/ng-tail-logs/compare/v2.0.0-beta.1...v2.0.0) (2019-10-22)



# [2.0.0-beta.1](https://github.com/ovh-ux/ng-tail-logs/compare/v2.0.0-beta.0...v2.0.0-beta.1) (2019-01-09)



# [2.0.0-beta.0](https://github.com/ovh-ux/ng-tail-logs/compare/1.1.2...2.0.0-beta.0) (2018-12-14)


### Bug Fixes

* remove jshint and jscs ([128ff54](https://github.com/ovh-ux/ng-tail-logs/commit/128ff54))


### Code Refactoring

* update stack with component-rollup-config ([19dc591](https://github.com/ovh-ux/ng-tail-logs/commit/19dc591))


### BREAKING CHANGES

* module name is now ngTailLogs and package is scoped in @ovh-ux

    Before:

        import 'ovh-angular-tail-logs';
        angular.module('myModule', ['ovh-angular-tail-logs'])

    After:

        import '@ovh-ux/ng-tail-logs';
        angular.module('myModule', ['ngTailLogs'])



# Change log
All notable changes to this project will be documented in this file.
