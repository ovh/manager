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
