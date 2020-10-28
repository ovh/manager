# [7.3.0](https://github.com/ovh/manager/compare/@ovh-ux/component-rollup-config@7.2.1...@ovh-ux/component-rollup-config@7.3.0) (2020-10-28)


### Features

* add core-js to polyfill ([1411e1c](https://github.com/ovh/manager/commit/1411e1ca873d1ffd715c43fcadfe96f26e5be874))



## [7.2.1](https://github.com/ovh-ux/manager/compare/@ovh-ux/component-rollup-config@7.2.0...@ovh-ux/component-rollup-config@7.2.1) (2020-10-13)


### Bug Fixes

* **plugins.uirouter:** check if item key is defined ([#3776](https://github.com/ovh-ux/manager/issues/3776)) ([b27c9a8](https://github.com/ovh-ux/manager/commit/b27c9a8185de6bc0c8e8824a0e6ff58b12cdcca3))



# [7.2.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/component-rollup-config@7.1.0...@ovh-ux/component-rollup-config@7.2.0) (2020-07-08)


### Features

* **component-rollup-config:** add es6 proposals ([e77ac87](https://github.com/ovh-ux/manager/commit/e77ac874ac3e5a962bc4666a35c112f71f572a32))



# [7.1.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/component-rollup-config@7.0.3...@ovh-ux/component-rollup-config@7.1.0) (2020-06-30)


### Features

* allow usage of global env to set languages for building apps ([#3186](https://github.com/ovh-ux/manager/issues/3186)) ([4b5c35a](https://github.com/ovh-ux/manager/commit/4b5c35ad849bb76bc61baaac8bfe38e2dc8a9749))



## [7.0.3](https://github.com/ovh-ux/manager/compare/@ovh-ux/component-rollup-config@7.0.2...@ovh-ux/component-rollup-config@7.0.3) (2020-05-15)


### Bug Fixes

* **plugins.translation-ui-router:** add type any to resolve const ([ab613c9](https://github.com/ovh-ux/manager/commit/ab613c95623c1239272744c939d288caf0a5c98b))



## [7.0.2](https://github.com/ovh-ux/manager/compare/@ovh-ux/component-rollup-config@7.0.1...@ovh-ux/component-rollup-config@7.0.2) (2020-05-13)


### Bug Fixes

* **deps:** replace deprecated babel plugin by @rollup/plugin-babel ([#2879](https://github.com/ovh-ux/manager/issues/2879)) ([b81309b](https://github.com/ovh-ux/manager/commit/b81309b492b12e24baf853634e5eb18ab45ccb1f))
* **plugin.translation-ui-router:** annotate dependency injection ([#2897](https://github.com/ovh-ux/manager/issues/2897)) ([ca5faff](https://github.com/ovh-ux/manager/commit/ca5faffe7ca1d84d621e29c7f0a0847f16488121))



## [7.0.1](https://github.com/ovh-ux/manager/compare/@ovh-ux/component-rollup-config@7.0.0...@ovh-ux/component-rollup-config@7.0.1) (2020-03-18)


### Performance Improvements

* **deps:** upgrade rollup and rollup plugins ([519e2ab](https://github.com/ovh-ux/manager/commit/519e2ab190fe631758fd2ac100f61d6934a3f334))



# [7.0.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/component-rollup-config@6.0.2...@ovh-ux/component-rollup-config@7.0.0) (2019-10-15)


### Code Refactoring

* **plugins.translations.utils:** remove deprecated languages ([#1452](https://github.com/ovh-ux/manager/issues/1452)) ([3297580](https://github.com/ovh-ux/manager/commit/3297580))


### BREAKING CHANGES

* **plugins.translations.utils:** remove deprecated nl_NL language



## [6.0.2](https://github.com/ovh-ux/manager/compare/@ovh-ux/component-rollup-config@6.0.1...@ovh-ux/component-rollup-config@6.0.2) (2019-08-29)


### Bug Fixes

* translations are now correctly imported ([#1248](https://github.com/ovh-ux/manager/issues/1248)) ([5be4005](https://github.com/ovh-ux/manager/commit/5be4005))



## [6.0.1](https://github.com/ovh-ux/manager/compare/@ovh-ux/component-rollup-config@6.0.0...@ovh-ux/component-rollup-config@6.0.1) (2019-07-31)


### Bug Fixes

* **component-rollup-config:** translationNormalize regex ([65aea9e](https://github.com/ovh-ux/manager/commit/65aea9e))
* **webpack-config:** normalize json with webpack loader ([e4d66b4](https://github.com/ovh-ux/manager/commit/e4d66b4))



# [6.0.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/component-rollup-config@5.2.2...@ovh-ux/component-rollup-config@6.0.0) (2019-07-22)


### Bug Fixes

* **tools.component.rollup.config:** merge array with custom config ([#1088](https://github.com/ovh-ux/manager/issues/1088)) ([b268198](https://github.com/ovh-ux/manager/commit/b268198))


### Code Refactoring

* **tools.component.rollup.config:** remove deprecated languages ([#1083](https://github.com/ovh-ux/manager/issues/1083)) ([bbd3267](https://github.com/ovh-ux/manager/commit/bbd3267)), closes [ovh-ux/manager#1042](https://github.com/ovh-ux/manager/issues/1042)


### BREAKING CHANGES

* **tools.component.rollup.config:** remove deprecated languages
  Keep only the `en_GB` from the languages' list

  Removed:
    - en_ASIA
    - en_AU
    - en_CA
    - en_SG
    - en_US



## [5.2.2](https://github.com/ovh-ux/manager/compare/@ovh-ux/component-rollup-config@5.2.1...@ovh-ux/component-rollup-config@5.2.2) (2019-07-15)


### Bug Fixes

* bump lodash to version >= 4.17.14 ([#1072](https://github.com/ovh-ux/manager/issues/1072)) ([1a32ddc](https://github.com/ovh-ux/manager/commit/1a32ddc))



## [5.2.1](https://github.com/ovh-ux/manager/compare/@ovh-ux/component-rollup-config@5.2.0...@ovh-ux/component-rollup-config@5.2.1) (2019-07-09)


### Bug Fixes

* **dependencies:** require right dependencies instead of devDependencies ([dbbe244](https://github.com/ovh-ux/manager/commit/dbbe244))



# [5.2.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/component-rollup-config@5.1.0...@ovh-ux/component-rollup-config@5.2.0) (2019-07-05)


### Features

* add new packages ([09b5158](https://github.com/ovh-ux/manager/commit/09b5158))



# [5.1.0](https://github.com/ovh-ux/component-rollup-config/compare/v5.0.3...v5.1.0) (2019-06-25)


### Features

* **plugin:** add languages environment variable to cli ([7bde3ca](https://github.com/ovh-ux/component-rollup-config/commit/7bde3ca))
* **plugin:** add translations.languages option ([1f3bc83](https://github.com/ovh-ux/component-rollup-config/commit/1f3bc83))



## [5.0.3](https://github.com/ovh-ux/component-rollup-config/compare/v5.0.2...v5.0.3) (2019-06-18)



## [5.0.2](https://github.com/ovh-ux/component-rollup-config/compare/v5.0.1...v5.0.2) (2019-06-10)


### Performance Improvements

* **build:** upgrade rollup dependency ([e9bcc54](https://github.com/ovh-ux/component-rollup-config/commit/e9bcc54))



## [5.0.1](https://github.com/ovh-ux/component-rollup-config/compare/v5.0.0...v5.0.1) (2019-04-26)


### Bug Fixes

* **loaders:** configure image loader to add assets in dist ([ff6945a](https://github.com/ovh-ux/component-rollup-config/commit/ff6945a))



# [5.0.0](https://github.com/ovh-ux/component-rollup-config/compare/v5.0.0-beta.9...v5.0.0) (2019-04-05)



# [5.0.0-beta.9](https://github.com/ovh-ux/component-rollup-config/compare/v5.0.0-beta.8...v5.0.0-beta.9) (2019-02-07)


### Features

* **plugin:** support image import ([5065a95](https://github.com/ovh-ux/component-rollup-config/commit/5065a95))



# [5.0.0-beta.8](https://github.com/ovh-ux/component-rollup-config/compare/v5.0.0-beta.7...v5.0.0-beta.8) (2019-02-06)


### Bug Fixes

* **plugins:** use fallback by file ([2f782a6](https://github.com/ovh-ux/component-rollup-config/commit/2f782a6))



# [5.0.0-beta.7](https://github.com/ovh-ux/component-rollup-config/compare/v5.0.0-beta.6...v5.0.0-beta.7) (2019-02-06)


### Bug Fixes

* reverse fallback and selected language ([01184dd](https://github.com/ovh-ux/component-rollup-config/commit/01184dd))



# [5.0.0-beta.6](https://github.com/ovh-ux/component-rollup-config/compare/v5.0.0-beta.5...v5.0.0-beta.6) (2019-02-05)


### Bug Fixes

* **plugins:** manage fallback by key instead of language ([09f9c84](https://github.com/ovh-ux/component-rollup-config/commit/09f9c84))



# [5.0.0-beta.5](https://github.com/ovh-ux/component-rollup-config/compare/v5.0.0-beta.4...v5.0.0-beta.5) (2019-01-21)



# [5.0.0-beta.4](https://github.com/ovh-ux/component-rollup-config/compare/v5.0.0-beta.3...v5.0.0-beta.4) (2019-01-15)



# [5.0.0-beta.3](https://github.com/ovh-ux/component-rollup-config/compare/v5.0.0-beta.2...v5.0.0-beta.3) (2018-12-12)


### Features

* manage json files ([#32](https://github.com/ovh-ux/component-rollup-config/issues/32)) ([e79d5e0](https://github.com/ovh-ux/component-rollup-config/commit/e79d5e0))



# [5.0.0-beta.2](https://github.com/ovh-ux/component-rollup-config/compare/v5.0.0-beta.1...v5.0.0-beta.2) (2018-12-03)


### Features

* **plugins:** add [@ovh-ux](https://github.com/ovh-ux)/rollup-plugin-less-tilde-import plugin ([#30](https://github.com/ovh-ux/component-rollup-config/issues/30)) ([06e91a1](https://github.com/ovh-ux/component-rollup-config/commit/06e91a1))



# [5.0.0-beta.1](https://github.com/ovh-ux/component-rollup-config/compare/v5.0.0-beta.0...v5.0.0-beta.1) (2018-11-21)


### Bug Fixes

* **plugins:** test module.default in injections ([#28](https://github.com/ovh-ux/component-rollup-config/issues/28)) ([7956013](https://github.com/ovh-ux/component-rollup-config/commit/7956013))



# [5.0.0-beta.0](https://github.com/ovh-ux/component-rollup-config/compare/v4.0.1...v5.0.0-beta.0) (2018-11-19)


### Bug Fixes

* **targets:** refactor config targets ([#27](https://github.com/ovh-ux/component-rollup-config/issues/27)) ([e23f751](https://github.com/ovh-ux/component-rollup-config/commit/e23f751))


### BREAKING CHANGES

* **targets:** usage has changed



## [4.0.1](https://github.com/ovh-ux/component-rollup-config/compare/v4.0.0...v4.0.1) (2018-11-18)


### Bug Fixes

* **deps:** move babel-preset-env from devDeps to dependencies ([285c90c](https://github.com/ovh-ux/component-rollup-config/commit/285c90c))



# [4.0.0](https://github.com/ovh-ux/component-rollup-config/compare/v3.0.1...v4.0.0) (2018-11-16)


### Features

* cjs and umd targets ([#25](https://github.com/ovh-ux/component-rollup-config/issues/25)) ([60da908](https://github.com/ovh-ux/component-rollup-config/commit/60da908))


### BREAKING CHANGES

* ES module are not targeted anymore



## [3.0.1](https://github.com/ovh-ux/component-rollup-config/compare/v3.0.0...v3.0.1) (2018-11-14)


### Features

* **plugins:** add less and sass rollup plugins ([c09b33f](https://github.com/ovh-ux/component-rollup-config/commit/c09b33f))



# [3.0.0](https://github.com/ovh-ux/component-rollup-config/compare/v2.1.5...v3.0.0) (2018-11-12)


### Bug Fixes

* remove unused rollup-plugin-less dependencie ([21bb564](https://github.com/ovh-ux/component-rollup-config/commit/21bb564))


### Features

* **plugins:** manage multiple formats instead of xml only ([61aab9f](https://github.com/ovh-ux/component-rollup-config/commit/61aab9f))


### BREAKING CHANGES

* Install corresponding dependencies

  Before: unused `rollup-plugin-less` with `less: ^2.7.1`

  After: `less` and `node-sass` has been installed

  - "less": "^3.8.1"
  - "node-sass": "^4.10.0"



## [2.1.5](https://github.com/ovh-ux/component-rollup-config/compare/v2.1.4...v2.1.5) (2018-11-06)


### Bug Fixes

* **package.json:** specify files entry ([e8de8e7](https://github.com/ovh-ux/component-rollup-config/commit/e8de8e7))
* **translation-xml:** rollback to regex to handle malformed xml ([c015b30](https://github.com/ovh-ux/component-rollup-config/commit/c015b30))



## [2.1.4](https://github.com/ovh-ux/component-rollup-config/compare/v2.1.3...v2.1.4) (2018-11-02)


### Bug Fixes

* **plugins.translation-ui-router:** handle multiple state definition ([a601ad2](https://github.com/ovh-ux/component-rollup-config/commit/a601ad2))
* **plugins.translation-utils:** set right languages ([dad4e6d](https://github.com/ovh-ux/component-rollup-config/commit/dad4e6d))



## [2.1.3](https://github.com/ovh-ux/component-rollup-config/compare/v2.1.2...v2.1.3) (2018-11-02)


### Bug Fixes

* **normalizepath:** use slash lib to ensure no back slash on windows ([4d6562d](https://github.com/ovh-ux/component-rollup-config/commit/4d6562d))
* **plugins.translations-xml:** apply toString if text is a number ([ecde964](https://github.com/ovh-ux/component-rollup-config/commit/ecde964))



<a name="2.1.2"></a>
## [2.1.2](https://github.com/ovh-ux/component-rollup-config/compare/v2.1.1...v2.1.2) (2018-10-31)


### Bug Fixes

* **filter:** add filtering boolean option ([2e88eb1](https://github.com/ovh-ux/component-rollup-config/commit/2e88eb1))



<a name="2.1.1"></a>
## [2.1.1](https://github.com/ovh-ux/component-rollup-config/compare/v2.1.0...v2.1.1) (2018-10-31)


### Bug Fixes

* **translation-xml:** filter text ([7309f73](https://github.com/ovh-ux/component-rollup-config/commit/7309f73))



<a name="2.1.0"></a>
# [2.1.0](https://github.com/ovh-ux/component-rollup-config/compare/v2.0.0...v2.1.0) (2018-10-30)


### Bug Fixes

* **deps:** remove translations-build-tools dependency ([f63435f](https://github.com/ovh-ux/component-rollup-config/commit/f63435f))
* replace xml2json with fast-xml-parser ([ce974b0](https://github.com/ovh-ux/component-rollup-config/commit/ce974b0))


### Features

* export plugins ([f48d4fb](https://github.com/ovh-ux/component-rollup-config/commit/f48d4fb))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/ovh-ux/component-rollup-config/compare/v1.1.2...v2.0.0) (2018-10-26)


### Bug Fixes

* minor code review changes ([f0ad948](https://github.com/ovh-ux/component-rollup-config/commit/f0ad948))
* minor code review fixes ([7abf25b](https://github.com/ovh-ux/component-rollup-config/commit/7abf25b))
* **eslint:** remove unused rule ([5b0c95b](https://github.com/ovh-ux/component-rollup-config/commit/5b0c95b))
* **plugins:** add languages list, add ngInject ([9f58835](https://github.com/ovh-ux/component-rollup-config/commit/9f58835))
* **test:** minor refactoring ([621e3c0](https://github.com/ovh-ux/component-rollup-config/commit/621e3c0))
* **translation-inject:** rename ([f0a9751](https://github.com/ovh-ux/component-rollup-config/commit/f0a9751))
* **translation-ui-router:** indent ([e72e45f](https://github.com/ovh-ux/component-rollup-config/commit/e72e45f))
* **translation-ui-router:** merge filters ([41a2ea7](https://github.com/ovh-ux/component-rollup-config/commit/41a2ea7))
* **translation-ui-router:** minor refactoring ([82e7136](https://github.com/ovh-ux/component-rollup-config/commit/82e7136))
* **translation-utils:** remove unused filter ([2788dc8](https://github.com/ovh-ux/component-rollup-config/commit/2788dc8))
* **translation-utils:** use template literal ([03458d8](https://github.com/ovh-ux/component-rollup-config/commit/03458d8))


### Features

* full rewrite using AST instead of regex ([cd4a5e8](https://github.com/ovh-ux/component-rollup-config/commit/cd4a5e8))
* **peerdeps:** use rollup-plugin-peer-deps-external ([318d437](https://github.com/ovh-ux/component-rollup-config/commit/318d437))
* **test:** add unit tests ([1f3852b](https://github.com/ovh-ux/component-rollup-config/commit/1f3852b))



<a name="1.1.2"></a>
## [1.1.2](https://github.com/ovh-ux/component-rollup-config/compare/v1.1.1...v1.1.2) (2018-10-22)


### Bug Fixes

* **dist:** filename is now based on base by default ([a5e2e3c](https://github.com/ovh-ux/component-rollup-config/commit/a5e2e3c))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/ovh-ux/component-rollup-config/compare/v1.1.0...v1.1.1) (2018-10-22)


### Bug Fixes

* **name:** remove .js from output name ([704a018](https://github.com/ovh-ux/component-rollup-config/commit/704a018))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/ovh-ux/component-rollup-config/compare/v1.0.0...v1.1.0) (2018-10-22)


### Features

* **name:** name can now be override ([52454f7](https://github.com/ovh-ux/component-rollup-config/commit/52454f7))



<a name="1.0.0"></a>
# 1.0.0 (2018-10-19)



