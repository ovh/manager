# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.1.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dev-server-config@6.1.1...@ovh-ux/manager-dev-server-config@6.1.2) (2024-11-11)

**Note:** Version bump only for package @ovh-ux/manager-dev-server-config





## [6.1.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dev-server-config@6.1.0...@ovh-ux/manager-dev-server-config@6.1.1) (2024-11-07)

**Note:** Version bump only for package @ovh-ux/manager-dev-server-config





# [6.1.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dev-server-config@6.0.0...@ovh-ux/manager-dev-server-config@6.1.0) (2024-02-26)


### Features

* make it easy to target LABEU instead of PROD api ([#10878](https://github.com/ovh/manager/issues/10878)) ([f7e5045](https://github.com/ovh/manager/commit/f7e5045545056cdf6d3164e08ec63d08e5ed747e))





# [6.0.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dev-server-config@5.0.1...@ovh-ux/manager-dev-server-config@6.0.0) (2023-09-07)


### Build System

* bump nodejs to v18 and webpack to v5 ([6270204](https://github.com/ovh/manager/commit/6270204e59bbfb87ec000c5853be08027affbb69))


### BREAKING CHANGES

* bump webpack from v4 to v5

Signed-off-by: Florian Renaut <florian.renaut@corp.ovh.com>
Co-authored-by: Jisay <jean-christophe.alleman@corp.ovh.com>
Co-authored-by: Anoop N <anoop.n@ovhcloud.com>





## [5.0.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dev-server-config@5.0.0...@ovh-ux/manager-dev-server-config@5.0.1) (2022-10-19)


### Bug Fixes

* **dev-server-config:** allow to define custom host ([b59706d](https://github.com/ovh/manager/commit/b59706d20a3cf221ada6ab7779d14268dac84e9b))



# [5.0.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dev-server-config@4.0.0...@ovh-ux/manager-dev-server-config@5.0.0) (2022-09-12)


### Code Refactoring

* **dev-server-config:** remove registry proxy ([6339caf](https://github.com/ovh/manager/commit/6339caf22c59038a9fb45ae6c5fdfb336f6436e0))


### BREAKING CHANGES

* **dev-server-config:** remove registry proxy configuration



# [4.0.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dev-server-config@3.0.0...@ovh-ux/manager-dev-server-config@4.0.0) (2022-03-04)


### Build System

* **deps:** require Node.js 16 ([5687c17](https://github.com/ovh/manager/commit/5687c17f1ae65c07ffde12abeecd0f9a955af8b0)), closes [#6444](https://github.com/ovh/manager/issues/6444)


### BREAKING CHANGES

* **deps:** require Node.js 16



# [3.0.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dev-server-config@2.0.0...@ovh-ux/manager-dev-server-config@3.0.0) (2021-11-29)


### Build System

* require Node.js 14 ([f1ec93e](https://github.com/ovh/manager/commit/f1ec93ef1156184dda02762eb62c0d838be495b6))


### BREAKING CHANGES

* require Node.js 14



# [2.0.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dev-server-config@1.1.1...@ovh-ux/manager-dev-server-config@2.0.0) (2021-01-13)


### Bug Fixes

* **proxy:** fix registry proxy path rewrite ([#4234](https://github.com/ovh/manager/issues/4234)) ([a42b53a](https://github.com/ovh/manager/commit/a42b53a99fba7ad4c8d770587a661e42b15d30d3))


### Features

* allow to rewrite path and headers when using dev proxy ([2a71352](https://github.com/ovh/manager/commit/2a71352a5500e897b740a0ec47b9834eeb3eb3cc))


### BREAKING CHANGES

* nic property is removed in favor of headers to allow more customization



## [1.1.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dev-server-config@1.1.0...@ovh-ux/manager-dev-server-config@1.1.1) (2020-12-08)


### Bug Fixes

* **sso:** avoid region config error ([#4140](https://github.com/ovh/manager/issues/4140)) ([3eb55c5](https://github.com/ovh/manager/commit/3eb55c5453d131557a7dee28efbe69994610e22d))



# [1.1.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dev-server-config@1.0.0...@ovh-ux/manager-dev-server-config@1.1.0) (2020-11-16)


### Features

* **dev-server-config:** add registry proxy config ([bd61f39](https://github.com/ovh/manager/commit/bd61f396cea43c8c11a1e9c7dc0afb14bf924f89))
* **dev-server-config:** add registryUrl in registry proxy config ([6809a49](https://github.com/ovh/manager/commit/6809a491d88446ae3f843ba115ebb4c14843f99a))



# [1.0.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dev-server-config@0.0.0...@ovh-ux/manager-dev-server-config@1.0.0) (2020-07-08)


### Features

* **dev-server-config:** add manager-dev-server-config package ([58b9589](https://github.com/ovh/manager/commit/58b95892c056bf1333c6f4c7956e7a6f4485a47f))


### BREAKING CHANGES

* **dev-server-config:** add manager-dev-server-config package

Signed-off-by: Cyrille Bourgois <cyrille.bourgois@corp.ovh.com>
