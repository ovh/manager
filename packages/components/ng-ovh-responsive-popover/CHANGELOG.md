## [5.0.1](https://github.com/ovh-ux/ng-ovh-responsive-popover/compare/v5.0.0...v5.0.1) (2020-01-07)



# [5.0.0](https://github.com/ovh-ux/ng-ovh-responsive-popover/compare/v5.0.0-beta.0...v5.0.0) (2019-10-22)



# [5.0.0-beta.0](https://github.com/ovh-ux/ng-ovh-responsive-popover/compare/v5.0.0-alpha.2...v5.0.0-beta.0) (2019-01-23)


### Code Refactoring

* add missing ng prefix to the angular module name ([a725690](https://github.com/ovh-ux/ng-ovh-responsive-popover/commit/a725690))


### BREAKING CHANGES

* module is now named as `ngOvhResponsivePopover`



# [5.0.0-alpha.2](https://github.com/ovh-ux/ovh-angular-responsive-popover/compare/v5.0.0-alpha.1...v5.0.0-alpha.2) (2018-11-27)


### Bug Fixes

* bump npm-run-all@4.1.5 ([e3b6b7e](https://github.com/ovh-ux/ovh-angular-responsive-popover/commit/e3b6b7e))



<a name="5.0.0-alpha.1"></a>
# [5.0.0-alpha.1](https://github.com/ovh-ux/ovh-angular-responsive-popover/compare/v5.0.0-alpha.0...v5.0.0-alpha.1) (2018-10-25)


### Bug Fixes

* **responsivepopoverpopup:** module name is now correct ([93e1c57](https://github.com/ovh-ux/ovh-angular-responsive-popover/commit/93e1c57))



<a name="5.0.0-alpha.0"></a>
# [5.0.0-alpha.0](https://github.com/ovh-ux/ovh-angular-responsive-popover/compare/4.0.1...5.0.0-alpha.0) (2018-10-23)


### Bug Fixes

* remove jshint and jscs ([48f1fa2](https://github.com/ovh-ux/ovh-angular-responsive-popover/commit/48f1fa2))
* **build:** use component-rollup-config ([fee4f3f](https://github.com/ovh-ux/ovh-angular-responsive-popover/commit/fee4f3f))
* **build:** use component-webpack-config ([a2e59c6](https://github.com/ovh-ux/ovh-angular-responsive-popover/commit/a2e59c6))
* **ngAnnotate:** add ngInject ([8f7d618](https://github.com/ovh-ux/ovh-angular-responsive-popover/commit/8f7d618))
* **popup:** fix export ([fc1d08e](https://github.com/ovh-ux/ovh-angular-responsive-popover/commit/fc1d08e))



# Change log
All notable changes to this project will be documented in this file.

## [2.0.0]
### Changed (Breaking Change)
- responsive-popover use now a isolated scope

## [3.0.0]
### Changed (Breaking Change)
- Updated dependency angular-bootstrap to 1.3.x and added necessary uib- prefix where needed. If you don't upgrade angular-bootstrap in your project, this component won't work!

## [4.0.0]
### Changed (Breaking Change)
- remove ovh-ngstrap dependency and use angular-bootstrap instead;
- remove ngAnimate dependency;
- add a provider to allow configuration of what you consider as a mobile device (configure your own mediaQueryString). Default: (max-width: 980px).

### [4.0.1]
- remove media query listener on destry to avoid disabling body scroll after popover is removed.
