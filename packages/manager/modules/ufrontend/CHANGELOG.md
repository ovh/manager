## [2.1.1](https://github.com/ovh/manager/compare/@ovh-ux/ufrontend@2.1.0...@ovh-ux/ufrontend@2.1.1) (2021-10-26)


### Bug Fixes

* **config:** move types in appropriate folders ([#5768](https://github.com/ovh/manager/issues/5768)) ([2a8a3ec](https://github.com/ovh/manager/commit/2a8a3ecca270e104296b103b41de285eaf515c15))



# [2.1.0](https://github.com/ovh/manager/compare/@ovh-ux/ufrontend@2.0.0...@ovh-ux/ufrontend@2.1.0) (2021-10-06)


### Features

* **types:** add typescript to ufrontend and manager config ([4c76c32](https://github.com/ovh/manager/commit/4c76c325157939fdce0baf1c739bf606cd846f33))
* **ufrontend:** add treeshaking ([7ff7623](https://github.com/ovh/manager/commit/7ff7623b2d13b6f2aea2d3a4bfd9d62e169e93c6))



# [2.0.0](https://github.com/ovh/manager/compare/@ovh-ux/ufrontend@1.1.3...@ovh-ux/ufrontend@2.0.0) (2021-05-05)


### Bug Fixes

* **url-builder:** remove environment dependency ([9bbc977](https://github.com/ovh/manager/commit/9bbc9771b4ef04cdb10eda8d34a2406ba27f53f1))


### Features

* **application:** define application name when init an application ([a74d427](https://github.com/ovh/manager/commit/a74d42761be3f8892b9af3842451fe850434cece))
* **environment:** support environment instead of config ([2efcd93](https://github.com/ovh/manager/commit/2efcd9302973fffb9273950efe70650edab9ee14))


### BREAKING CHANGES

* **environment:** microfrontend exposes now the environment instead of config
* **url-builder:** `buildURL` and `buildURLs` signatures changed
  `buildURL` and `buildURLs` accepts `baseURL` as first parameter
  and are no longer able to find baseUrl from application `id`

Signed-off-by: Cyrille Bourgois <cyrille.bourgois@corp.ovh.com>



## [1.1.3](https://github.com/ovh/manager/compare/@ovh-ux/ufrontend@1.1.2...@ovh-ux/ufrontend@1.1.3) (2021-03-02)


### Bug Fixes

* bump semver range for @ovh-ux/manager-config package ([5f3eda1](https://github.com/ovh/manager/commit/5f3eda16abd4df3b46cdde241c827a1d1d6dc80c))



## [1.1.2](https://github.com/ovh/manager/compare/@ovh-ux/ufrontend@1.1.1...@ovh-ux/ufrontend@1.1.2) (2021-02-02)


### Bug Fixes

* bump semver range for @ovh-ux/manager-config package ([ca04d19](https://github.com/ovh/manager/commit/ca04d19b7a038544f1b5e3b211d0a1c3b70a0d5b))



## [1.1.1](https://github.com/ovh/manager/compare/@ovh-ux/ufrontend@1.1.0...@ovh-ux/ufrontend@1.1.1) (2021-01-04)


### Bug Fixes

* bump semver range for @ovh-ux/manager-config package ([23b469f](https://github.com/ovh/manager/commit/23b469f6264610c47076da908f688e8069f19c76))



# [1.1.0](https://github.com/ovh/manager/compare/@ovh-ux/ufrontend@1.0.0...@ovh-ux/ufrontend@1.1.0) (2020-12-22)


### Features

* **url:** build url based on location when possible ([7c5eded](https://github.com/ovh/manager/commit/7c5ededa5ad1c943ffc31b4aa5bf0f6b25d64e87))
* **url-builder:** add params pattern replacement ([1d39056](https://github.com/ovh/manager/commit/1d390567c671a5071706864fd1086648003e6456))
* **url-builder:** add url-builder ([734b05c](https://github.com/ovh/manager/commit/734b05c50198424fcfffc9917db47a2abb92be3d))



# [1.0.0](https://github.com/ovh/manager/compare/@ovh-ux/ufrontend@0.0.0...@ovh-ux/ufrontend@1.0.0) (2020-11-16)


### Code Refactoring

* **ufrontend:** fragments communication ([acaeb2e](https://github.com/ovh/manager/commit/acaeb2e9d1541e491c995fd41bb7cb0f6cd112ad))


### Features

* **ufrontend:** add communication api ([3578177](https://github.com/ovh/manager/commit/35781776e132fa0188ca662a8dfa84b84a296f35))
* **ufrontend:** add ufrontend module ([3a066b6](https://github.com/ovh/manager/commit/3a066b640ba40260f94587d36f9cc8075ced60cf))


### BREAKING CHANGES

* **ufrontend:** fragment communication api

Signed-off-by: frenauvh <florian.renaut@corp.ovh.com>



