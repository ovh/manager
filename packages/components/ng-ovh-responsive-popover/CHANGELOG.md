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
