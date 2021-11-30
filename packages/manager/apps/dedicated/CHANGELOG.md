# [17.6.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@17.5.7...@ovh-ux/manager-dedicated@17.6.0) (2021-11-30)


### Bug Fixes

* **dedicated.server:** redirect from ovh-task page to dashboard ([932239a](https://github.com/ovh/manager/commit/932239a710a05e3c8682798e9a89d852a5667ce4))


### Features

* **dedicated:** removal of status page ([2567d38](https://github.com/ovh/manager/commit/2567d38b15344ea38567b2dd156e1ad4c62225a8))
* change of url to status-ovhcloud ([#5958](https://github.com/ovh/manager/issues/5958)) ([cf8051d](https://github.com/ovh/manager/commit/cf8051d1aae60356d3f43218b459a2b3532a959b))



## [17.5.7](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@17.5.6...@ovh-ux/manager-dedicated@17.5.7) (2021-11-22)


### Bug Fixes

* **dedicated:** fix message horizontal scroll ([18b402a](https://github.com/ovh/manager/commit/18b402a0f6fffd1521846690795d346db11324c3)), closes [#DTRSD-50951](https://github.com/ovh/manager/issues/DTRSD-50951)
* **deps:** bump validator from 11.1.0 to 13.7.0 range ([#5903](https://github.com/ovh/manager/issues/5903)) ([a5a74e5](https://github.com/ovh/manager/commit/a5a74e58db1859812eca5bc82c2847165e9ad6dd))
* **i18n:** add missing translations [CDS 1253] ([3c25560](https://github.com/ovh/manager/commit/3c25560870b866815b00c341c6c055896103a73f))



## [17.5.6](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@17.5.5...@ovh-ux/manager-dedicated@17.5.6) (2021-11-15)


### Bug Fixes

* **server.details:** enable bandwidth option for new range ([#5907](https://github.com/ovh/manager/issues/5907)) ([2a5a137](https://github.com/ovh/manager/commit/2a5a13798ccdc7ba5bf54ef17cc0b10148a9bb82))



## [17.5.5](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@17.5.4...@ovh-ux/manager-dedicated@17.5.5) (2021-11-10)


### Bug Fixes

* **i18n:** add missing translations [CDS 1253] ([d659951](https://github.com/ovh/manager/commit/d6599513a8a7978bb217d8d3391d5a72d8d5d3c9))



## [17.5.4](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@17.5.3...@ovh-ux/manager-dedicated@17.5.4) (2021-11-08)


### Bug Fixes

* **server:** fix price display for bandwidth order ([#5880](https://github.com/ovh/manager/issues/5880)) ([112f57f](https://github.com/ovh/manager/commit/112f57f0f85e026de27e171224a58603e7b9f3e4))



## [17.5.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@17.5.2...@ovh-ux/manager-dedicated@17.5.3) (2021-11-08)


### Bug Fixes

* **deps:** upgrade `@ovh-ux/manager-billing` to `^0.6.0-alpha.0` ([50a7339](https://github.com/ovh/manager/commit/50a7339a91e792bd1d2028f7567fae93ba6df0f7))



## [17.5.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@17.5.1...@ovh-ux/manager-dedicated@17.5.2) (2021-11-04)


### Bug Fixes

* **i18n:** add missing translations [CDS 1239] ([#5890](https://github.com/ovh/manager/issues/5890)) ([aa6da29](https://github.com/ovh/manager/commit/aa6da29a4acbbd8f8c1ef4fb781a9aed41e44149))



## [17.5.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@17.5.0...@ovh-ux/manager-dedicated@17.5.1) (2021-11-04)


### Bug Fixes

* bump ng-ovh-payment-method to next major ([687f1e4](https://github.com/ovh/manager/commit/687f1e47daefb5c19563c5c434fa281a70be9049))
* **billing.autorenew:** track service type ([#5797](https://github.com/ovh/manager/issues/5797)) ([3abe911](https://github.com/ovh/manager/commit/3abe91191e0c13b23825ab42fed7ee9b3c2e5084))
* **zerto:** fix order issue ([#5791](https://github.com/ovh/manager/issues/5791)) ([08b4738](https://github.com/ovh/manager/commit/08b473870e85b55dee747699d743d34b0915f51a))
* remove unused translations [CDS] ([6e28d1a](https://github.com/ovh/manager/commit/6e28d1aba936ed70282ad64717b9435106db86c4))
* **veeam:** veeam backup plan ([#5819](https://github.com/ovh/manager/issues/5819)) ([247df46](https://github.com/ovh/manager/commit/247df46a5b9385d7aa027c0ece293422d2a3c194)), closes [#DTRSD-36848](https://github.com/ovh/manager/issues/DTRSD-36848)



# [17.5.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@17.4.2...@ovh-ux/manager-dedicated@17.5.0) (2021-11-02)


### Bug Fixes

* **account.dashboard:** catch if `/me/bill` fails ([#5813](https://github.com/ovh/manager/issues/5813)) ([b21b8b6](https://github.com/ovh/manager/commit/b21b8b60a99aefdb46a227392ea83c1ba786ddbd))


### Features

* **server:** use upgrade system instead of range name ([#5841](https://github.com/ovh/manager/issues/5841)) ([c6c161a](https://github.com/ovh/manager/commit/c6c161af198fafaea50d4488e2cc3236cacaf2bb))


### Reverts

* Revert "fix(server.dashboard): restore mrtg tile (#5504)" (#5858) ([bf7f89e](https://github.com/ovh/manager/commit/bf7f89eed4b122cb9ec4752253444195dbb6fe9a)), closes [#5504](https://github.com/ovh/manager/issues/5504) [#5858](https://github.com/ovh/manager/issues/5858)



## [17.4.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@17.4.1...@ovh-ux/manager-dedicated@17.4.2) (2021-10-28)


### Bug Fixes

* ip reverse delete ([#5848](https://github.com/ovh/manager/issues/5848)) ([0b08abb](https://github.com/ovh/manager/commit/0b08abb9039d5f3e16831c42b8a8dfd2f68f34a5))



## [17.4.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@17.4.0...@ovh-ux/manager-dedicated@17.4.1) (2021-10-28)


### Bug Fixes

* update range for @ovh-ux/manager-billing ([#5851](https://github.com/ovh/manager/issues/5851)) ([130b87b](https://github.com/ovh/manager/commit/130b87b021ca5641863626a08da4bb412cec29e3))



# [17.4.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@17.3.0...@ovh-ux/manager-dedicated@17.4.0) (2021-10-28)


### Features

* **navbar.marketplace:** add marketplace to top navbar ([#5828](https://github.com/ovh/manager/issues/5828)) ([815c49f](https://github.com/ovh/manager/commit/815c49f4f3cf7a598aee79d99798033ac5952bba))



# [17.3.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@17.2.0...@ovh-ux/manager-dedicated@17.3.0) (2021-10-28)


### Bug Fixes

* **i18n:** add missing translations [CDS 1214] ([f96763a](https://github.com/ovh/manager/commit/f96763a289143bc296d89f15137b6d33fe4898fd))


### Features

* **hpc:** enable range migration ([3feb2dd](https://github.com/ovh/manager/commit/3feb2dd09ebd8fe0e883dd55ced1a83f3c3737c6))



# [17.2.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@17.1.3...@ovh-ux/manager-dedicated@17.2.0) (2021-10-27)


### Bug Fixes

* **i18n:** add missing translations [CDS 1239] ([51239cf](https://github.com/ovh/manager/commit/51239cfb10e50f2d78aa4b42ae07d8e6a2021bc7))
* add corresponding translations for netapp product ([f6b7039](https://github.com/ovh/manager/commit/f6b70399ae82b7c8a091a18a8d71d387c3043674))


### Features

* add `@ovh-ux/manager-netapp` module ([b544301](https://github.com/ovh/manager/commit/b544301a11aa39cecce6abff10c376911a792ab1))



## [17.1.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@17.1.2...@ovh-ux/manager-dedicated@17.1.3) (2021-10-26)


### Bug Fixes

* **server.traffic:** fix usage quota balance ([#5733](https://github.com/ovh/manager/issues/5733)) ([a10a4aa](https://github.com/ovh/manager/commit/a10a4aa80e66d6015b93ef12ccd3ffcb56d8466e))
* remove unused translations [CDS] ([258488f](https://github.com/ovh/manager/commit/258488f9a54ce332e6dfb016ccc32d14d985c67d))
* **locales:** remove es_US translations files ([#5709](https://github.com/ovh/manager/issues/5709)) ([3894a13](https://github.com/ovh/manager/commit/3894a1388393ea08b51e08bbfda416e7746fc8ca)), closes [#5685](https://github.com/ovh/manager/issues/5685)
* **server.ipmi:** force to use a trusted ip ([#5679](https://github.com/ovh/manager/issues/5679)) ([dfb1dea](https://github.com/ovh/manager/commit/dfb1dea1071f7ed5a42d8b0480a4b20471e9290d))



## [17.1.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@17.1.1...@ovh-ux/manager-dedicated@17.1.2) (2021-10-26)


### Bug Fixes

* **dedicated:** disable features in dedicated server for trusted nic ([51eb1f1](https://github.com/ovh/manager/commit/51eb1f17479f5ea15a2aaf334d383da45a5ec2c2))



## [17.1.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@17.1.0...@ovh-ux/manager-dedicated@17.1.1) (2021-10-25)


### Bug Fixes

* **server:** translate correctly localization filter ([#5775](https://github.com/ovh/manager/issues/5775)) ([a22cd02](https://github.com/ovh/manager/commit/a22cd021b1870fe7213df1473de8f442c56103f7))
* **server.details:** enable bandwidth option for new range ([#5740](https://github.com/ovh/manager/issues/5740)) ([509bde1](https://github.com/ovh/manager/commit/509bde13487b3f8dcb7b4a72e403d6c65ed55e1c))



# [17.1.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@17.0.1...@ovh-ux/manager-dedicated@17.1.0) (2021-10-21)


### Features

* commit re-commit text changes ([6588853](https://github.com/ovh/manager/commit/658885373ef0f592a0776eec0759b9a5c9d84273)), closes [#MANAGER-7434](https://github.com/ovh/manager/issues/MANAGER-7434)



## [17.0.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@17.0.0...@ovh-ux/manager-dedicated@17.0.1) (2021-10-07)


### Bug Fixes

* **dedicated:** pcc service pack upgrade ([#5696](https://github.com/ovh/manager/issues/5696)) ([3cfb6fc](https://github.com/ovh/manager/commit/3cfb6fcd15335c29d3b86b8781cdf59450c0d591))



# [17.0.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.38.0...@ovh-ux/manager-dedicated@17.0.0) (2021-10-07)


### Bug Fixes

* **i18n:** add missing translations [CDS 1184] ([df03553](https://github.com/ovh/manager/commit/df035537b0d5271384d1cddb582d583279e15318))
* **i18n:** add missing translations [CDS 1191] ([9c37bb4](https://github.com/ovh/manager/commit/9c37bb4748eebfdbe0a5e40f5593dede2afab073))
* add anthos to services and contacts page ([d5b8b90](https://github.com/ovh/manager/commit/d5b8b90f6874356da88e8de74a367ccca407230f)), closes [#MANAGER-7385](https://github.com/ovh/manager/issues/MANAGER-7385)
* rename hosted private cloud to vmware ([030a38f](https://github.com/ovh/manager/commit/030a38f1421c52a86bc43c482a8c99fd912e69ad)), closes [#MANAGER-7545](https://github.com/ovh/manager/issues/MANAGER-7545)
* **server-sidebar:** add anthos entry ([9618f79](https://github.com/ovh/manager/commit/9618f79c90721687a6f43e4f9c72713b53e10853)), closes [#MANAGER-7384](https://github.com/ovh/manager/issues/MANAGER-7384)


### Features

* add anthos ([14e3f25](https://github.com/ovh/manager/commit/14e3f25178a1a6884444b4576dc96e2a0818499f)), closes [#MANAGER-7296](https://github.com/ovh/manager/issues/MANAGER-7296)


### BREAKING CHANGES

* add anthos module



# [16.38.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.37.4...@ovh-ux/manager-dedicated@16.38.0) (2021-10-06)


### Bug Fixes

* **i18n:** add missing translations [CDS 1164] ([8d86437](https://github.com/ovh/manager/commit/8d86437286e1ebbc48054e9512108994b0e8a0bc))
* **licence:** fix controller name ([#5671](https://github.com/ovh/manager/issues/5671)) ([9c2ebfa](https://github.com/ovh/manager/commit/9c2ebfa6ab594c08837b3753fa5ab67cea478f94))
* **server.dashboard:** disable on-site intervention ([#5683](https://github.com/ovh/manager/issues/5683)) ([6f0e41a](https://github.com/ovh/manager/commit/6f0e41ade7793758a92e1aa762943ac38e8cc47c))
* **server.dashboard:** remove intervention typo ([#5236](https://github.com/ovh/manager/issues/5236)) ([703f231](https://github.com/ovh/manager/commit/703f2310acadd20458fb0534b319139347176aad))
* remove unused translations [CDS] ([b334f10](https://github.com/ovh/manager/commit/b334f1006af2bbb3057646127e5ebc5ce5390b63))


### Features

* **ufrontend:** add treeshaking ([7ff7623](https://github.com/ovh/manager/commit/7ff7623b2d13b6f2aea2d3a4bfd9d62e169e93c6))



## [16.37.4](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.37.3...@ovh-ux/manager-dedicated@16.37.4) (2021-09-23)


### Bug Fixes

* **guides:** correct us wrongGuideLinksForUS ([#5598](https://github.com/ovh/manager/issues/5598)) ([911b547](https://github.com/ovh/manager/commit/911b5474f19c257241d61c69d4e8a951816f764f))



## [16.37.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.37.2...@ovh-ux/manager-dedicated@16.37.3) (2021-09-22)


### Bug Fixes

* remove unused translations [CDS] ([c910a7e](https://github.com/ovh/manager/commit/c910a7ebaaad62e4734ec0714919c2b546dfeed0))
* **i18n:** add missing translations [CDS 1143] ([82a4903](https://github.com/ovh/manager/commit/82a490322241b549bcbcbae767bc100828efe909))
* **i18n:** add missing translations [CDS 1147] ([f4f0bf3](https://github.com/ovh/manager/commit/f4f0bf31b7cea03fe24565b25e8edfab286b3820))
* **i18n:** add missing translations [CDS 1153] ([ebe69d0](https://github.com/ovh/manager/commit/ebe69d0113f36cccb3c3f9625bb87aaa50f37725))
* **i18n:** add missing translations [CDS 1157] ([905a852](https://github.com/ovh/manager/commit/905a852abab9e8ffdf5fe2f47dbfd477e75ba146))
* remove unused translations [CDS] ([8d4164c](https://github.com/ovh/manager/commit/8d4164cfc23dbf0f936a3d5167f29170d8202016))



## [16.37.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.37.1...@ovh-ux/manager-dedicated@16.37.2) (2021-09-15)


### Bug Fixes

* **dedicated.server:** order bandwith for new ranges ([#5540](https://github.com/ovh/manager/issues/5540)) ([bf7d806](https://github.com/ovh/manager/commit/bf7d8068643a6122eff7b0de1029a0b6c785dbf8))



## [16.37.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.37.0...@ovh-ux/manager-dedicated@16.37.1) (2021-09-15)


### Bug Fixes

* **dedicated:** add trusted label ([db48e30](https://github.com/ovh/manager/commit/db48e3097b154c3d5773b10ab2d88a33f7af60c8)), closes [#MANAGER-7130](https://github.com/ovh/manager/issues/MANAGER-7130)
* **dedicated:** breadcrumb translations for options ([af60402](https://github.com/ovh/manager/commit/af6040224e9ee6323963eaaf71fd43eb59aaa0d5)), closes [#MANAGER-7499](https://github.com/ovh/manager/issues/MANAGER-7499)
* **dedicated:** change backup url for snc hpc ([431a6d6](https://github.com/ovh/manager/commit/431a6d6882a0af76501037746aa095d07ba3bf4b))
* **dedicated:** display guides based on universe ([43e4ee5](https://github.com/ovh/manager/commit/43e4ee5f8bc3aefeb5e885097c168c13f2636602)), closes [#MANAGER-7417](https://github.com/ovh/manager/issues/MANAGER-7417)
* **dedicated:** drp availability for trusted nic ([8ce6cea](https://github.com/ovh/manager/commit/8ce6ceae102f181c82ec9ab021757140a07be653)), closes [#MANAGER-5414](https://github.com/ovh/manager/issues/MANAGER-5414)
* **dedicated:** hpc users breadcrumb ([88de01b](https://github.com/ovh/manager/commit/88de01ba60cdeeeaa19e013294f98aac3a4b22e8)), closes [#MANAGER-7422](https://github.com/ovh/manager/issues/MANAGER-7422)
* **dedicated:** trusted nic price info ([d1f50f1](https://github.com/ovh/manager/commit/d1f50f142e2163d77344947f9e8c0d7d69df1e55)), closes [#MANAGER-5414](https://github.com/ovh/manager/issues/MANAGER-5414)
* **dedicated:** update service contacts for trusted nic ([335e2a2](https://github.com/ovh/manager/commit/335e2a2dfa4f611db71d5ed5d4f7516acbc720ac)), closes [#MANAGER-7130](https://github.com/ovh/manager/issues/MANAGER-7130)
* **dedicated.contacts.request:** error popover ([d3e2000](https://github.com/ovh/manager/commit/d3e2000c20a35ee2d5a724ed27141dca80651ed7)), closes [#MANAGER-7355](https://github.com/ovh/manager/issues/MANAGER-7355)
* **dedicated.dedicated-cloud:** add 'hosted' text to private cloud ([4d5699f](https://github.com/ovh/manager/commit/4d5699fa907ae57d3854c16719245217556c5c0d)), closes [#MANAGER-7420](https://github.com/ovh/manager/issues/MANAGER-7420)
* **dedicated.support:** support levels based on availability ([e077d2c](https://github.com/ovh/manager/commit/e077d2c9bb5e5c29ad374517e37597a13220ec2b)), closes [#MANAGER-7351](https://github.com/ovh/manager/issues/MANAGER-7351)
* **i18n:** add missing translations [CDS 1129] ([51b8eff](https://github.com/ovh/manager/commit/51b8effb7e90c1f0aec8912d886299606fd975aa))
* **i18n:** add missing translations [CDS 1130] ([e61e7c7](https://github.com/ovh/manager/commit/e61e7c74f401e9c39f10c182b67a44d5af579d8a))



# [16.37.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.36.3...@ovh-ux/manager-dedicated@16.37.0) (2021-09-09)


### Bug Fixes

* **ip:** expose service ([#5503](https://github.com/ovh/manager/issues/5503)) ([87862ea](https://github.com/ovh/manager/commit/87862eab5472421d0684362feeb24a79cca58d85))
* **server.dashboard:** restore mrtg tile ([#5504](https://github.com/ovh/manager/issues/5504)) ([b963362](https://github.com/ovh/manager/commit/b96336254f7c96438b3e27d16e55b0c9ede5e9a7))


### Features

* add retention advices ([#5375](https://github.com/ovh/manager/issues/5375)) ([e38b161](https://github.com/ovh/manager/commit/e38b161a6daeb6e5cb92f4df16344e488737b6bc))



## [16.36.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.36.2...@ovh-ux/manager-dedicated@16.36.3) (2021-09-07)


### Bug Fixes

* update billing url for enterprise customers ([#5329](https://github.com/ovh/manager/issues/5329)) ([d09753e](https://github.com/ovh/manager/commit/d09753e6f6ce6823171ee483568195dffc73ce27))
* **i18n:** add missing translations [CDS 1118] ([58b7b7e](https://github.com/ovh/manager/commit/58b7b7e5c19798d3fcae828864717c57e07990d8))
* **i18n:** add missing translations [CDS 1138] ([c927c3b](https://github.com/ovh/manager/commit/c927c3bd641c42b507659cd2d4a552a7a85be56a))
* **server:** fix order bandwidth translation ([#5486](https://github.com/ovh/manager/issues/5486)) ([b5c6cd7](https://github.com/ovh/manager/commit/b5c6cd794f1643c873650249d10e6e2cd499be5b))
* remove unused translations [CDS] ([d73b072](https://github.com/ovh/manager/commit/d73b072ffb7b0708fad0ab0d84f80730d5b1d36d))
* **i18n:** add missing translations [CDS 1119] ([c9bb0db](https://github.com/ovh/manager/commit/c9bb0dbcd18fc9d2ba362c37c3b699d7c3e01128))
* **i18n:** add missing translations [CDS 1121] ([#5458](https://github.com/ovh/manager/issues/5458)) ([025a1eb](https://github.com/ovh/manager/commit/025a1eb55793b84beb1efe81574ddbe4028705a4))
* **i18n:** remove extra translation files ([#5469](https://github.com/ovh/manager/issues/5469)) ([3b93ab6](https://github.com/ovh/manager/commit/3b93ab6ca7cdc1334870f6ca34c7d6505a462145))
* **translations:** refresh translation after transition ([#5405](https://github.com/ovh/manager/issues/5405)) ([9d940a2](https://github.com/ovh/manager/commit/9d940a218fbb327fc2f7c93c6b473ea44707c009))



## [16.36.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.36.1...@ovh-ux/manager-dedicated@16.36.2) (2021-09-06)


### Bug Fixes

* **server:** fix bandwidth order translation ([#5481](https://github.com/ovh/manager/issues/5481)) ([3b932e2](https://github.com/ovh/manager/commit/3b932e21fbdc74a15004de635e6a5777f481ee2b))



## [16.36.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.36.0...@ovh-ux/manager-dedicated@16.36.1) (2021-09-06)


### Bug Fixes

* **server:** fix bandwidth order for hgv2 range ([#5468](https://github.com/ovh/manager/issues/5468)) ([ec03d87](https://github.com/ovh/manager/commit/ec03d877860489a266c53991f8699ddcecba74cc))



# [16.36.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.35.2...@ovh-ux/manager-dedicated@16.36.0) (2021-08-25)


### Bug Fixes

* **datacenter.backup:** change some content ([#5376](https://github.com/ovh/manager/issues/5376)) ([15aae03](https://github.com/ovh/manager/commit/15aae036cb34d2c8fa937e4a3ab2ab76e647a418))
* **deps:** upgrade `@ovh-ux/ui-kit` to `v5.1.0` ([#5429](https://github.com/ovh/manager/issues/5429)) ([7099de9](https://github.com/ovh/manager/commit/7099de97320cdbdac5652b2c7ed70327251ed749))
* **deps:** upgrade semver range for `@ovh-ux/manager-billing` module ([5ea7648](https://github.com/ovh/manager/commit/5ea7648344ba7f910dbbbd6381538aaf6f7699a6))
* **i18n:** add missing translations [CDS 1102] ([196eb3f](https://github.com/ovh/manager/commit/196eb3f2ae608f16558617d1a042968dfae10b80))
* **i18n:** add missing translations [CDS 1108] ([4742eca](https://github.com/ovh/manager/commit/4742eca51f26be6b0230c6738bdf189df630757d))
* **i18n:** add missing translations [CDS 1111] ([d57157f](https://github.com/ovh/manager/commit/d57157f80118d997f4aa8064c84488fec7868ec8))
* **i18n:** add missing translations [CDS 1116] ([e6967e1](https://github.com/ovh/manager/commit/e6967e161d78ebbd27d801340d3de737c80777b7))
* replace `oui-icon-external_link` by `oui-icon-external-link` ([645c8e6](https://github.com/ovh/manager/commit/645c8e675bad92c5928664a8aac2db36626fa397))


### Features

* **dedicated.server.dashboard.resiliation:** concat end_strategy option ([06c4d3a](https://github.com/ovh/manager/commit/06c4d3add958d22dd057b6c516a7a9257ce52366))
* **deps:** upgrade `@ovh-ux/ui-kit` to `v5.0.0` ([d09ca10](https://github.com/ovh/manager/commit/d09ca10f4b7ca629e0b2f1fcb59278ea7f309a9e))



## [16.35.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.35.1...@ovh-ux/manager-dedicated@16.35.2) (2021-08-11)


### Bug Fixes

* name correctly `country_RE` translation ([#5394](https://github.com/ovh/manager/issues/5394)) ([5231dc6](https://github.com/ovh/manager/commit/5231dc6cd2daef573c6ce37180daa74c45ee6c1e))
* **i18n:** add missing translations [CDS 1098] ([e185446](https://github.com/ovh/manager/commit/e1854465b7a0729ece46b1b28dad3234bd138294))
* remove unused translations [CDS] ([39418b2](https://github.com/ovh/manager/commit/39418b27e4c5c122abc524e2d66be3a4363f5c98))
* remove vCenter access policy button ([#5372](https://github.com/ovh/manager/issues/5372)) ([3fb20fa](https://github.com/ovh/manager/commit/3fb20fac9e7a5cf93a2a8a9921f6034c7f9ef51d))
* **server.details:** add missing translation about rtm documentation ([#5379](https://github.com/ovh/manager/issues/5379)) ([9260144](https://github.com/ovh/manager/commit/9260144eaf6c7478921c9ab344dea8909d9a1255))


### Performance Improvements

* **dedicated:** remove ng-ckeditor import ([7df1489](https://github.com/ovh/manager/commit/7df14893daf790a99c6bb7c0c8d2562b08b48f8a))
* **dedicated:** update exchange module ([aa356a8](https://github.com/ovh/manager/commit/aa356a83c2f97f14859a4d1ae8545f0c4450c323))



## [16.35.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.35.0...@ovh-ux/manager-dedicated@16.35.1) (2021-07-29)


### Bug Fixes

* **account.contact:** encode parameter ([#5337](https://github.com/ovh/manager/issues/5337)) ([0bb3915](https://github.com/ovh/manager/commit/0bb39152cf852f9f033cf7882ba2141b3f869ac2))



# [16.35.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.34.1...@ovh-ux/manager-dedicated@16.35.0) (2021-07-28)


### Bug Fixes

* bump @ovh-ux/ui-kit to v4.7.0 ([#5315](https://github.com/ovh/manager/issues/5315)) ([bd9b540](https://github.com/ovh/manager/commit/bd9b54015511a001a93866e43c48244fb81af907))


### Features

* **dedicated:** housing section lazy loading ([59bdfed](https://github.com/ovh/manager/commit/59bdfedb9b75a94d2fa03c950383af60bfeb26ea))



## [16.34.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.34.0...@ovh-ux/manager-dedicated@16.34.1) (2021-07-28)


### Bug Fixes

* **hpc:** switch orderable commercial ranges api ([#5320](https://github.com/ovh/manager/issues/5320)) ([9a3b39e](https://github.com/ovh/manager/commit/9a3b39e3cd2fe45b0e2502a8f06109259fc7b931))



# [16.34.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.33.1...@ovh-ux/manager-dedicated@16.34.0) (2021-07-26)


### Bug Fixes

* **dedicated:** fix ip and license import module ([5564aa3](https://github.com/ovh/manager/commit/5564aa3eb5d4b832cdf6a06ba5e9fb115418dca0))
* **i18n:** add missing translations [CDS 1045] ([d4f72a2](https://github.com/ovh/manager/commit/d4f72a2e1207973da054a6478bbef364e0b4f70b))
* **ip:** missing ip range service ([#5297](https://github.com/ovh/manager/issues/5297)) ([71f202a](https://github.com/ovh/manager/commit/71f202ab9953fc475eefc9fa447d078ee945d3ce))
* **license:** move redirection into index.js ([f77a6f0](https://github.com/ovh/manager/commit/f77a6f0fa9e19283c14649133aa7dff9815bede9))
* **user.session:** prevent display `server` as current universe ([#5252](https://github.com/ovh/manager/issues/5252)) ([4ea3150](https://github.com/ovh/manager/commit/4ea3150941c5f3c9b3fb23bd07bb102ef484358b)), closes [#4353](https://github.com/ovh/manager/issues/4353)


### Features

* **dedicated:** ip section lazy loading ([9290e04](https://github.com/ovh/manager/commit/9290e04b8562a54efef553dd6420b8a48cebc76f))


### Performance Improvements

* **cdn:** add lazyloading in CDN section ([#5145](https://github.com/ovh/manager/issues/5145)) ([144104d](https://github.com/ovh/manager/commit/144104de2618ff6334c5b43e79ab1c33bd01a457))
* **license:** add lazyloading in license section ([6a110de](https://github.com/ovh/manager/commit/6a110dea0f5eacaed5c9243b85fe7111d6bbf717))



## [16.33.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.33.0...@ovh-ux/manager-dedicated@16.33.1) (2021-07-23)


### Bug Fixes

* **ip:** missing ip range service ([#5297](https://github.com/ovh/manager/issues/5297)) ([71f202a](https://github.com/ovh/manager/commit/71f202ab9953fc475eefc9fa447d078ee945d3ce))



# [16.33.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.32.2...@ovh-ux/manager-dedicated@16.33.0) (2021-07-19)


### Bug Fixes

* **dedicated:** fix ip and license import module ([5564aa3](https://github.com/ovh/manager/commit/5564aa3eb5d4b832cdf6a06ba5e9fb115418dca0))
* **i18n:** add missing translations [CDS 1045] ([d4f72a2](https://github.com/ovh/manager/commit/d4f72a2e1207973da054a6478bbef364e0b4f70b))
* **license:** move redirection into index.js ([f77a6f0](https://github.com/ovh/manager/commit/f77a6f0fa9e19283c14649133aa7dff9815bede9))
* **user.session:** prevent display `server` as current universe ([#5252](https://github.com/ovh/manager/issues/5252)) ([4ea3150](https://github.com/ovh/manager/commit/4ea3150941c5f3c9b3fb23bd07bb102ef484358b)), closes [#4353](https://github.com/ovh/manager/issues/4353)


### Features

* **dedicated:** ip section lazy loading ([9290e04](https://github.com/ovh/manager/commit/9290e04b8562a54efef553dd6420b8a48cebc76f))


### Performance Improvements

* **cdn:** add lazyloading in CDN section ([#5145](https://github.com/ovh/manager/issues/5145)) ([144104d](https://github.com/ovh/manager/commit/144104de2618ff6334c5b43e79ab1c33bd01a457))
* **license:** add lazyloading in license section ([6a110de](https://github.com/ovh/manager/commit/6a110dea0f5eacaed5c9243b85fe7111d6bbf717))



## [16.32.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.32.1...@ovh-ux/manager-dedicated@16.32.2) (2021-07-07)


### Bug Fixes

* **ip:** fix ip parking filter ([#5191](https://github.com/ovh/manager/issues/5191)) ([4dd289b](https://github.com/ovh/manager/commit/4dd289bb7c16c92e5d2db68d6cfcb25e34a6578c))



## [16.32.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.32.0...@ovh-ux/manager-dedicated@16.32.1) (2021-07-01)


### Bug Fixes

* **servers:** display right datacenter location ([#5196](https://github.com/ovh/manager/issues/5196)) ([fa3a8bc](https://github.com/ovh/manager/commit/fa3a8bc008422b2ae5c6df4dc0883c8ba2539131))
* **user-security:** fix IP restriction header ([#5189](https://github.com/ovh/manager/issues/5189)) ([9214f8c](https://github.com/ovh/manager/commit/9214f8cd104648165841b992e6580869ba71fd53))



# [16.32.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.31.3...@ovh-ux/manager-dedicated@16.32.0) (2021-06-29)


### Bug Fixes

* **i18n:** add missing translations [CDS 1007] ([0acf42e](https://github.com/ovh/manager/commit/0acf42e58f61da59fccff7beb65bb74d074498ce))
* **i18n:** add missing translations [CDS 1008] ([2b4a681](https://github.com/ovh/manager/commit/2b4a681ab24e507756b6586b54b32aec4055026f))
* **i18n:** add missing translations [CDS 1013] ([1d627c9](https://github.com/ovh/manager/commit/1d627c96747b351a41b42062e85e25148ab79320))
* **i18n:** add missing translations [CDS 1014] ([46a225f](https://github.com/ovh/manager/commit/46a225f7feb9142f8372cbaadcc1ba9fc6fcfd3e))
* **i18n:** add missing translations [CDS 1015] ([262e1a9](https://github.com/ovh/manager/commit/262e1a99655e3bb9645b642b321fd014ce61a243))


### Features

* **dedicated:** move billing section into new module ([46975aa](https://github.com/ovh/manager/commit/46975aad8609e7678dc28ceac4bc8f36006045a6))


### Performance Improvements

* remove unecessary user certificates call ([#5162](https://github.com/ovh/manager/issues/5162)) ([24abeeb](https://github.com/ovh/manager/commit/24abeeb71e8b2e7766c3cdebdb28474afb213607))



## [16.31.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.31.2...@ovh-ux/manager-dedicated@16.31.3) (2021-06-24)


### Bug Fixes

* **dedicated:** account contact redirection ([#5170](https://github.com/ovh/manager/issues/5170)) ([d212343](https://github.com/ovh/manager/commit/d212343e5a946a0483d7d6a6e7fbee6db291885c))



## [16.31.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.31.1...@ovh-ux/manager-dedicated@16.31.2) (2021-06-24)


### Bug Fixes

* **account.contact.update:** add lazyloading to contact update ([#5164](https://github.com/ovh/manager/issues/5164)) ([f70395d](https://github.com/ovh/manager/commit/f70395dfbf9b58022b839341d94ba3f9dc5dc5aa))



## [16.31.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.31.0...@ovh-ux/manager-dedicated@16.31.1) (2021-06-21)


### Bug Fixes

* **billing.resiliation:** update check on engagement ([#5109](https://github.com/ovh/manager/issues/5109)) ([7a4ff96](https://github.com/ovh/manager/commit/7a4ff96fdc972ae7e113f3e7472214d264a329b6))



# [16.31.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.30.1...@ovh-ux/manager-dedicated@16.31.0) (2021-06-16)


### Bug Fixes

* **deps:** bump ng-ovh-order-tracking to version 2.0.0 ([79ac36e](https://github.com/ovh/manager/commit/79ac36e3efccc0382e0a7319db37a36007c6447d))


### Features

* **dedicated:** account section lazy load ([2ee6d4c](https://github.com/ovh/manager/commit/2ee6d4c3ad2596dcc49b6444dcb0fabacb6455bf))



## [16.30.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.30.0...@ovh-ux/manager-dedicated@16.30.1) (2021-06-11)


### Bug Fixes

* **ip:** fix error on IPs alerts count ([#5091](https://github.com/ovh/manager/issues/5091)) ([a330785](https://github.com/ovh/manager/commit/a3307854427fa8a98367bd759f3eb04bc36a4ac3))



# [16.30.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.29.2...@ovh-ux/manager-dedicated@16.30.0) (2021-06-10)


### Bug Fixes

* **i18n:** add missing translations [CDS 970] ([ab6beeb](https://github.com/ovh/manager/commit/ab6beebedccab557785145cf8a5a95a6666731b7))


### Features

* **webpaas:** add web paas changes for ga release ([e32c63a](https://github.com/ovh/manager/commit/e32c63ac4c845208ca550eb23caeb4c99c7447e6)), closes [#MANAGER-5671](https://github.com/ovh/manager/issues/MANAGER-5671)



## [16.29.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.29.1...@ovh-ux/manager-dedicated@16.29.2) (2021-06-04)


### Bug Fixes

* **billing.payment.method:** fix callback delete after page loaded ([751c952](https://github.com/ovh/manager/commit/751c952d0c4a8f50c5f4be34212a05df9e4dc234))



## [16.29.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.29.0...@ovh-ux/manager-dedicated@16.29.1) (2021-06-02)


### Bug Fixes

* **dedicated:** server cancel resiliation error ([#5037](https://github.com/ovh/manager/issues/5037)) ([908faeb](https://github.com/ovh/manager/commit/908faeb64a2d766715aac445996459aef5e1648a))
* **server.installation.ovh:** set basic template as default ([#5007](https://github.com/ovh/manager/issues/5007)) ([3fd1a59](https://github.com/ovh/manager/commit/3fd1a59c1d2516a6a27988f8677930866daf8627))



# [16.29.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.28.0...@ovh-ux/manager-dedicated@16.29.0) (2021-06-02)


### Bug Fixes

* **dedicated:** add missing ngInject ([7087e3a](https://github.com/ovh/manager/commit/7087e3a54066fe988aed1acc146a0d81053af056))
* **dedicated:** tracking for vps and server terminate ([db7f18c](https://github.com/ovh/manager/commit/db7f18c32a39b6d064319ace2b255fe280423d76)), closes [#MANAGER-6680](https://github.com/ovh/manager/issues/MANAGER-6680)
* **i18n:** add missing translations [CDS 954] ([0c0996c](https://github.com/ovh/manager/commit/0c0996c23feb3405cc8953ca164afd199c4e896b))
* **i18n:** add missing translations [CDS 955] ([6197a9a](https://github.com/ovh/manager/commit/6197a9a3897c16bd4f943d0f5154129b4a7d0632))
* **i18n:** add missing translations [CDS 956] ([7f6e1b7](https://github.com/ovh/manager/commit/7f6e1b796554437fe53a1268b63f4e096330e4fa))
* **i18n:** add missing translations [CDS 960] ([9582d11](https://github.com/ovh/manager/commit/9582d11a4f315ec062be26680821cf1bfc9d93a7))
* **server.terminate:** handle US enterprise customers ([#4459](https://github.com/ovh/manager/issues/4459)) ([617d14c](https://github.com/ovh/manager/commit/617d14ca4b0ef2912762d9270c2339f68a6eca58))


### Features

* **dedicated:** billing module lazy loading ([f10ea73](https://github.com/ovh/manager/commit/f10ea730dcd1086381d18bced3b2e4ee31736a99))



# [16.28.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.27.0...@ovh-ux/manager-dedicated@16.28.0) (2021-05-27)


### Features

* **billing.payment.method:** add split payment tracking ([e1de6aa](https://github.com/ovh/manager/commit/e1de6aa208b07732c436e4d0887f44580e7387ce))
* **dedicated.billing:** add split payment feature ([a59a98b](https://github.com/ovh/manager/commit/a59a98b2eff304e198bfb2bafedd9d70ed180d3f))



# [16.27.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.26.3...@ovh-ux/manager-dedicated@16.27.0) (2021-05-25)


### Bug Fixes

* **i18n:** add missing translations [CDS 959] ([7a1f847](https://github.com/ovh/manager/commit/7a1f8472a410c7e57e49f8355eff4943fafa287e))


### Features

* **dedicated-server:** add no intervention monitoring support ([dc3f573](https://github.com/ovh/manager/commit/dc3f57399ffacfa9c908a11fdd4101805b212a3c))



## [16.26.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.26.2...@ovh-ux/manager-dedicated@16.26.3) (2021-05-20)


### Bug Fixes

* **dedicated-cloud.operation:** ignore operations description errors ([#4983](https://github.com/ovh/manager/issues/4983)) ([86c3034](https://github.com/ovh/manager/commit/86c30343611723af082ff15834a388637d058f64))



## [16.26.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.26.1...@ovh-ux/manager-dedicated@16.26.2) (2021-05-19)


### Bug Fixes

* **deps:** upgrade @ovh-ux/ui-kit to v4.6.0 ([#4958](https://github.com/ovh/manager/issues/4958)) ([e1ad601](https://github.com/ovh/manager/commit/e1ad60151c7b5112138b23224282a64fce226def))
* **i18n:** add missing translations [CDS 936] ([cf8587d](https://github.com/ovh/manager/commit/cf8587dc7c701a756569fc4eca2adb95048b9a87))
* **i18n:** add missing translations [CDS 938] ([d702a7a](https://github.com/ovh/manager/commit/d702a7ac2923bf670b88aaec8acef3ffa598fad5))
* **i18n:** add missing translations [CDS 939] ([2e6a978](https://github.com/ovh/manager/commit/2e6a978740aa57d4d8a8426d3a84152171b547b8))
* **i18n:** add missing translations [CDS 940] ([b1f9d86](https://github.com/ovh/manager/commit/b1f9d86aa64a7a29c147876b1909cd0a844b60aa))
* **i18n:** add missing translations [CDS 942] ([8d702c5](https://github.com/ovh/manager/commit/8d702c59705313bb479b0aecc9a349052274e860))
* **i18n:** add missing translations [CDS 951] ([c300612](https://github.com/ovh/manager/commit/c30061210907e5daf384cd4306cd4866505ba5ac))
* **server.dashboard.technical-details:** hide missing disk ([#4963](https://github.com/ovh/manager/issues/4963)) ([c6ea769](https://github.com/ovh/manager/commit/c6ea769a162e44a55d4a8a0c605ae73e1e3c9697))
* **server.installation.ovh:** add check before displaying partitioning ([#4945](https://github.com/ovh/manager/issues/4945)) ([da5fa3a](https://github.com/ovh/manager/commit/da5fa3a0a69eb3c1c7b2dea99adc430a45e72d3c))



## [16.26.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.26.0...@ovh-ux/manager-dedicated@16.26.1) (2021-05-18)


### Bug Fixes

* **billing.voucher:** update wording for credit note deduction ([#4975](https://github.com/ovh/manager/issues/4975)) ([7f18a21](https://github.com/ovh/manager/commit/7f18a219551bc140f08359bafa1c9f4c07f2316a))



# [16.26.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.25.2...@ovh-ux/manager-dedicated@16.26.0) (2021-05-10)


### Features

* **vps:** commitment ([#4927](https://github.com/ovh/manager/issues/4927)) ([cd420a8](https://github.com/ovh/manager/commit/cd420a8350add11f6a1673fa5ab74719066df744))



## [16.25.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.25.1...@ovh-ux/manager-dedicated@16.25.2) (2021-05-10)


### Bug Fixes

* update injection order ([#4942](https://github.com/ovh/manager/issues/4942)) ([9b55635](https://github.com/ovh/manager/commit/9b55635b55d98677e04d09601eeecb739130f74b))



## [16.25.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.25.0...@ovh-ux/manager-dedicated@16.25.1) (2021-05-07)


### Bug Fixes

* **dedicatedcloud.datacenter:** fix banner scope ([da74bcb](https://github.com/ovh/manager/commit/da74bcb93979284bd7ca71dae5bb0e56bf9c78a3))



# [16.25.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.24.0...@ovh-ux/manager-dedicated@16.25.0) (2021-05-07)


### Features

* add warning for order ([b8b5697](https://github.com/ovh/manager/commit/b8b5697bed9d1ee17cc87ae7124d058179003cbc))
* **hosted-private-cloud:** add warning out of stock veeam backup ([5193d05](https://github.com/ovh/manager/commit/5193d0561f52b7603ad470e5f1653f17273beb08))
* remove migration funnel ([bd0cf75](https://github.com/ovh/manager/commit/bd0cf756fd3d2c751343a6316337b6c64b3b7ebb))



# [16.24.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.23.4...@ovh-ux/manager-dedicated@16.24.0) (2021-05-06)


### Features

* **vps:** commitment ([#4399](https://github.com/ovh/manager/issues/4399)) ([2afdbb2](https://github.com/ovh/manager/commit/2afdbb272a0f5fa4ca09ad933353a48d471d8ab9))



## [16.23.4](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.23.3...@ovh-ux/manager-dedicated@16.23.4) (2021-05-06)


### Bug Fixes

* **billing.credits.movement:** fix url ([#4910](https://github.com/ovh/manager/issues/4910)) ([fa69e6e](https://github.com/ovh/manager/commit/fa69e6ec07dea4d79f84001d8db603a2cd982ce0))



## [16.23.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.23.2...@ovh-ux/manager-dedicated@16.23.3) (2021-05-06)


### Bug Fixes

* prevent crashing if value is null ([#4903](https://github.com/ovh/manager/issues/4903)) ([f890a49](https://github.com/ovh/manager/commit/f890a49bebcc8c5fe68e5cddcdcfe60107837a16))



## [16.23.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.23.1...@ovh-ux/manager-dedicated@16.23.2) (2021-05-05)


### Bug Fixes

* prevent method from being static ([#4900](https://github.com/ovh/manager/issues/4900)) ([89c57b4](https://github.com/ovh/manager/commit/89c57b45ac35c44dc8d9ca7362aa55a6457b7746))



## [16.23.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.23.0...@ovh-ux/manager-dedicated@16.23.1) (2021-05-05)


### Bug Fixes

* display total amount for SBG ([#4890](https://github.com/ovh/manager/issues/4890)) ([96c92a6](https://github.com/ovh/manager/commit/96c92a6e38efb553987e71b08d953a1e7146b0d1))



# [16.23.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.22.4...@ovh-ux/manager-dedicated@16.23.0) (2021-05-05)


### Bug Fixes

* **deps:** upgrade ovh-api-services to v11.1.1 ([#4831](https://github.com/ovh/manager/issues/4831)) ([33d056a](https://github.com/ovh/manager/commit/33d056a2a8e09392e1f8795a8716c52a15b66b73))
* **environment:** use isRegion instead of getRegion ([beab2a9](https://github.com/ovh/manager/commit/beab2a998a1ceb9f7e30e635415520435d8a45e9))
* **i18n:** add missing translations [CDS 919] ([bb49398](https://github.com/ovh/manager/commit/bb493983511c7db91d203c274aa69ac687a707da))
* **i18n:** add missing translations [CDS 928] ([be2ab67](https://github.com/ovh/manager/commit/be2ab67bf0d2f2be9403ebb1f4d314a3c4eebf17))
* **i18n:** add missing translations [CDS 929] ([52c3ce1](https://github.com/ovh/manager/commit/52c3ce1b75b0dde6b04feba517161c36b226a4c1))
* **i18n:** add missing translations [CDS 930] ([ccfd950](https://github.com/ovh/manager/commit/ccfd9505de3174cae4b0f5524bdfce0c2b2bc32a))
* **i18n:** add missing translations [CDS 933] ([6daf61c](https://github.com/ovh/manager/commit/6daf61c1dec7527ab1f9d92f2ce86dab13cb0aa7))
* **server.dashboard:** prevent duplicate install menu item ([#4861](https://github.com/ovh/manager/issues/4861)) ([88ad622](https://github.com/ovh/manager/commit/88ad6225ec2289a3d3f26b557eb5f86b879ceaf1))
* remove unused translations [CDS] ([272e810](https://github.com/ovh/manager/commit/272e810525bc6fe43d2ac2c1af0ba81099897bf1))
* **server.details:** update non-fr translations ([#4815](https://github.com/ovh/manager/issues/4815)) ([efd86b8](https://github.com/ovh/manager/commit/efd86b8c5bfeccf65e645c52591f42b8ea650ad4))


### Features

* **environment:** use ufrontend to bootstrap application ([fba286f](https://github.com/ovh/manager/commit/fba286f89e58e73f8899da0dbac615f65fc6a7f8))


### Reverts

* Revert "fix(i18n): add missing translations [CDS 933]" (#4873) ([46da259](https://github.com/ovh/manager/commit/46da259ee7db6b30bb230c405da5dbc79a76a896)), closes [#4873](https://github.com/ovh/manager/issues/4873)



## [16.22.4](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.22.3...@ovh-ux/manager-dedicated@16.22.4) (2021-05-04)


### Bug Fixes

* **billing.payment.credit:** display order link in movement ([903bd31](https://github.com/ovh/manager/commit/903bd3174e5202e18e09e4058bd0a864915247eb))



## [16.22.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.22.2...@ovh-ux/manager-dedicated@16.22.3) (2021-05-04)


### Bug Fixes

* **billing.payment.voucher:** unescape bill url parameters ([#4878](https://github.com/ovh/manager/issues/4878)) ([f0cdb5d](https://github.com/ovh/manager/commit/f0cdb5d4c04c556efeaa117818277969dcd71878))
* **server.install.image:** fix bad param name ([#4869](https://github.com/ovh/manager/issues/4869)) ([f3695f3](https://github.com/ovh/manager/commit/f3695f30322dbc5cea4b297ba938e61c4e40c080))



## [16.22.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.22.1...@ovh-ux/manager-dedicated@16.22.2) (2021-05-03)


### Bug Fixes

* update translations ([#4875](https://github.com/ovh/manager/issues/4875)) ([cce6731](https://github.com/ovh/manager/commit/cce673169abcccc7743484085264396a8e297d85))



## [16.22.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.22.0...@ovh-ux/manager-dedicated@16.22.1) (2021-05-03)


### Bug Fixes

* **billing.payment.credit:** update content ([fe91347](https://github.com/ovh/manager/commit/fe913474f1ff21408029526a2669a2722aa2bcb5))



# [16.22.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.21.0...@ovh-ux/manager-dedicated@16.22.0) (2021-05-03)


### Bug Fixes

* **server.dashboard:** remove rack status badge ([#4862](https://github.com/ovh/manager/issues/4862)) ([6204e25](https://github.com/ovh/manager/commit/6204e2500d4939805a0796e6289ad28cf82dbf81))
* **server.details:** update conditions for manual forced renew ([#4867](https://github.com/ovh/manager/issues/4867)) ([f3db7ca](https://github.com/ovh/manager/commit/f3db7ca05562ec190f515045773cf37bd68f0f56))


### Features

* **billing.payments.credits:** sbg commercial measure ([#4863](https://github.com/ovh/manager/issues/4863)) ([5d41001](https://github.com/ovh/manager/commit/5d4100105777cba6f90cefb42391fc6f57196093))



# [16.21.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.20.0...@ovh-ux/manager-dedicated@16.21.0) (2021-04-28)


### Features

* update resiliation process ([#4837](https://github.com/ovh/manager/issues/4837)) ([7449bd0](https://github.com/ovh/manager/commit/7449bd0ea3382f8beb2b74d787f853103e6b2dd9))



# [16.20.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.19.1...@ovh-ux/manager-dedicated@16.20.0) (2021-04-27)


### Features

* **cookie-policy:** add banner in main apps ([9ee06b9](https://github.com/ovh/manager/commit/9ee06b943e1be00de84f6ed495316a130ae6aa3e))



## [16.19.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.19.0...@ovh-ux/manager-dedicated@16.19.1) (2021-04-26)


### Bug Fixes

* **billing:** outstanding balance and due date not shown in US ([#4792](https://github.com/ovh/manager/issues/4792)) ([6500e1b](https://github.com/ovh/manager/commit/6500e1b31b81d04290a5c3fcaf99699ba618b189))
* **ip:** enabled pagination for ip parking ([#4799](https://github.com/ovh/manager/issues/4799)) ([4b2590d](https://github.com/ovh/manager/commit/4b2590daa6701d1b899950e03e73fdc824e9ae52))



# [16.19.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.18.8...@ovh-ux/manager-dedicated@16.19.0) (2021-04-21)


### Bug Fixes

* **i18n:** add missing translations [CDS 813] ([7576441](https://github.com/ovh/manager/commit/75764419f0ad376750d683a7b8b9eed4b9b01af4))
* **i18n:** add missing translations [CDS 890] ([953780c](https://github.com/ovh/manager/commit/953780c97d4123f62e647150527b557c43d5a915))
* **i18n:** add missing translations [CDS 891] ([c8594e5](https://github.com/ovh/manager/commit/c8594e5435a1de19a8980b18c7b1c0b498228d14))
* **i18n:** add missing translations [CDS 892] ([8c51e87](https://github.com/ovh/manager/commit/8c51e879b6427ea9a947255d9097cfa1c496268b))
* **i18n:** add missing translations [CDS 894] ([d371945](https://github.com/ovh/manager/commit/d3719452c06974d5638be3a83e398b5ac2ede2b4))
* **i18n:** add missing translations [CDS 896] ([c1a16a4](https://github.com/ovh/manager/commit/c1a16a4660fe7b379b67cc00c730812bf8708a28))
* **i18n:** add missing translations [CDS 898] ([1a21c31](https://github.com/ovh/manager/commit/1a21c31630d8fbc4e3715103ed346b600be9f8d8))
* **i18n:** add missing translations [CDS 899] ([110f23c](https://github.com/ovh/manager/commit/110f23ca4af9b4abb8d8f72b5f7f0f615fb9757e))
* **i18n:** add missing translations [CDS 902] ([0af3a1a](https://github.com/ovh/manager/commit/0af3a1a41ce86febbb16bc0c991bc06328e32dc6))
* **i18n:** add missing translations [CDS 906] ([4c98d4c](https://github.com/ovh/manager/commit/4c98d4c3705ecdb5675424b99eca9c11df9fdba6))
* fix alerter message slot name ([#4731](https://github.com/ovh/manager/issues/4731)) ([b7f7772](https://github.com/ovh/manager/commit/b7f77724204581e9e13efad0ef1ee81242fb2710))
* **pcc.users:** avoid to display an error message as successful ([#4723](https://github.com/ovh/manager/issues/4723)) ([292c1ed](https://github.com/ovh/manager/commit/292c1edf32beec2ba62bc231440882d7f6226b9c))


### Features

* **datacenter.drp.summary:** add remoteVraNetwork field ([#4760](https://github.com/ovh/manager/issues/4760)) ([516c6d2](https://github.com/ovh/manager/commit/516c6d256bd3a02a2b34311d06a9f21fec143032))
* **dedicated.billing:** add new adyen method type ([d6d62b3](https://github.com/ovh/manager/commit/d6d62b3c6ca9bc055d604bd8e0a42faf59d5b9a4))
* **dedicated.billing:** change explanation text of payment type card ([0c56894](https://github.com/ovh/manager/commit/0c568945c6413102408705e7566ffd035cb2c24e))
* **server.dashboard.technical-details:** check if upgradable ([#4773](https://github.com/ovh/manager/issues/4773)) ([889f972](https://github.com/ovh/manager/commit/889f9724b858afd096ed5b953e09f87ff970fed5))



## [16.18.8](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.18.7...@ovh-ux/manager-dedicated@16.18.8) (2021-04-19)


### Bug Fixes

* prepare new dedicated server OS usages ([#4771](https://github.com/ovh/manager/issues/4771)) ([a6d07df](https://github.com/ovh/manager/commit/a6d07dfb6bc8ac1b2288eafdcdf966b33dd48c95)), closes [#4767](https://github.com/ovh/manager/issues/4767)



## [16.18.7](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.18.6...@ovh-ux/manager-dedicated@16.18.7) (2021-04-15)


### Bug Fixes

* **installation:** fix modal display ([#4764](https://github.com/ovh/manager/issues/4764)) ([4ad8160](https://github.com/ovh/manager/commit/4ad81600e90a5bf5c2e61bc3aaafe3520caf3c8c))
* **ip:** ip firewall rules are not shown ([#4763](https://github.com/ovh/manager/issues/4763)) ([18b5418](https://github.com/ovh/manager/commit/18b54186340e5c5a43187d249c99955b4e5673e1))
* **license:** add default name format ([16f71ef](https://github.com/ovh/manager/commit/16f71ef925aade755a1cc26bac9339b4351bd8f2))



## [16.18.6](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.18.5...@ovh-ux/manager-dedicated@16.18.6) (2021-04-14)


### Bug Fixes

* **dedicated-cloud.license:** display error on spla license activation ([#4752](https://github.com/ovh/manager/issues/4752)) ([5acf3f2](https://github.com/ovh/manager/commit/5acf3f29463f4c0a7e69567b2ca3944903354e14))



## [16.18.5](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.18.4...@ovh-ux/manager-dedicated@16.18.5) (2021-04-13)


### Bug Fixes

* **billing:** manual renew url for apac subs ([#4753](https://github.com/ovh/manager/issues/4753)) ([da586e9](https://github.com/ovh/manager/commit/da586e9dda77ee81f7fcaeae42767d8fa6bcb3a3))



## [16.18.4](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.18.3...@ovh-ux/manager-dedicated@16.18.4) (2021-04-12)


### Bug Fixes

* **dedicated:** add us translation ([#4745](https://github.com/ovh/manager/issues/4745)) ([0ea7298](https://github.com/ovh/manager/commit/0ea729883517e6dd689fca164d6256f62ae566c6))



## [16.18.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.18.2...@ovh-ux/manager-dedicated@16.18.3) (2021-04-12)


### Bug Fixes

* **billing.payment.refund:** fix route for request ([#4736](https://github.com/ovh/manager/issues/4736)) ([651175d](https://github.com/ovh/manager/commit/651175d97ba8752d64c11772c1e4a456f5385416))



## [16.18.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.18.1...@ovh-ux/manager-dedicated@16.18.2) (2021-04-12)


### Bug Fixes

* **user.dashboard:** update payment tracking shortcut link ([#4728](https://github.com/ovh/manager/issues/4728)) ([1838870](https://github.com/ovh/manager/commit/18388703d5927b050cf34228dd7fe1121b1a9e29))



## [16.18.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.18.0...@ovh-ux/manager-dedicated@16.18.1) (2021-04-08)


### Bug Fixes

* **managed-baremetal:** add params to url ([#4719](https://github.com/ovh/manager/issues/4719)) ([44b282f](https://github.com/ovh/manager/commit/44b282f208d659a1f3d587d5d5d3261588ef72ec))



# [16.18.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.17.0...@ovh-ux/manager-dedicated@16.18.0) (2021-04-08)


### Bug Fixes

* **billing.autorenew.agreements:** fix empty agreements modal ([#4697](https://github.com/ovh/manager/issues/4697)) ([05540aa](https://github.com/ovh/manager/commit/05540aa3cd142b08243e0abb0f5df86cc259f1b5))
* **deps:** upgrade @ovh-ux/ui-kit to v4.5.0 ([#4631](https://github.com/ovh/manager/issues/4631)) ([7909d4b](https://github.com/ovh/manager/commit/7909d4b5b8001de15204fd632fd08b6814c4a786))
* **deps:** upgrade ovh-api-services ([#4706](https://github.com/ovh/manager/issues/4706)) ([5619e0c](https://github.com/ovh/manager/commit/5619e0c761a865be15701e096745c68dcc824f8e))
* **i18n:** add missing translations [CDS 868] ([bdc753b](https://github.com/ovh/manager/commit/bdc753bb845383c37bb76d16d879c0df0180027a))
* **i18n:** add missing translations [CDS 869] ([b7f1138](https://github.com/ovh/manager/commit/b7f11381debaeb1c70923032a08d60490a4d3f29))
* **i18n:** add missing translations [CDS 870] ([4ed6164](https://github.com/ovh/manager/commit/4ed61649a9ec2e799924925369a59579c4d943f7))
* **i18n:** add missing translations [CDS 873] ([57786c0](https://github.com/ovh/manager/commit/57786c0d8dcc696aa88322043ad8c9b6d4af71d2))
* **i18n:** add missing translations [CDS 875] ([c13bcb1](https://github.com/ovh/manager/commit/c13bcb18a7e5cd28662ef9cc2158776bde0b6db1))
* **i18n:** add missing translations [CDS 876] ([9e61b8b](https://github.com/ovh/manager/commit/9e61b8bde2bf1497048fdcd0ebd5a3dd85784ada))
* **i18n:** add missing translations [CDS 881] ([c5eb003](https://github.com/ovh/manager/commit/c5eb003157cc31a07616e0f3ca09a390bebdad84))
* **i18n:** add missing translations [CDS 885] ([111ef80](https://github.com/ovh/manager/commit/111ef8058c0d9c0c7f58946c800640a0c45a406a))
* **license:** feature flip upgrade availability ([#4700](https://github.com/ovh/manager/issues/4700)) ([ffbac64](https://github.com/ovh/manager/commit/ffbac64c3b5ed791ca872e1a310876d6f5ae2887))
* **license:** spla license service name display ([#4709](https://github.com/ovh/manager/issues/4709)) ([44a68ca](https://github.com/ovh/manager/commit/44a68cae4f6770159cfe36116ac83db31909cca9))
* **server:** fix commit recommit tracking ([#4713](https://github.com/ovh/manager/issues/4713)) ([091c777](https://github.com/ovh/manager/commit/091c777cf2de516c0ef0a186b3cabe0697dc01e9))
* **server.dashboard:** detection if tech details are here ([#4701](https://github.com/ovh/manager/issues/4701)) ([2fb5430](https://github.com/ovh/manager/commit/2fb54309fc0de775784b379c664cb7103e85e69f))


### Features

* **server:** add os image tracking ([#4451](https://github.com/ovh/manager/issues/4451)) ([854cce2](https://github.com/ovh/manager/commit/854cce2c464c38ff49d4262a17991746121613d4))



# [16.17.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.16.1...@ovh-ux/manager-dedicated@16.17.0) (2021-04-07)


### Features

* add batch 2 advices ([#4597](https://github.com/ovh/manager/issues/4597)) ([69e5fe5](https://github.com/ovh/manager/commit/69e5fe5bfe813f4ef0e63e1acd8f128dc4590b73))



## [16.16.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.16.0...@ovh-ux/manager-dedicated@16.16.1) (2021-04-07)


### Bug Fixes

* **server.details:** catch error for byoi ([#4692](https://github.com/ovh/manager/issues/4692)) ([c8d4ae8](https://github.com/ovh/manager/commit/c8d4ae85495b715f34344d57e758337680575a85))
* **server.interfaces:** fix ola detection on legacy ([#4693](https://github.com/ovh/manager/issues/4693)) ([6c03945](https://github.com/ovh/manager/commit/6c039457659cf2cb541734375602b03448cabfd2))



# [16.16.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.15.1...@ovh-ux/manager-dedicated@16.16.0) (2021-04-06)


### Bug Fixes

* **dedicated:** add ola tracking ([b496a2f](https://github.com/ovh/manager/commit/b496a2fef252ab0db85cdecb11632367bd5369ae))
* **dedicated:** dashboard hardware tile integration ([3ca6335](https://github.com/ovh/manager/commit/3ca6335a2554390622074813840a800821c623fc))
* **dedicated:** disable os install if ola is configured ([ee93dd5](https://github.com/ovh/manager/commit/ee93dd5efe31354f2792ee06ecb0ddc0541e5ea7))
* **dedicated:** ola reset modal refresh ([73903ac](https://github.com/ovh/manager/commit/73903acb6edd80acc56780c726d8ba4ba01c83ed))
* **i18n:** add missing translations [CDS 648] ([f823204](https://github.com/ovh/manager/commit/f82320482057281fefd559697d7b9c855f76db4a))
* **i18n:** add missing translations [CDS 764] ([e9cf1de](https://github.com/ovh/manager/commit/e9cf1de2721539f649907e1fdfb0824a6d035794))
* **i18n:** add missing translations [CDS 766] ([8bdaae7](https://github.com/ovh/manager/commit/8bdaae7224f276db0941da96f6a67f5fe7e3ade4))
* **i18n:** add missing translations [CDS 872] ([a796478](https://github.com/ovh/manager/commit/a79647892590fe5bce321188aa2b2c307abb60db))
* **i18n:** add missing translations [CDS 885] ([9434739](https://github.com/ovh/manager/commit/9434739f3f625bdf5d3e363e283bb5e7a1c1d0b2))
* **upgrade:** add flipping on technical upgrade ([8bbbc00](https://github.com/ovh/manager/commit/8bbbc004e51936599f7617046252d63703267b75))


### Features

* **dedicated:** add technical details tile to dashboard ([cf13e4e](https://github.com/ovh/manager/commit/cf13e4eec183096c78976dd36fe5a713cfcdf3e8))
* **dedicated:** hgv2 & ola integration #MANAGER-6116 ([e9d184f](https://github.com/ovh/manager/commit/e9d184f119d3cbd6754c7c2653180b0325341792)), closes [#MANAGER-6116](https://github.com/ovh/manager/issues/MANAGER-6116)
* **dedicated:** ola enhancements ([cae8bbe](https://github.com/ovh/manager/commit/cae8bbe5632f8d3de02a87f57f25f03343f89cb1)), closes [#MANAGER-5264](https://github.com/ovh/manager/issues/MANAGER-5264) [#MANAGER-5494](https://github.com/ovh/manager/issues/MANAGER-5494)
* **dedicated:** server dashboard ola message formatting ([0d2fa2c](https://github.com/ovh/manager/commit/0d2fa2c1fcc0fa37464523c63dc12e4363e56e7f))
* **hgv2:** add manual upgrade with ticket ([7d69257](https://github.com/ovh/manager/commit/7d692575d5ab978397bdc292befaec4b602a3f65))



## [16.15.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.15.0...@ovh-ux/manager-dedicated@16.15.1) (2021-04-06)


### Bug Fixes

* avoid duplicate token in url ([#4685](https://github.com/ovh/manager/issues/4685)) ([d717855](https://github.com/ovh/manager/commit/d717855ae5f9cdb433d46e899b6f2e94d3728ab6))



# [16.15.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.14.3...@ovh-ux/manager-dedicated@16.15.0) (2021-04-02)


### Bug Fixes

* **billing.payment:** rename DLP to Startup Program ([#4674](https://github.com/ovh/manager/issues/4674)) ([5837448](https://github.com/ovh/manager/commit/5837448fba07fc9ab7472587e9751490cd8f479e))


### Features

* **billing.payment.ovhaccount:** revamp refund ([#4664](https://github.com/ovh/manager/issues/4664)) ([79b48cd](https://github.com/ovh/manager/commit/79b48cd34b6b312a47c7f003c89f3466a6c6da18))



## [16.14.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.14.2...@ovh-ux/manager-dedicated@16.14.3) (2021-04-01)


### Bug Fixes

* fix terminate redirection ([#4669](https://github.com/ovh/manager/issues/4669)) ([c33c704](https://github.com/ovh/manager/commit/c33c70436af3a01c8e7bd08b14ec29ce0b895b45))



## [16.14.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.14.1...@ovh-ux/manager-dedicated@16.14.2) (2021-04-01)


### Bug Fixes

* **dedicated-cloud:** fix terminate resiliation ([427e93e](https://github.com/ovh/manager/commit/427e93e095634b9abba3466831b512ec4c543f39))



## [16.14.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.14.0...@ovh-ux/manager-dedicated@16.14.1) (2021-03-31)


### Bug Fixes

* **billing.history:** add billId to see debt ([#4658](https://github.com/ovh/manager/issues/4658)) ([c780905](https://github.com/ovh/manager/commit/c78090586ccf6da90b5be23a5a886353ace33921))



# [16.14.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.13.0...@ovh-ux/manager-dedicated@16.14.0) (2021-03-31)


### Bug Fixes

* **i18n:** add missing translations [CDS 851] ([6406b5d](https://github.com/ovh/manager/commit/6406b5d82ffaad8109b5ce561caf37ac1e3c18a9))


### Features

* add webpaas ([#4385](https://github.com/ovh/manager/issues/4385)) ([a7fdb93](https://github.com/ovh/manager/commit/a7fdb938d0a85c64d702e06cd00445e223fa3671))
* **dedicated:** add sidebar entry for web paas ([3126755](https://github.com/ovh/manager/commit/3126755ace084c0f6fc31e3570f2f62c064c8509))



# [16.13.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.12.0...@ovh-ux/manager-dedicated@16.13.0) (2021-03-31)


### Bug Fixes

* allow resiliation on service that can be engaged ([#4639](https://github.com/ovh/manager/issues/4639)) ([75c7f24](https://github.com/ovh/manager/commit/75c7f2460e7971d7f71824ad98144e04e1221264))


### Features

* update wording for new billing status ([#4640](https://github.com/ovh/manager/issues/4640)) ([9a780cd](https://github.com/ovh/manager/commit/9a780cddb253e225874cd2f21e5fc3d9d5fa0839))



# [16.12.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.11.1...@ovh-ux/manager-dedicated@16.12.0) (2021-03-29)


### Bug Fixes

* **billing.ovhaccount:** enable cash out for DE subsidiary ([8b89fe2](https://github.com/ovh/manager/commit/8b89fe2f222804705d86185db4f024b232df68bd))
* **billing.payment.ovh-account:** update retrieve wording ([#4620](https://github.com/ovh/manager/issues/4620)) ([2580561](https://github.com/ovh/manager/commit/258056171209fea9b2572aa56c8b813e047b8037))


### Features

* **billing.payment:** add description to voucher movements ([#4623](https://github.com/ovh/manager/issues/4623)) ([d19b6b5](https://github.com/ovh/manager/commit/d19b6b5389f61cea82584f8ea4e71b48d060e934))



## [16.11.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.11.0...@ovh-ux/manager-dedicated@16.11.1) (2021-03-26)


### Bug Fixes

* **ip:** broadcast event on promise callback ([#4624](https://github.com/ovh/manager/issues/4624)) ([c063884](https://github.com/ovh/manager/commit/c063884cade97e476786749ada2b08953826522e))



# [16.11.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.10.0...@ovh-ux/manager-dedicated@16.11.0) (2021-03-26)


### Bug Fixes

* avoid duplicate module name ([21ed860](https://github.com/ovh/manager/commit/21ed860d1d0a67b0c4bd4914415e9dfd4e3d847c))
* **ip.order:** hide breadcrumb ([92d2238](https://github.com/ovh/manager/commit/92d2238b972cb59e76492c94a8b55958a5c04c0c))


### Features

* **billing.refunds:** add link to prepaid account ([#4611](https://github.com/ovh/manager/issues/4611)) ([8ed77ad](https://github.com/ovh/manager/commit/8ed77ad48d681bb0e3ef60c8361dc6ee2f37654e))


### Reverts

* Revert "fix: remove non needed component (#4563)" ([3b86fff](https://github.com/ovh/manager/commit/3b86fff879336db05c982b18e9563175caaf4be4)), closes [#4563](https://github.com/ovh/manager/issues/4563)



# [16.10.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.9.1...@ovh-ux/manager-dedicated@16.10.0) (2021-03-25)


### Bug Fixes

* remove non needed component ([#4563](https://github.com/ovh/manager/issues/4563)) ([b3aa13f](https://github.com/ovh/manager/commit/b3aa13f8b1e7f32328f992b1d0195de7473a0c15))
* **billing:** hide breadcrumb for US ([db365d6](https://github.com/ovh/manager/commit/db365d6f41707bc84c3026b9d08397feb7e3243a))
* **billing.autorenew:** replace Server call with /services ([#4526](https://github.com/ovh/manager/issues/4526)) ([4159de4](https://github.com/ovh/manager/commit/4159de4d5a6464e36301a344b07370055473f524))
* **billing.autorenew:** update autorenew tracking ([#4476](https://github.com/ovh/manager/issues/4476)) ([b717e1a](https://github.com/ovh/manager/commit/b717e1ab03dd5e5c823a92534fd6cf8901c0a068))
* **dedicated-cloud.options:** provide breadcrumb value ([60cf671](https://github.com/ovh/manager/commit/60cf67179c3e7502811fbcf82030e0a18866c75c))
* **dedicated-server:** add breadcrumb for commitment ([4cdfc48](https://github.com/ovh/manager/commit/4cdfc4891f516cd8cae0bed7d10225395919ad2c))
* **dedicated-server.firewall:** fix breadcrumb translations ([8dca824](https://github.com/ovh/manager/commit/8dca824e1378f4a818add4b89364cea7f4450c98))
* **dedicated.server:** inject missing translations ([1942e77](https://github.com/ovh/manager/commit/1942e77fc5e7a5788aa36ac533a9a46a62c6b9e6))
* **dedicated.server:** set active tab ([9462915](https://github.com/ovh/manager/commit/94629157b0177783b4a599af9b1cef13d91ecf2f))
* **housing.dashboard:** use import for controller ([f28082e](https://github.com/ovh/manager/commit/f28082ed6d15c62f8a4c0b1d860426b4ece864ae))
* **i18n:** add missing translations [CDS 808] ([ba2c7cb](https://github.com/ovh/manager/commit/ba2c7cb71125d9e47400184953b6614030a1a2c6))
* **i18n:** add missing translations [CDS 861] ([f42c3ed](https://github.com/ovh/manager/commit/f42c3edeeb30a0307c245d35a42ec7a8e428a1d4))
* **ip:** fix agora order ([6bed14c](https://github.com/ovh/manager/commit/6bed14c0a9003670ace53ff05b4b4e3fb3d41cf3))
* **ip:** hide breadcrumb on listing page ([6910091](https://github.com/ovh/manager/commit/6910091bc90bf975efaa4362059eca666096b7ee))
* **ip.organisation:** load in $onInit ([8c3bbc3](https://github.com/ovh/manager/commit/8c3bbc38769e4852954bb51b8f82ebd35a544a0d))
* **license:** fix typo ([d2b6c3e](https://github.com/ovh/manager/commit/d2b6c3e16eddc555a04c0d8259176f1fdc0d43e0))
* **managed-baremetal.users:** fix actions ([c4b4df5](https://github.com/ovh/manager/commit/c4b4df5ca8cdfccd1d52e3eb5b3abd9878d770ff))
* **payment-method:** set user locale ([562b0ab](https://github.com/ovh/manager/commit/562b0ab2bac676a7b16382abc227a713bbfde150))
* update url for users modal ([b8b0275](https://github.com/ovh/manager/commit/b8b0275c8b2c98970add9455fe51560340a9e814))
* **managed-baremetal.servicepack:** fix translation injection ([8768cf5](https://github.com/ovh/manager/commit/8768cf59d4cbc5f7a6b899066cdd818d3ee9b7a0))
* **server:** fix install import ([2def1c3](https://github.com/ovh/manager/commit/2def1c3d9ebae801295fd7ad0c04740370241862))
* add missing breadcrumb translations ([188100d](https://github.com/ovh/manager/commit/188100d236b217b2994c66ab5881601ca3336a07))
* add missing translations ([a668534](https://github.com/ovh/manager/commit/a6685349173116cd8ae4748ad43ba7a6ff5769a3))
* **popover:** make component standalone by declaring its own style ([14548df](https://github.com/ovh/manager/commit/14548dfe69bc7ab7d138d4ccdc78d9b8d8375420))


### Features

* **billing.main:** change tab order ([9955194](https://github.com/ovh/manager/commit/99551949e324db3605309759f1f660e608fe8725))
* **cdn:** add breadcrumb ([bd20407](https://github.com/ovh/manager/commit/bd204074011ad814bc6c5edf9b3681e21793e969))
* **cdn:** add listing page ([777e53e](https://github.com/ovh/manager/commit/777e53e34c2ef28a615964aca30c2726345f68b9))
* **dedicated-cloud:** add breadcrumb ([8ae433a](https://github.com/ovh/manager/commit/8ae433a3e063be6abbd938cc14d07201e266aebc))
* **dedicated-cloud:** add listing page ([b9b7744](https://github.com/ovh/manager/commit/b9b7744a1ec4afc193ec076597e416e8509a9230))
* **dedicated.billing.autorenew:** add servicetype to tracking ([#4549](https://github.com/ovh/manager/issues/4549)) ([2f943d0](https://github.com/ovh/manager/commit/2f943d0afffa4e66499d1d7c33a496d007226156))
* **dedicated.housing:** add breadcrumb ([ab00a12](https://github.com/ovh/manager/commit/ab00a127cd40cc6c8a0d510b67426355f6e88b29))
* **dedicated.housing:** add listing page ([ab144df](https://github.com/ovh/manager/commit/ab144df2aab6727d315b86b3d4dbb391f1b8fc20))
* **dedicated.nas:** add breadcrumb ([05cdce0](https://github.com/ovh/manager/commit/05cdce006afb24826a1f9bbe5fc6502cec86922e))
* **dedicated.nas.partition:** add intermediate state ([1af9cdd](https://github.com/ovh/manager/commit/1af9cdd3175dd078173e363f35074423b33c2cb8))
* **dedicated.server:** add breadcrumb ([c1145c9](https://github.com/ovh/manager/commit/c1145c942ea4da8ac2e89278a35cb24ea3b3ee65))
* **dedicated.server:** replace link with oui-back-button ([5382dae](https://github.com/ovh/manager/commit/5382dae40a42cb5592aef1c547f05f09fa9f5bdb))
* **ip:** add breadcrumb ([7e4781c](https://github.com/ovh/manager/commit/7e4781c5d70f7e99b38d140fe048f6565c99698a))
* **license:** add breadcrumb ([82a6068](https://github.com/ovh/manager/commit/82a6068f53637dfde30f85eb3d233f4eae4f844d))
* **managed-baremetal:** add breadcrumb ([fdc9b96](https://github.com/ovh/manager/commit/fdc9b96244985916b19dfae1b0180f75f07bb46a))
* **managed-baremetal:** add listing page ([4241826](https://github.com/ovh/manager/commit/4241826fef40f7628fe08cdf55f6c4046ff7133f))
* **nas:** add listing page ([e1c5c7b](https://github.com/ovh/manager/commit/e1c5c7bae29fee735011b7f4afa50168dbebcd65))
* move Exchange service to wuc ([61488d1](https://github.com/ovh/manager/commit/61488d142e821ffdc6194ff04dfa93ed53663cff))



## [16.9.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.9.0...@ovh-ux/manager-dedicated@16.9.1) (2021-03-24)


### Bug Fixes

* **billing.payment:** avoid duplicate tab name ([#4605](https://github.com/ovh/manager/issues/4605)) ([387ac21](https://github.com/ovh/manager/commit/387ac215d0a2db4b91bbbb5b80f0d0f13755396a))



# [16.9.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.8.0...@ovh-ux/manager-dedicated@16.9.0) (2021-03-24)


### Bug Fixes

* **billing.credits:** fix translations ([7be03e2](https://github.com/ovh/manager/commit/7be03e28089366a466baa57b032e285c3c0887cc))
* **i18n:** add missing translations [CDS 863] ([4769306](https://github.com/ovh/manager/commit/4769306f6ca4603a97534e63e43169ac6d517c6d))


### Features

* **billing:** move refunds from payment means to bills ([097a46f](https://github.com/ovh/manager/commit/097a46fd2293b179a4baf3be2bbb4e00db0bfdb0))
* **billing.credits:** revamp ([545e7b5](https://github.com/ovh/manager/commit/545e7b5a9ff5c19fcce67cd6d93c30b196626443))
* **billing.payment:** remove transaction tab ([353cd96](https://github.com/ovh/manager/commit/353cd961d937c1c45fe486ee22655fd25ca4f57f))
* change tab order ([66f505f](https://github.com/ovh/manager/commit/66f505fb808bb571e68b51c9eb5cc0c76ee8111a))



# [16.8.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.7.0...@ovh-ux/manager-dedicated@16.8.0) (2021-03-19)


### Features

* **server.dashboard:** add rack status ([#4590](https://github.com/ovh/manager/issues/4590)) ([fae1b00](https://github.com/ovh/manager/commit/fae1b00844b0c2878cc8d247a10e9d8324102707))



# [16.7.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.6.0...@ovh-ux/manager-dedicated@16.7.0) (2021-03-17)


### Features

* add incident migration banner ([f05c541](https://github.com/ovh/manager/commit/f05c541b027a1af92f211c7d17bb08c8c466eb50))



# [16.6.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.5.1...@ovh-ux/manager-dedicated@16.6.0) (2021-03-14)


### Features

* **dedicated-cloud:** display incident banner ([dd9026d](https://github.com/ovh/manager/commit/dd9026dd66a8274de62c61ce8aa848c401bf875c))
* **server:** display incident banner ([b395a7a](https://github.com/ovh/manager/commit/b395a7ac7fb133ca47cd4158f0adc91f9f61ed2f))



## [16.5.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.5.0...@ovh-ux/manager-dedicated@16.5.1) (2021-03-13)


### Bug Fixes

* **ip:** remove notification on slowness ipfo actions ([#4537](https://github.com/ovh/manager/issues/4537)) ([192f369](https://github.com/ovh/manager/commit/192f3695efa423108fb0f566295f325e96580a41)), closes [#4531](https://github.com/ovh/manager/issues/4531)



# [16.5.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.4.7...@ovh-ux/manager-dedicated@16.5.0) (2021-03-13)


### Features

* **ip:** add notification on slowness ipfo actions ([#4531](https://github.com/ovh/manager/issues/4531)) ([9be484e](https://github.com/ovh/manager/commit/9be484e3861f679e9436c943544b20c480969c03))



## [16.4.7](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.4.6...@ovh-ux/manager-dedicated@16.4.7) (2021-03-11)


### Bug Fixes

* **message:** remove content ([60e26f2](https://github.com/ovh/manager/commit/60e26f2175ac8886330d93c3dd0a447419bd99cc))



## [16.4.6](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.4.5...@ovh-ux/manager-dedicated@16.4.6) (2021-03-10)


### Bug Fixes

* **banner:** add banner text ([43ed181](https://github.com/ovh/manager/commit/43ed181013ecf4966b2a627c4d7217585cfabb89))
* **message:** add content ([87324b3](https://github.com/ovh/manager/commit/87324b31855f412165df58ddd0559724831a1c29))
* **preloader:** display message in preloader ([acfe960](https://github.com/ovh/manager/commit/acfe960e8e3f1f77a97c1ed14f39291c22ebb075))



## [16.4.5](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.4.4...@ovh-ux/manager-dedicated@16.4.5) (2021-03-09)


### Bug Fixes

* **dedicated-server.install:** add BringYourOwnImage guide URL for US ([#4500](https://github.com/ovh/manager/issues/4500)) ([11edb9a](https://github.com/ovh/manager/commit/11edb9aec60be3c3da793570c1b8e9199384539e))



## [16.4.4](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.4.3...@ovh-ux/manager-dedicated@16.4.4) (2021-03-09)


### Bug Fixes

* **ip:** paginate ip parking ([#4512](https://github.com/ovh/manager/issues/4512)) ([76800ec](https://github.com/ovh/manager/commit/76800ec5d316a0c42d97a5f1c921311b623144ba))



## [16.4.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.4.2...@ovh-ux/manager-dedicated@16.4.3) (2021-03-03)


### Bug Fixes

* **ip:** display pagination for parking ([#4499](https://github.com/ovh/manager/issues/4499)) ([1498d27](https://github.com/ovh/manager/commit/1498d27571fbe1014b4e990f06e592d46e44e812))



## [16.4.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.4.1...@ovh-ux/manager-dedicated@16.4.2) (2021-03-03)


### Bug Fixes

* **dedicated:** remove period in autorenew action ([e3d9d71](https://github.com/ovh/manager/commit/e3d9d712d8bbcb7b6a6f0debbc557723535b077e))
* **i18n:** add missing translations [CDS 831] ([73742fa](https://github.com/ovh/manager/commit/73742faf028d2131bbb9c479ad86cdb155ed3464))
* **ip:** paginate ip parking ([1a65922](https://github.com/ovh/manager/commit/1a659224e8f8a9e70a47eaf0cc81bddfa50736e2))



## [16.4.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.4.0...@ovh-ux/manager-dedicated@16.4.1) (2021-03-02)


### Bug Fixes

* **i18n:** add missing translations [CDS 828] ([#4491](https://github.com/ovh/manager/issues/4491)) ([afe630b](https://github.com/ovh/manager/commit/afe630b261404254292984b445067aeb8e893808))
* bump semver range for @ovh-ux/manager-config package ([5f3eda1](https://github.com/ovh/manager/commit/5f3eda16abd4df3b46cdde241c827a1d1d6dc80c))



# [16.4.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.3.5...@ovh-ux/manager-dedicated@16.4.0) (2021-02-24)


### Bug Fixes

* **billing:** update wording ([0b57cc5](https://github.com/ovh/manager/commit/0b57cc51db6d91cea46a736417add6fcf1cc66bb))
* **deps:** bump @ovh-ux/ui-kit to v4.4.4 ([#4430](https://github.com/ovh/manager/issues/4430)) ([2f12ce6](https://github.com/ovh/manager/commit/2f12ce6b724fe90a98ce8b7cd02ace6803527306))
* **i18n:** add missing translations [CDS 801] ([1577805](https://github.com/ovh/manager/commit/1577805296161f985f73571cbe254532aabf6256))
* **i18n:** add missing translations [CDS 802] ([77d0e5b](https://github.com/ovh/manager/commit/77d0e5ba01886a65666dd3a3183fee24ff4d183a))
* **i18n:** add missing translations [CDS 806] ([2eed4bd](https://github.com/ovh/manager/commit/2eed4bdeeb4c9cfb72ff4d1ee92479b8d7b2828a))
* **i18n:** add missing translations [CDS 814] ([1e77e39](https://github.com/ovh/manager/commit/1e77e393e4414f38bd87f2d960211c848669cbb5))


### Features

* **dedicated-sever:** add tracking in baremetal commitment ([#4434](https://github.com/ovh/manager/issues/4434)) ([9f28ed5](https://github.com/ovh/manager/commit/9f28ed5301dd96835098926fb91c52ccf31d7039))



## [16.3.5](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.3.4...@ovh-ux/manager-dedicated@16.3.5) (2021-02-22)


### Bug Fixes

* **account.contacts:** contact change request redirection ([#4463](https://github.com/ovh/manager/issues/4463)) ([2c1765e](https://github.com/ovh/manager/commit/2c1765e28abc44a8d3c5b8abdbfac769980b8ba1))



## [16.3.4](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.3.3...@ovh-ux/manager-dedicated@16.3.4) (2021-02-22)


### Bug Fixes

* **billing.history:** fix search ([#4458](https://github.com/ovh/manager/issues/4458)) ([bb697a1](https://github.com/ovh/manager/commit/bb697a1a5d973fa3017a2245f70c0f981b6183f4))



## [16.3.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.3.2...@ovh-ux/manager-dedicated@16.3.3) (2021-02-16)


### Bug Fixes

* **contact:** update contact link and state ([2d51500](https://github.com/ovh/manager/commit/2d5150028b62270442d2d01ec4e2aaf0a4bb887a))



## [16.3.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.3.1...@ovh-ux/manager-dedicated@16.3.2) (2021-02-15)


### Bug Fixes

* **license:** error back license dashboard ([#4427](https://github.com/ovh/manager/issues/4427)) ([4be04b7](https://github.com/ovh/manager/commit/4be04b72e91c1d8f2c69d6b68695c0bad87e359f))



## [16.3.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.3.0...@ovh-ux/manager-dedicated@16.3.1) (2021-02-11)


### Bug Fixes

* **server.installation:** remove wrong parameter ([#4411](https://github.com/ovh/manager/issues/4411)) ([9f07e9a](https://github.com/ovh/manager/commit/9f07e9af711aa3a008fbe41f843859f2073ac887))



# [16.3.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.2.2...@ovh-ux/manager-dedicated@16.3.0) (2021-02-10)


### Bug Fixes

* **account:** prevent account contacts freezing ([1256306](https://github.com/ovh/manager/commit/12563066366e8be399f55d3c418c307d0bc3edfa))
* **billing.autorenew:** add padding ([735fbe3](https://github.com/ovh/manager/commit/735fbe328cbe7aa5825ef90fc1e504ca3c1f5fad))
* **dedicated:** add billing orders ui-view ([b2aab2f](https://github.com/ovh/manager/commit/b2aab2f824fb21805a90137c14baf38b22e789e0))
* **dedicated-cloud.upgrade:** switch datastore from hourly to monthly ([e05721f](https://github.com/ovh/manager/commit/e05721fab569b217a46872cf085979942e20b5e5))
* **deps:** remove @ovh-ux/ng-ovh-form-flat dependency ([ce8f916](https://github.com/ovh/manager/commit/ce8f916b0bda7dd93d1ce331f08afe953ac4b7f3))
* **i18n:** add missing translations [CDS 776] ([d582b98](https://github.com/ovh/manager/commit/d582b9860b2d1c2defb29d6043d1a115ea6d5c77))
* **i18n:** add missing translations [CDS 779] ([ce10d28](https://github.com/ovh/manager/commit/ce10d28bdbc6b2b2e1816d9f88412b9e7252b544))
* **i18n:** add missing translations [CDS 781] ([3bc24f5](https://github.com/ovh/manager/commit/3bc24f521c4f897c2f938f155f0b54ed79ab346f))
* **i18n:** add missing translations [CDS 782] ([b71385d](https://github.com/ovh/manager/commit/b71385d3267b279186bbf4896a4484ac1d91fee6))
* **i18n:** add missing translations [CDS 786] ([11f108d](https://github.com/ovh/manager/commit/11f108dad4e6da501e7f0712e02ec9acbbdd4403))
* **i18n:** add missing translations [CDS 787] ([daf4f31](https://github.com/ovh/manager/commit/daf4f31b7299194da96295884969d87068bb22fe))
* **i18n:** add missing translations [CDS 788] ([4f500af](https://github.com/ovh/manager/commit/4f500af76b1a15d81bbb69c2e903a16006449fd4))
* **i18n:** add missing translations [CDS 789] ([80a81c4](https://github.com/ovh/manager/commit/80a81c4f8bc7c79ed80b8a2eb2e049e0bab1cc4c))
* **i18n:** add missing translations [CDS 792] ([76ba99f](https://github.com/ovh/manager/commit/76ba99f1de5a30ee93a680ea9b098b495a38cf9f))
* **i18n:** add missing translations [CDS 793] ([2041d9a](https://github.com/ovh/manager/commit/2041d9a296621fbefa8c0fd8179a3830ce436b2b))
* **i18n:** fix some typos ([#4354](https://github.com/ovh/manager/issues/4354)) ([df5565f](https://github.com/ovh/manager/commit/df5565f42d87e28be02e23e49a68ee7af8990cd7)), closes [#4350](https://github.com/ovh/manager/issues/4350)
* **translations:** fix invalids translations (variables) ([#4404](https://github.com/ovh/manager/issues/4404)) ([bbdcd79](https://github.com/ovh/manager/commit/bbdcd79046ce59663ebf2028b57f3404264696e0))
* add missing breadcrumb translations ([91a2ebc](https://github.com/ovh/manager/commit/91a2ebcfbd8f3714a4ff49b9510c8b0078f1e265))
* hide breadcrumb on main listing page ([ae6b9f7](https://github.com/ovh/manager/commit/ae6b9f77a154b944993db29dcd2daa0559de9f4c))
* **operation.execution-date-edit:** add error details ([#4344](https://github.com/ovh/manager/issues/4344)) ([e9c5432](https://github.com/ovh/manager/commit/e9c54324ea8b76ddf12167fba2aa095e0f0beefc))
* **server.interfaces:** display garentee for bandwidth ([bda3166](https://github.com/ovh/manager/commit/bda3166920f78053f1cd75c0b02be7190bc5b834))


### Features

* **account:** add lazy loading for contacts section ([8cf225f](https://github.com/ovh/manager/commit/8cf225f7312d31a9ffd3b41ae882157947a7574a))
* rename Private cloud to Hosted private cloud ([c7baae8](https://github.com/ovh/manager/commit/c7baae88b9ef55bb213cf448984bc17764c251d1))
* rename vps and domain ([cf5f7ba](https://github.com/ovh/manager/commit/cf5f7ba206ec81e2bc5c09e569f1701fca26dd63))
* **billing:** add breadcrumb ([161d5b4](https://github.com/ovh/manager/commit/161d5b40b11f153b1fc1d977770e9a6c6c18269f))
* **billing:** add intermediate state ([13c5738](https://github.com/ovh/manager/commit/13c573840e81bdc538ba9c01aa5565d2e0d32d65))
* **useraccount:** add breadcrumb ([49f2403](https://github.com/ovh/manager/commit/49f2403f41383ca913ba7b1e9da3f41364abe0c8))


### Performance Improvements

* lazy load otrs section ([#4340](https://github.com/ovh/manager/issues/4340)) ([421940b](https://github.com/ovh/manager/commit/421940b3602cfd6f41c7145058d9b9933bcd0295))
* move out non-reused components ([#4051](https://github.com/ovh/manager/issues/4051)) ([62c12a0](https://github.com/ovh/manager/commit/62c12a025ba5ff4d3ff2bf39f00c5d9a3168e001))



## [16.2.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.2.1...@ovh-ux/manager-dedicated@16.2.2) (2021-02-04)


### Bug Fixes

* remove useless apiv7 header ([#4386](https://github.com/ovh/manager/issues/4386)) ([2a9f3a1](https://github.com/ovh/manager/commit/2a9f3a12da37818a1f4478edca6ed2bf1ba9f4b1))



## [16.2.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.2.0...@ovh-ux/manager-dedicated@16.2.1) (2021-02-02)


### Bug Fixes

* bump semver range for @ovh-ux/manager-config package ([ca04d19](https://github.com/ovh/manager/commit/ca04d19b7a038544f1b5e3b211d0a1c3b70a0d5b))



# [16.2.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.1.1...@ovh-ux/manager-dedicated@16.2.0) (2021-01-27)


### Bug Fixes

* **account.user.advanced:** replace gitter url with GitHub Discussions ([e7b1bcc](https://github.com/ovh/manager/commit/e7b1bcce495c6947022f967f38456c37fbb108c9))
* **expired:** update expired page style ([#4300](https://github.com/ovh/manager/issues/4300)) ([efc29f5](https://github.com/ovh/manager/commit/efc29f5b2bc6f9121765dd75d7c734f193bcefc0))
* **i18n:** add missing translations [CDS 767] ([e640f88](https://github.com/ovh/manager/commit/e640f8820b5c142c1dd9745e2ceadc22c76427a6))
* **i18n:** add missing translations [CDS 768] ([2b61ff8](https://github.com/ovh/manager/commit/2b61ff8d8042acb9db3344a36f05f930f3e66e63))
* **i18n:** add missing translations [CDS 773] ([2c3a548](https://github.com/ovh/manager/commit/2c3a548aa8de28c9e84b89596f703f622e7224fe))
* **i18n:** add missing translations [CDS 775] ([79d4412](https://github.com/ovh/manager/commit/79d44129b838b5da855369bfaabbd0e01f533c2a))
* **user:** return value instead of function ([#4330](https://github.com/ovh/manager/issues/4330)) ([16f1c52](https://github.com/ovh/manager/commit/16f1c52c6c81734f3a4656abc6c797342c450aa6))


### Features

* **cancellation-form:** display form when require delete at expiration ([e89d1a6](https://github.com/ovh/manager/commit/e89d1a655ddff5393325dcc89a34727b80d24189))
* add some missing tracking ([#4244](https://github.com/ovh/manager/issues/4244)) ([9c240c9](https://github.com/ovh/manager/commit/9c240c9166be35655e80e41b8bf1824e60d29734))


### Performance Improvements

* avoid unecessary ssoAuth login call ([#4327](https://github.com/ovh/manager/issues/4327)) ([4bfadd7](https://github.com/ovh/manager/commit/4bfadd70b442e03af1ea9ac71c842282554f754c))
* disable angularjs debugging in production ([#4275](https://github.com/ovh/manager/issues/4275)) ([ae6eac6](https://github.com/ovh/manager/commit/ae6eac65b402366c96368fd3de32f859d877c78b))



## [16.1.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.1.0...@ovh-ux/manager-dedicated@16.1.1) (2021-01-25)


### Bug Fixes

* **deps:** add missing dependency ([#4337](https://github.com/ovh/manager/issues/4337)) ([be8b0e6](https://github.com/ovh/manager/commit/be8b0e6fe72f6fb90e0fab3e85c726b9d3501f90)), closes [#4103](https://github.com/ovh/manager/issues/4103)



# [16.1.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.0.1...@ovh-ux/manager-dedicated@16.1.0) (2021-01-25)


### Bug Fixes

* **i18n:** add missing translations [CDS 763] ([4d25e9a](https://github.com/ovh/manager/commit/4d25e9a91e387ef3a9ef5d6fc021b0c4ceb57031))


### Features

* **server.install:** add feature flipping to display byoi and RTM ([260ea59](https://github.com/ovh/manager/commit/260ea593d57354b62a62908e00f5b32f7dc659ac))
* **server.install:** add RTM installation ([600d9ae](https://github.com/ovh/manager/commit/600d9aeb1490a79da9cf6fa59cefb4f7f84f88b2))
* **server.install:** bring your own image ([f00a937](https://github.com/ovh/manager/commit/f00a9372a1f27cae590eb8f8e3e5234d007ac974)), closes [#3489](https://github.com/ovh/manager/issues/3489)



## [16.0.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@16.0.0...@ovh-ux/manager-dedicated@16.0.1) (2021-01-21)


### Bug Fixes

* **dedicated:** add veaam backup trackers ([#4319](https://github.com/ovh/manager/issues/4319)) ([48bc63d](https://github.com/ovh/manager/commit/48bc63d3e11d90ad644ddb814136e37deb3e074e))



# [16.0.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@15.0.1...@ovh-ux/manager-dedicated@16.0.0) (2021-01-20)


### Bug Fixes

* **dedicated-server:** bandwidth plans filter ([a56315b](https://github.com/ovh/manager/commit/a56315b495dd84511e3dd77860cbc50415af527e))


### Features

* add some missing tracking ([#4244](https://github.com/ovh/manager/issues/4244)) ([c263813](https://github.com/ovh/manager/commit/c263813cb2766efd5c3bfb8fd883d99debfe27da))
* **dedicated:** add dedicated cloud datacenter advices ([f1f8054](https://github.com/ovh/manager/commit/f1f8054ddd820ffaf86e1bc2897cff69975ec270)), closes [#MANAGER-6073](https://github.com/ovh/manager/issues/MANAGER-6073)
* **uscs:** add  dvices module ([d20c873](https://github.com/ovh/manager/commit/d20c873e2c8101fdad2924d4bb04e9c94cd77bf2))
* **vps-advice-upsell:** add upsell advice for vps ([cc731ac](https://github.com/ovh/manager/commit/cc731ac134cf04352c76944f2feffc76d59ccc89))


### BREAKING CHANGES

* **uscs:** init `@ovh-ux/manager-advices` module

Signed-off-by: Ravindra Adireddy <ravindra.adireddy@ovhcloud.com>



## [15.0.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@15.0.0...@ovh-ux/manager-dedicated@15.0.1) (2021-01-14)


### Bug Fixes

* **dedicated-cloud.security.kms:** error on adding KMS ([#4271](https://github.com/ovh/manager/issues/4271)) ([f98588d](https://github.com/ovh/manager/commit/f98588d6c441e21f7f861cfd3fb1595ed83d383d))



# [15.0.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.12.1...@ovh-ux/manager-dedicated@15.0.0) (2021-01-13)


### Bug Fixes

* add error page for expired services ([#4169](https://github.com/ovh/manager/issues/4169)) ([b3875cd](https://github.com/ovh/manager/commit/b3875cd44d342e2f214e1dda710e3aaea33cb799))
* **backup:** fix handle when backup is doing ([#4236](https://github.com/ovh/manager/issues/4236)) ([3b39ffc](https://github.com/ovh/manager/commit/3b39ffcc9a38aecba5b388d6b9d159ca9442b3a3))
* **dedicatedcloud.datacenter.drp:** fix zerto plancode ([#4141](https://github.com/ovh/manager/issues/4141)) ([4bd8301](https://github.com/ovh/manager/commit/4bd830107674d66985552e6d9b334c5ed805efdb))
* **i18n:** add missing translations [CDS 724] ([df16d2b](https://github.com/ovh/manager/commit/df16d2bd2965a8a2aec02daeadbd59fbcc0c06fa))
* **i18n:** add missing translations [CDS 738] ([7a58b8e](https://github.com/ovh/manager/commit/7a58b8e13aa2c136cab8a7493f63b83be9b2db64))


### Features

* add @ovh-ux/manager-cda to dedicated ([8ea0e90](https://github.com/ovh/manager/commit/8ea0e90d5f5815add990b9b2c39eee391ac7efee))
* **chatbot:** use feature flipping to enable chatbot ([85dc448](https://github.com/ovh/manager/commit/85dc448c94f31cd387912a8ffb902d66e394a0a3))
* **metrics:** change redirection and remove refereence ([e204fc6](https://github.com/ovh/manager/commit/e204fc6ddf613bf11c2fcce69ff3269180ad396b))
* **metrics:** new module ([42e7993](https://github.com/ovh/manager/commit/42e7993ef97a345da9e4aa5b1c8778286ce560c4))
* **metrics:** rebase with develop ([d359776](https://github.com/ovh/manager/commit/d35977697933a903ba01689e056e01c3553c7e41))


### BREAKING CHANGES

* **metrics:** init `@ovh-ux/manager-metrics` module



## [14.12.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.12.0...@ovh-ux/manager-dedicated@14.12.1) (2021-01-12)


### Bug Fixes

* **autorenew.cancel-resiliation:** fix lazyloading ([#4263](https://github.com/ovh/manager/issues/4263)) ([017fa89](https://github.com/ovh/manager/commit/017fa893e3c42736498b147cb1bf7843a4403d41))



# [14.12.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.11.0...@ovh-ux/manager-dedicated@14.12.0) (2021-01-11)


### Bug Fixes

* update module billing usage ([e88862b](https://github.com/ovh/manager/commit/e88862b0990b883ef55a5d1b20e965e1affac564))


### Features

* **billing.autorenew:** adapt existing cancel resiliation modal ([74cac3b](https://github.com/ovh/manager/commit/74cac3b34aecad001aaf21c5d9bcba1cce554d72))
* **dedicated:** create new resiliation links ([3601465](https://github.com/ovh/manager/commit/36014651cfa45ce3e31adb3b51f9b538f34d6937))
* **dedicated.server:** use feature flipping for engagement display ([2d2b1bf](https://github.com/ovh/manager/commit/2d2b1bf3a07aee63d9ffd0432b36f0a99130f835))
* add tracking ([8eebca4](https://github.com/ovh/manager/commit/8eebca4feba4aa5f2b8b6a4961e2f84029b1bd62))
* allow to cancel commitment ([8d216e0](https://github.com/ovh/manager/commit/8d216e0bca7f051ee6da547fda7f3bc04cc89925))
* display engagement action ([e5c16a3](https://github.com/ovh/manager/commit/e5c16a3213673ad698bf93e356e10db536d930cb))
* **dedicated.server.dashboard:** replace billing tile ([72cc8e2](https://github.com/ovh/manager/commit/72cc8e23d5c70cf6c28941b857707fa975f7efc0))
* **payment-method.add:** allow to pass callback url ([d0bab7d](https://github.com/ovh/manager/commit/d0bab7da19511c2ca1e046bbcdf1ea365fcdb34c))
* **redirection:** add addPaymentMethod url ([d102966](https://github.com/ovh/manager/commit/d102966c6d4dfb187f3a5538053b27ff6ee76eec))



# [14.11.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.10.2...@ovh-ux/manager-dedicated@14.11.0) (2021-01-11)


### Features

* **chatbot:** use feature flipping to enable chatbot ([503aafa](https://github.com/ovh/manager/commit/503aafa76fe9d20da1251c562029986fe08d5227))



## [14.10.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.10.1...@ovh-ux/manager-dedicated@14.10.2) (2021-01-04)


### Bug Fixes

* bump semver range for @ovh-ux/manager-config package ([23b469f](https://github.com/ovh/manager/commit/23b469f6264610c47076da908f688e8069f19c76))



## [14.10.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.10.0...@ovh-ux/manager-dedicated@14.10.1) (2020-12-30)


### Bug Fixes

* **billing.history:** omit displayedColumns resolve ([#4221](https://github.com/ovh/manager/issues/4221)) ([a074835](https://github.com/ovh/manager/commit/a07483517985311f02fc1201063fe22744af31f4))
* **server:** borken mrtg select ([#4220](https://github.com/ovh/manager/issues/4220)) ([f92674e](https://github.com/ovh/manager/commit/f92674e614e2daa7559da2a7c5d26a86285aa445))



# [14.10.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.9.0...@ovh-ux/manager-dedicated@14.10.0) (2020-12-22)


### Bug Fixes

* **billing.history:** omit some layout helper params ([21bb31f](https://github.com/ovh/manager/commit/21bb31fe8a69250cda8f9f1cea1fa8a8032a122e))
* **billing.main.history:** adapt layout use ([7e7fd1d](https://github.com/ovh/manager/commit/7e7fd1d4cacb7837d83d37375404913249c001fc))
* **dedicated-cloud.datacenter.datastore:** datastore order plancode ([#4173](https://github.com/ovh/manager/issues/4173)) ([1f79824](https://github.com/ovh/manager/commit/1f798248c3b5feefa738bb5c4ac5d04aa07af20c))
* **i18n:** add missing translations [CDS 708] ([6e08722](https://github.com/ovh/manager/commit/6e08722ed1bade9488054cac9a6f3918471714ed))
* **i18n:** add missing translations [CDS 715] ([f73b0fd](https://github.com/ovh/manager/commit/f73b0fdaa77e2a6c14ca65366c6588fe57e47b35))
* **i18n:** add missing translations [CDS 716] ([4b9523e](https://github.com/ovh/manager/commit/4b9523e0bb2bf99fa243081b31a7c50c690abaa0))
* **i18n:** add missing translations [CDS 717] ([00c10dc](https://github.com/ovh/manager/commit/00c10dcdde238c35993003c6523523b6875ff7e7))
* **i18n:** add missing translations [CDS 719] ([#4192](https://github.com/ovh/manager/issues/4192)) ([5862584](https://github.com/ovh/manager/commit/58625842384c9213e3814b57d7e5521ca7c52664))
* **translations:** clean translations files ([#4194](https://github.com/ovh/manager/issues/4194)) ([cbd2ad2](https://github.com/ovh/manager/commit/cbd2ad273a0dc190ab33e93f7efc58b10768733f))
* **user.ip.restriction:** prevent removing last ip on deny default rule ([#4075](https://github.com/ovh/manager/issues/4075)) ([8aeda27](https://github.com/ovh/manager/commit/8aeda27dd01b49122c6c7d611c0bbfd69e3f9293)), closes [#4052](https://github.com/ovh/manager/issues/4052)


### Features

* **env:** use application name and universe ([ece10f5](https://github.com/ovh/manager/commit/ece10f5bcce9bd3dcd15d3448378c59bf809bd4d))



# [14.9.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.8.2...@ovh-ux/manager-dedicated@14.9.0) (2020-12-08)


### Bug Fixes

* **billing.autorenew:** fix termination issue ([#4151](https://github.com/ovh/manager/issues/4151)) ([2830fc3](https://github.com/ovh/manager/commit/2830fc3b2eaded8f3d86a7210804ba6abe938540))
* **dedicated:** fix price difference display when billing is zero ([14cb36a](https://github.com/ovh/manager/commit/14cb36ab9fca363bcb8d9d5e3768d7db93f4b8bd))
* **i18n:** add missing translations [CDS 688] ([fb31f81](https://github.com/ovh/manager/commit/fb31f8189347a80a613659573525a62fbafe0181))
* **i18n:** add missing translations [CDS 690] ([5a8ce67](https://github.com/ovh/manager/commit/5a8ce67cdd385efa957af84f2672dbeb03850469))
* **i18n:** add missing translations [CDS 692] ([6115b22](https://github.com/ovh/manager/commit/6115b223072c0aaf2a11a418b8c0f23f2793b388))
* **i18n:** add missing translations [CDS 694] ([db0eb58](https://github.com/ovh/manager/commit/db0eb5806ee057ac9c4775a327ecefc2cf8eb92c))


### Features

* **billing.confirm-terminate:** replace legacy apis ([#3518](https://github.com/ovh/manager/issues/3518)) ([7f14203](https://github.com/ovh/manager/commit/7f14203aad73c977e110c947f31036196825284a))



## [14.8.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.8.1...@ovh-ux/manager-dedicated@14.8.2) (2020-12-07)


### Bug Fixes

* **ip:** add existing virtual mac ([#4137](https://github.com/ovh/manager/issues/4137)) ([70a3b14](https://github.com/ovh/manager/commit/70a3b14f40bf36ff91e16faf11955c871c7afd53))



## [14.8.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.8.0...@ovh-ux/manager-dedicated@14.8.1) (2020-11-26)


### Bug Fixes

* **dedicated:** revert filter guides by universe ([#3998](https://github.com/ovh/manager/issues/3998)) ([451fd2d](https://github.com/ovh/manager/commit/451fd2d9835a34f7396ab1fd5d7a5b08fb258b00))



# [14.8.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.7.1...@ovh-ux/manager-dedicated@14.8.0) (2020-11-25)


### Bug Fixes

* **account.user.infos:** account birthdate validation ([#4077](https://github.com/ovh/manager/issues/4077)) ([c7b622d](https://github.com/ovh/manager/commit/c7b622d1b9b5528e0e9965edf048b1da98f04912))
* **chatbot:** add support level ([9fb6854](https://github.com/ovh/manager/commit/9fb6854396cec69872c794faefc3f01dcc0f497e))
* **dedicated:** filter guides by universe ([#3998](https://github.com/ovh/manager/issues/3998)) ([be72a76](https://github.com/ovh/manager/commit/be72a768215e45bf302238a2c45f78ee24479018))
* **deps:** upgrade ovh-api-services to v11.0.1 ([#4067](https://github.com/ovh/manager/issues/4067)) ([994f173](https://github.com/ovh/manager/commit/994f173072ab2e6920fa48049d477579f7364657))
* **i18n:** add missing translations [CDS 674] ([464f1fd](https://github.com/ovh/manager/commit/464f1fd2a6e5a7fb166f71737829a8d040c6675f))
* **i18n:** add missing translations [CDS 677] ([81ae9b6](https://github.com/ovh/manager/commit/81ae9b6f3c988e6c3458033ed95afb92f1593929))
* **i18n:** add missing translations [CDS 684] ([a73375e](https://github.com/ovh/manager/commit/a73375e5cdb1ff9a6eae7f2cb820b7c0055886f6))
* **user-contacts:** not possible to change ldp contact ([bdb1434](https://github.com/ovh/manager/commit/bdb1434bc4000fabd05e34858fcbd01612363f65)), closes [#DTRSD-24621](https://github.com/ovh/manager/issues/DTRSD-24621)


### Features

* **dedicated:** add billing autorenew terminate tracking ([fde763e](https://github.com/ovh/manager/commit/fde763e1c3dc212587680eb76326d7f0f12d5e74))
* **dedicated:** remove auto page tracking on service resiliation ([3acc9cd](https://github.com/ovh/manager/commit/3acc9cd7cd52cc94ac59ae4761a3e5f742a0e073))


### Performance Improvements

* **chatbot:** delay the chatbot initialization ([b6f3673](https://github.com/ovh/manager/commit/b6f36737c8c45ecb7c7e58cbe71e45d9660ca389))



## [14.7.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.7.0...@ovh-ux/manager-dedicated@14.7.1) (2020-11-18)


### Bug Fixes

* **dedicated:** user rights text ([88aba4a](https://github.com/ovh/manager/commit/88aba4aca727b5a0b84c88527f443ff09a5aee46)), closes [#MANAGER-5997](https://github.com/ovh/manager/issues/MANAGER-5997)
* **i18n:** add missing translations [CDS 670] ([bf33247](https://github.com/ovh/manager/commit/bf332474f5df053b65ddff2505d40636ad1a6967))
* allow to access sub dashboard states ([#4044](https://github.com/ovh/manager/issues/4044)) ([f2b3d40](https://github.com/ovh/manager/commit/f2b3d40de941e49a4c0f0fa18e1d6829d5ddc76b))



# [14.7.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.6.1...@ovh-ux/manager-dedicated@14.7.0) (2020-11-17)


### Bug Fixes

* **dedicated:** add commercial name ([2c6db72](https://github.com/ovh/manager/commit/2c6db72e9434de9903e0b63f0074f02a48bb9da8)), closes [#MANAGER-5673](https://github.com/ovh/manager/issues/MANAGER-5673)
* **dedicated:** add ip ([0e245bb](https://github.com/ovh/manager/commit/0e245bbbb55f8925ce6fc3235809540387ab3658)), closes [#MANAGER-5956](https://github.com/ovh/manager/issues/MANAGER-5956)
* **dedicated:** backup tariff url ([098ab6b](https://github.com/ovh/manager/commit/098ab6b6911eb9024d45eaedda3bac533347a447)), closes [#MANAGER-5456](https://github.com/ovh/manager/issues/MANAGER-5456)
* **dedicated:** fix sub type ([7024e8c](https://github.com/ovh/manager/commit/7024e8cc76b7cd662354936e77c56cb2be2129ff)), closes [#MANAGER-5994](https://github.com/ovh/manager/issues/MANAGER-5994)
* **dedicated:** hide nsx ([59ac919](https://github.com/ovh/manager/commit/59ac91902c4fa395c46fda4345cd5fe418e97984)), closes [#MANAGER-5673](https://github.com/ovh/manager/issues/MANAGER-5673)
* **dedicated:** pcc delete service ([0c5bce2](https://github.com/ovh/manager/commit/0c5bce2842ec60365a7e08e0f1718bf459a8e9b6)), closes [#MANAGER-5907](https://github.com/ovh/manager/issues/MANAGER-5907)
* **dedicated:** rename essentials ([468e566](https://github.com/ovh/manager/commit/468e566302b9bb5cd8a79debbc0503e8d4333e50)), closes [#MANAGER-5919](https://github.com/ovh/manager/issues/MANAGER-5919)
* **dedicated:** spla license ([1c8df1f](https://github.com/ovh/manager/commit/1c8df1f54b2a4ce52f2a31635fa7102c493e1de9)), closes [#MANAGER-5738](https://github.com/ovh/manager/issues/MANAGER-5738)
* **dedicated:** terminate pcc ([36f0694](https://github.com/ovh/manager/commit/36f069437e9dafc70c107bb370b115e63a57acfa)), closes [#MANAGER-5930](https://github.com/ovh/manager/issues/MANAGER-5930)
* **dedicated:** text changes ([08c8c1c](https://github.com/ovh/manager/commit/08c8c1ca9c235fb96c456a3a8ecaf9d7c8cb54f8)), closes [#MANAGER-5673](https://github.com/ovh/manager/issues/MANAGER-5673)
* **dedicated:** update backup links ([8a967f5](https://github.com/ovh/manager/commit/8a967f5dbe610a01a09137e32196d9804df48196)), closes [#MANAGER-5857](https://github.com/ovh/manager/issues/MANAGER-5857)
* **dedicated-ip:** replace terminate api ([61c0876](https://github.com/ovh/manager/commit/61c08769f37c179c0d3559aa18b5103592d78713)), closes [#MANAGER-5951](https://github.com/ovh/manager/issues/MANAGER-5951)
* **i18n:** add missing translations [CDS 644] ([d9426c2](https://github.com/ovh/manager/commit/d9426c2de58f544c096f1c58ee6568085b7dae6f))
* **i18n:** add missing translations [CDS 650] ([6e72d24](https://github.com/ovh/manager/commit/6e72d24aaa5dd085e207e67f8c557b27f2e9e29f))
* add essentials to billing ([bab2aa6](https://github.com/ovh/manager/commit/bab2aa6ba8f6663bd1d7ffec75123d361b04d18f))
* add essentials to manage contacts ([7f1b3f0](https://github.com/ovh/manager/commit/7f1b3f0f9d2200136df28440bde59d9193ef0f77))


### Features

* add managed baremetal ([71ee67e](https://github.com/ovh/manager/commit/71ee67e667128367f29e0db0d3f15b55be1a8d64)), closes [#MANAGER-5673](https://github.com/ovh/manager/issues/MANAGER-5673)



## [14.6.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.6.0...@ovh-ux/manager-dedicated@14.6.1) (2020-11-17)


### Bug Fixes

* **dedicated-cloud.datacenter.add:** avoid duplicate naming ([#4033](https://github.com/ovh/manager/issues/4033)) ([adcb73e](https://github.com/ovh/manager/commit/adcb73ecd771ffb09b2d57d7a77d95b48c238726))



# [14.6.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.5.1...@ovh-ux/manager-dedicated@14.6.0) (2020-11-16)


### Bug Fixes

* **billing:** remove pagination if empty list ([#3984](https://github.com/ovh/manager/issues/3984)) ([ef729d5](https://github.com/ovh/manager/commit/ef729d5102d50b547a970725d7da3dbfd55be0b0))
* **dedicated:** update translations ([#3980](https://github.com/ovh/manager/issues/3980)) ([fe5d24e](https://github.com/ovh/manager/commit/fe5d24e1c4df5d6b5f421abd70b8458bf6373931))
* **i18n:** add missing translations [CDS 638] ([2b63404](https://github.com/ovh/manager/commit/2b6340470f11b3a5b019429abbbf3f94ba9c54b3))
* **i18n:** add missing translations [CDS 639] ([ddb4bd2](https://github.com/ovh/manager/commit/ddb4bd2daec6972c4ac7696aac6541da1d1a3e26))
* **i18n:** add missing translations [CDS 646] ([2c2e07c](https://github.com/ovh/manager/commit/2c2e07cef0d49428e4957d32cf780cd194e328cb))
* **i18n:** add missing translations [CDS 649] ([9308a0e](https://github.com/ovh/manager/commit/9308a0eb699768fa9e25a21e349f5db89eb07ac6))
* **i18n:** add missing translations [CDS 653] ([59a73ea](https://github.com/ovh/manager/commit/59a73ea6c1aefa4fa4b81f1a003a7d0efabc10a4))
* **i18n:** add missing translations [CDS 655] ([7ee8d0e](https://github.com/ovh/manager/commit/7ee8d0efc0007fecbe8274c46f537a516e41bb16))
* **i18n:** add missing translations [CDS 656] ([073ee6a](https://github.com/ovh/manager/commit/073ee6aa15fff82a11547a851c8af2c6a5b66a1a))
* **i18n:** add missing translations [CDS 665] ([72bc72b](https://github.com/ovh/manager/commit/72bc72b6ab934204f4e9c4c76e6c47c15f11281c))
* **ip:** not possibble to add  mac address ([#4003](https://github.com/ovh/manager/issues/4003)) ([22338c9](https://github.com/ovh/manager/commit/22338c90c57c30f192ee511193fe1c3d3200675b))
* **models:** add dedicatedCloud class ([1c624c4](https://github.com/ovh/manager/commit/1c624c41f7017ac7a0f031b05f0ed9ea38d256b0))
* **translations:** clean translations files ([#4008](https://github.com/ovh/manager/issues/4008)) ([3dfc129](https://github.com/ovh/manager/commit/3dfc1296ce2e702b08b1f54c007123ad0c55a53a))
* **user:** change label for deactivate 2FA codes ([f76d040](https://github.com/ovh/manager/commit/f76d0402f0d7165fa6b867760d734a4ff81c9d9e))


### Features

* **dedicated-cloud:** add survey banner ([#4017](https://github.com/ovh/manager/issues/4017)) ([961b2dd](https://github.com/ovh/manager/commit/961b2ddb771dfa8f9f13dfe8905c791a7fc232f2))


### Performance Improvements

* lazy load angular-qr dependency ([#3996](https://github.com/ovh/manager/issues/3996)) ([6d5b608](https://github.com/ovh/manager/commit/6d5b608b92608bfb8fa9e164b589bd12a478bb3b))
* remove full lodash import ([#4007](https://github.com/ovh/manager/issues/4007)) ([9cf553c](https://github.com/ovh/manager/commit/9cf553c7718b51869e3cd0b3057d4f6e762716cf))
* remove raphael and justgage unused deps ([#3997](https://github.com/ovh/manager/issues/3997)) ([b547a59](https://github.com/ovh/manager/commit/b547a5946dadcee5b5002e2089534387fc0354c9))
* remove unused ckeditor import ([#3995](https://github.com/ovh/manager/issues/3995)) ([42b1a31](https://github.com/ovh/manager/commit/42b1a31dd836dbcc207ccdfe7fc421fc028e6061))
* remove unused jquery-cookie dependency ([#4014](https://github.com/ovh/manager/issues/4014)) ([9114662](https://github.com/ovh/manager/commit/9114662d99b4a8d71d8060af7d6d6556dcf0d331))



## [14.5.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.5.0...@ovh-ux/manager-dedicated@14.5.1) (2020-11-09)


### Bug Fixes

* **billing.history:** allow to pay bill indivually ([#3972](https://github.com/ovh/manager/issues/3972)) ([9d62ce9](https://github.com/ovh/manager/commit/9d62ce957ac5ce88f505de7d39ee901294e0dbe6))



# [14.5.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.4.1...@ovh-ux/manager-dedicated@14.5.0) (2020-11-02)


### Features

* **hpc:** move products on hpc universe ([b83a29c](https://github.com/ovh/manager/commit/b83a29ca7529c11492cc1ce201f9ff7c34ad097d))
* add redirection for hosted private cloud route ([#3962](https://github.com/ovh/manager/issues/3962)) ([dca8bec](https://github.com/ovh/manager/commit/dca8bec3d30e39de8f80e2b156011819dea51772))
* switch navbar universe based on states ([0f8c465](https://github.com/ovh/manager/commit/0f8c4658366aa3dcd4874ade6391da6e166a2fe0))
* **dedicated:** switch sidebar namespace based on states ([182cc0c](https://github.com/ovh/manager/commit/182cc0c9e798cd2999f4f9eebc5696ed2ec6a1d2))



## [14.4.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.4.0...@ovh-ux/manager-dedicated@14.4.1) (2020-10-29)


### Bug Fixes

* **license.vps:** match license type according to pattern ([#3952](https://github.com/ovh/manager/issues/3952)) ([742263f](https://github.com/ovh/manager/commit/742263f408f8373c98de27b3ad24211101ea2802))



# [14.4.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.3.0...@ovh-ux/manager-dedicated@14.4.0) (2020-10-28)


### Bug Fixes

* **dedicated:** hpc enhance ([e1c51b3](https://github.com/ovh/manager/commit/e1c51b32b2e354b4f8cd7677179392467180cb8a)), closes [#MANAGER-5466](https://github.com/ovh/manager/issues/MANAGER-5466)
* **deps:** upgrade webpack to v4.44.2 ([fc868d2](https://github.com/ovh/manager/commit/fc868d2670b0de220837c8917d90fa3020e6d4ca))
* **i18n:** add missing translations [CDS 617] ([08d8856](https://github.com/ovh/manager/commit/08d8856e4c2337e6f0b3c585c2276d9539388028))
* **i18n:** add missing translations [CDS 618] ([db3a67b](https://github.com/ovh/manager/commit/db3a67b2c5889ba947e4436cd2069f286fb18092))
* **ip:** fix virtual mac selector ([#3907](https://github.com/ovh/manager/issues/3907)) ([8f70837](https://github.com/ovh/manager/commit/8f70837d0477f86f9d9c18ba2e86c6f4d1e23bd6))
* **preloader:** attach preloader with user language ([6eb9cc1](https://github.com/ovh/manager/commit/6eb9cc1cc362f8cc2426965d8563de1af9dee0c8))
* add regenerator-runtime ([982d03a](https://github.com/ovh/manager/commit/982d03a1054ecc3c6fb886f57c8b8f9afe0e7001))
* replace flatten usage ([#3839](https://github.com/ovh/manager/issues/3839)) ([aef1003](https://github.com/ovh/manager/commit/aef1003b64502147768a2983019d906197798d27))


### Features

* add dbaas log to dedicated ([df46d83](https://github.com/ovh/manager/commit/df46d8323ec9a494f9b1be544a830c2f23de4f12))
* **dedicated:** hpc enhance ([7b784f8](https://github.com/ovh/manager/commit/7b784f86f251e0a8c64df8be2197d2416c893efb)), closes [#MANAGER-5466](https://github.com/ovh/manager/issues/MANAGER-5466)
* add core-js to polyfill ([1411e1c](https://github.com/ovh/manager/commit/1411e1ca873d1ffd715c43fcadfe96f26e5be874))



# [14.3.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.2.4...@ovh-ux/manager-dedicated@14.3.0) (2020-10-26)


### Bug Fixes

* **preloader:** attach preloader with user language ([6c65188](https://github.com/ovh/manager/commit/6c6518888146a4c90bd9268d0db40cb2d2df699f))


### Features

* **navbar:** rename web & server universes ([#3920](https://github.com/ovh/manager/issues/3920)) ([c740a60](https://github.com/ovh/manager/commit/c740a60a714ecf1ce1aa55cfd7bff99d95fc6eaf))



## [14.2.4](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.2.3...@ovh-ux/manager-dedicated@14.2.4) (2020-10-23)


### Bug Fixes

* **constants:** add missing trailing slash for order url ([#3904](https://github.com/ovh/manager/issues/3904)) ([da80398](https://github.com/ovh/manager/commit/da80398751b1c9a82223b19186135ede5659b032))



## [14.2.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.2.2...@ovh-ux/manager-dedicated@14.2.3) (2020-10-22)


### Bug Fixes

* **billing.autorenew:** fix email domain termination ([#3891](https://github.com/ovh/manager/issues/3891)) ([aba2afe](https://github.com/ovh/manager/commit/aba2afecf152905877ec67c072aad543fc53f777))



## [14.2.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.2.1...@ovh-ux/manager-dedicated@14.2.2) (2020-10-21)


### Bug Fixes

* correct redirection url to order funnel ([#3888](https://github.com/ovh/manager/issues/3888)) ([dc27fe1](https://github.com/ovh/manager/commit/dc27fe17c8f7a3f40b5cfa2e38e528c8c170adfb))



## [14.2.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.2.0...@ovh-ux/manager-dedicated@14.2.1) (2020-10-21)


### Bug Fixes

* **nas:** remove order section for old nas references ([#3886](https://github.com/ovh/manager/issues/3886)) ([84183ab](https://github.com/ovh/manager/commit/84183ab17ace6ed1b0bb03181c3f01d5231b0930))



# [14.2.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.1.4...@ovh-ux/manager-dedicated@14.2.0) (2020-10-20)


### Bug Fixes

* **dedicated:** ip virtual mac & minor improvements ([3bcde93](https://github.com/ovh/manager/commit/3bcde93b76626dd2e8d56c08887e76b46f31f006))
* **deps:** upgrade ovh-api-services to v11.0.0 ([#3869](https://github.com/ovh/manager/issues/3869)) ([df90e4d](https://github.com/ovh/manager/commit/df90e4de660920e3cd07b2ff6b4452b0aa861377))


### Features

* **license:** use agora order for  vps ([#3849](https://github.com/ovh/manager/issues/3849)) ([90ef6e1](https://github.com/ovh/manager/commit/90ef6e1f258d7235b05169333d90e9422b14d45c))


### Reverts

* Revert "Revert "perf(ip): improve loading time (#3796)" (#3843)" ([88a216a](https://github.com/ovh/manager/commit/88a216af8ca5f548fbc95de768f1b44edb3d13cd)), closes [#3796](https://github.com/ovh/manager/issues/3796) [#3843](https://github.com/ovh/manager/issues/3843)



## [14.1.4](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.1.3...@ovh-ux/manager-dedicated@14.1.4) (2020-10-13)


### Bug Fixes

* **config.constants:** update baremetal url in US ([#3822](https://github.com/ovh/manager/issues/3822)) ([da1d0f4](https://github.com/ovh/manager/commit/da1d0f46d2746f555b820f75ff14f7d526bf0347))
* **dedicated.nas:** add default type param if not provided ([81819e0](https://github.com/ovh/manager/commit/81819e0f42625dd192afeefbded8befb083d1bad))
* **dedicated.nas:** match type correctly ([527fdaa](https://github.com/ovh/manager/commit/527fdaa5acfd0aa513ee5c1442893cae06d2076e))
* **deps:** upgrade to @ovh-ux/manager-config v2.0.0 ([ca3f955](https://github.com/ovh/manager/commit/ca3f9554c13b1436cbdeed3de8ac69e399d5dd93))
* **i18n:** add missing translations [CDS 593] ([e561a94](https://github.com/ovh/manager/commit/e561a940e069e4b87b8c1b6f2be0348e4ab59911))
* **i18n:** add missing translations [CDS 594] ([53e8fd1](https://github.com/ovh/manager/commit/53e8fd115cdf8fbca183cd6e123ffdd92cfa7980))
* **i18n:** add missing translations [CDS 597] ([48bb8c4](https://github.com/ovh/manager/commit/48bb8c4af90552edbfade682512d73820b31f353))
* **i18n:** add missing translations [CDS 599] ([1a2a0a9](https://github.com/ovh/manager/commit/1a2a0a91293287a9557396f75ca91995fe0bdbc7))
* **i18n:** add missing translations [CDS 603] ([4e2e675](https://github.com/ovh/manager/commit/4e2e675b06edca380c3e23a63c28bfd0db442d83))
* **i18n:** add missing translations [CDS 605] ([95c86b7](https://github.com/ovh/manager/commit/95c86b75448550a605e6569367bd0fef8fddbde0))
* **i18n:** add missing translations [CDS 612] ([948f0f9](https://github.com/ovh/manager/commit/948f0f9c8676a6a6d55ea43c4cda016a9276ca76))


### Performance Improvements

* **ip:** improve loading time ([#3796](https://github.com/ovh/manager/issues/3796)) ([679e0c0](https://github.com/ovh/manager/commit/679e0c087b80849d72e4469e9e7169a3b05902b7))



## [14.1.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.1.2...@ovh-ux/manager-dedicated@14.1.3) (2020-10-05)


### Bug Fixes

* **i18n:** fix some typos in dedicatedCloud section ([#3760](https://github.com/ovh/manager/issues/3760)) ([c8157e3](https://github.com/ovh/manager/commit/c8157e3772658f46b617dabbc3aa84efdc57cfea))



## [14.1.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.1.1...@ovh-ux/manager-dedicated@14.1.2) (2020-10-02)


### Bug Fixes

* **locale:** add flatpickr locale import ([#3743](https://github.com/ovh/manager/issues/3743)) ([59291a4](https://github.com/ovh/manager/commit/59291a40b1bd419ff174d9652f88a8abbf56dbc6))


### Performance Improvements

* **flatpickr:** add webpack context replacement for flatpickr ([8751ee9](https://github.com/ovh/manager/commit/8751ee9b5ea7db27894cace3c519fc905a9d37d5))



## [14.1.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.1.0...@ovh-ux/manager-dedicated@14.1.1) (2020-10-01)


### Bug Fixes

* **billing.history:** restrict string filtering ([#3738](https://github.com/ovh/manager/issues/3738)) ([82699c9](https://github.com/ovh/manager/commit/82699c9fa01e91851edf1bdbf412e2cedb59b1df))



# [14.1.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.0.2...@ovh-ux/manager-dedicated@14.1.0) (2020-09-30)


### Bug Fixes

* **billing.history:** fix redirection to pay debt ([#3531](https://github.com/ovh/manager/issues/3531)) ([43f9357](https://github.com/ovh/manager/commit/43f93578c523de3ed9876b965b492dd55d641a18))
* **billing.history:** prevent sorting on dynamically loaded columns ([#3552](https://github.com/ovh/manager/issues/3552)) ([fc605c5](https://github.com/ovh/manager/commit/fc605c5844af434816158b66cc44295071870f0b))
* **dedicated:** replace apiv7 call with iceberg for bill csv export ([f78b91a](https://github.com/ovh/manager/commit/f78b91a459404854d996225b58859b23450ad007))
* **dedicated:** replace billing history apiv7 call with iceberg ([0156ca2](https://github.com/ovh/manager/commit/0156ca2fbc72e1f0f704279bf88e7a787a88e8e4))
* **i18n:** add missing translations [CDS 574] ([23b8252](https://github.com/ovh/manager/commit/23b825268436443d373eae39e1784e29161c80c1))
* **i18n:** add missing translations [CDS 575] ([59d30f0](https://github.com/ovh/manager/commit/59d30f04dd007ad3aaf825e702b7d58a9e5b3454))
* **i18n:** add missing translations [CDS 579] ([2d33fdd](https://github.com/ovh/manager/commit/2d33fdded8ef1fe95f27468f6ea90b39ae1a720a))
* **i18n:** add missing translations [CDS 587] ([c849f6f](https://github.com/ovh/manager/commit/c849f6fd40da8f0620486636f6e2572f1aa022fc))


### Features

* **billing.history:** add tracking ([#3499](https://github.com/ovh/manager/issues/3499)) ([bbf6b80](https://github.com/ovh/manager/commit/bbf6b8098491196eaebb8d8822dbe414639cda9b))
* **billing.history:** enable revamp for EU and CA ([3d6b79e](https://github.com/ovh/manager/commit/3d6b79ebae0f37c901de2b5aaa76e021070daccb))
* **dedicated:** private cloud service pack enhancements ([e657df5](https://github.com/ovh/manager/commit/e657df5e6980903b4a2facd7f71cf771d7cf4f4f))



## [14.0.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.0.1...@ovh-ux/manager-dedicated@14.0.2) (2020-09-29)


### Bug Fixes

* **billing.autorenew.agreements:** fix page not loading ([#3717](https://github.com/ovh/manager/issues/3717)) ([99edb9b](https://github.com/ovh/manager/commit/99edb9b75fcc28e8c732dd494a9c62e950186f4c))
* **dedicated.cloud.dashboard:** fix certificates visibility ([#3716](https://github.com/ovh/manager/issues/3716)) ([596af2c](https://github.com/ovh/manager/commit/596af2c9003c5dce0fcc28c0a84c20be0cda7a0a))



## [14.0.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@14.0.0...@ovh-ux/manager-dedicated@14.0.1) (2020-09-28)


### Bug Fixes

* **deps:** upgrade @ovh-ux/manager-server-sidebar to v3.0.0 ([3f1b29d](https://github.com/ovh/manager/commit/3f1b29df95412d15f1a804d7daa8742791ce4cab))



# [14.0.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@13.2.12...@ovh-ux/manager-dedicated@14.0.0) (2020-09-28)


### Bug Fixes

* **cloud-connect:** rearrange components ([28df078](https://github.com/ovh/manager/commit/28df0780733ad0f06f7f9a479a354cde009c9dfa)), closes [#MANAGER-5205](https://github.com/ovh/manager/issues/MANAGER-5205)
* **i18n:** add missing translations [CDS 582] ([d89587c](https://github.com/ovh/manager/commit/d89587cde6aaa67651cddca6ea717fba4e096fa3))


### Features

* **cloud-connect:** ovh cloud connect ([1b86d5c](https://github.com/ovh/manager/commit/1b86d5ca1a73e040181ac74a0eb35702a92052e8)), closes [#MANAGER-5205](https://github.com/ovh/manager/issues/MANAGER-5205)
* **dedicated:** add feature availability to cloud connect ([911feed](https://github.com/ovh/manager/commit/911feedeb2285ab611600ea8e2184aaaa7310bee))


### BREAKING CHANGES

* **cloud-connect:** init `@ovh-ux/manager-cloud-connect` module.

Signed-off-by: varun257 <varun257@gmail.com>



## [13.2.12](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@13.2.11...@ovh-ux/manager-dedicated@13.2.12) (2020-09-24)


### Bug Fixes

* **billing.autorenew:** catch if call to migration fails ([#3686](https://github.com/ovh/manager/issues/3686)) ([367465e](https://github.com/ovh/manager/commit/367465ebc69c614d1ddf3e2e95b8dea10d174ae4))



## [13.2.11](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@13.2.10...@ovh-ux/manager-dedicated@13.2.11) (2020-09-22)


### Bug Fixes

* **payment:** remove restriction on payment method deletion ([#3670](https://github.com/ovh/manager/issues/3670)) ([ed741e3](https://github.com/ovh/manager/commit/ed741e3cf87b8e48b439fe09f1c3449f337d6714))



## [13.2.10](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@13.2.9...@ovh-ux/manager-dedicated@13.2.10) (2020-09-21)


### Bug Fixes

* implement tracking ([cc87f66](https://github.com/ovh/manager/commit/cc87f665eada6cfe23aa8446d9af6f0eaefc887c)), closes [#MANAGER-5301](https://github.com/ovh/manager/issues/MANAGER-5301)
* **dedicated:** add account-migration notifications ([0fb7dc2](https://github.com/ovh/manager/commit/0fb7dc281b5a67b12bbc48810906411f61a21a36)), closes [#MANAGER-5301](https://github.com/ovh/manager/issues/MANAGER-5301)
* **dedicated:** block autorenew on scheduled migration ([ae3495e](https://github.com/ovh/manager/commit/ae3495e84392136a2a4fac9d96546f581853185b)), closes [#MANAGER-5301](https://github.com/ovh/manager/issues/MANAGER-5301)
* **dedicated:** create accept all popup ([77d5942](https://github.com/ovh/manager/commit/77d59426e8b9b67aa315d8f57bf651d845d68723)), closes [#MANAGER-5301](https://github.com/ovh/manager/issues/MANAGER-5301)
* **i18n:** add missing translations ([1a3d88b](https://github.com/ovh/manager/commit/1a3d88b824455664055930ffaad3c42a9b7f8e95))



## [13.2.9](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@13.2.8...@ovh-ux/manager-dedicated@13.2.9) (2020-09-18)


### Bug Fixes

* **payment-method:** remove outdated message when adding bank account ([#3645](https://github.com/ovh/manager/issues/3645)) ([8bce2c8](https://github.com/ovh/manager/commit/8bce2c8a0920583d309643458721f06e9eef74d2))



## [13.2.8](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@13.2.7...@ovh-ux/manager-dedicated@13.2.8) (2020-09-16)


### Bug Fixes

* **dedicated-cloud:** guide links of private cloud ([#3522](https://github.com/ovh/manager/issues/3522)) ([281b19f](https://github.com/ovh/manager/commit/281b19f0220c6c3f827727b141031a36a5e06461)), closes [#MANAGER-5556](https://github.com/ovh/manager/issues/MANAGER-5556)
* **translations:** clean translations files ([#3601](https://github.com/ovh/manager/issues/3601)) ([5a483c8](https://github.com/ovh/manager/commit/5a483c8145d305aa5b5cf959f373d23a4f86b894))
* **useraccount:** remove extra header-tabs-item ([#3622](https://github.com/ovh/manager/issues/3622)) ([0549913](https://github.com/ovh/manager/commit/05499136984d8ce99e2df0bff5c1cbe116e46075)), closes [/github.com/ovh/ovh-ui-kit/commit/77f6330f1ccc12d31eaea8a02e11b459e7ea57a0#diff-fec232260aa57f8f05ac33868e24e6d3](https://github.com//github.com/ovh/ovh-ui-kit/commit/77f6330f1ccc12d31eaea8a02e11b459e7ea57a0/issues/diff-fec232260aa57f8f05ac33868e24e6d3)



## [13.2.7](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@13.2.6...@ovh-ux/manager-dedicated@13.2.7) (2020-09-15)


### Bug Fixes

* **billing.autorenew:** remove extra header-tabs-item ([#3620](https://github.com/ovh/manager/issues/3620)) ([d05e615](https://github.com/ovh/manager/commit/d05e61598b67da95e25399ffd8ec2dc0c669dd5d)), closes [/github.com/ovh/ovh-ui-kit/commit/77f6330f1ccc12d31eaea8a02e11b459e7ea57a0#diff-fec232260aa57f8f05ac33868e24e6d3](https://github.com//github.com/ovh/ovh-ui-kit/commit/77f6330f1ccc12d31eaea8a02e11b459e7ea57a0/issues/diff-fec232260aa57f8f05ac33868e24e6d3)
* **dedicated:** hosting private db delete url ([#3616](https://github.com/ovh/manager/issues/3616)) ([47859e6](https://github.com/ovh/manager/commit/47859e6498675b586f073c42365acef4781ffb8c))
* **dedicated.server.bandwidth:** use downgrade instead of resiliation ([#3546](https://github.com/ovh/manager/issues/3546)) ([e67555b](https://github.com/ovh/manager/commit/e67555b8483663de25964f3491049adaa2bb737c))



## [13.2.6](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@13.2.5...@ovh-ux/manager-dedicated@13.2.6) (2020-09-14)


### Bug Fixes

* **dedicated:** escape query params ([#3604](https://github.com/ovh/manager/issues/3604)) ([59fea65](https://github.com/ovh/manager/commit/59fea650609c6cfc3401bc74d30f13fb058dcfa0))
* **dedicated.server:** no sms monitoring in US ([#3605](https://github.com/ovh/manager/issues/3605)) ([077861c](https://github.com/ovh/manager/commit/077861c004a157c76cc3e9b5620eb2e70078f099))



## [13.2.5](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@13.2.4...@ovh-ux/manager-dedicated@13.2.5) (2020-09-10)


### Bug Fixes

* **dedicated-server:** ip monitoring management ([#3579](https://github.com/ovh/manager/issues/3579)) ([7ac426e](https://github.com/ovh/manager/commit/7ac426ead849b1d455d3ee372786c7fa6d79e4b3)), closes [#DTRSD-19171](https://github.com/ovh/manager/issues/DTRSD-19171)



## [13.2.4](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@13.2.3...@ovh-ux/manager-dedicated@13.2.4) (2020-09-03)


### Bug Fixes

* **billing.autorenew:** pass service type for resiliation ([#3563](https://github.com/ovh/manager/issues/3563)) ([ddb600a](https://github.com/ovh/manager/commit/ddb600a33ba1ed86b68e5009b8f476b33e4d9498))
* **dedicated:** add ssh key name validation ([#3556](https://github.com/ovh/manager/issues/3556)) ([d26ddbb](https://github.com/ovh/manager/commit/d26ddbb7cf848ce0872cab0ed2a581bcb7aa37c4))
* **dedicated:** monitoring units ([#3564](https://github.com/ovh/manager/issues/3564)) ([a67515a](https://github.com/ovh/manager/commit/a67515a9988ea03822983daaa568c60fd0437258))



## [13.2.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@13.2.2...@ovh-ux/manager-dedicated@13.2.3) (2020-09-01)


### Bug Fixes

* **i18n:** add missing translations [CDS 552] ([075dcb3](https://github.com/ovh/manager/commit/075dcb3250b6be3a583e4756f19f024c02423575))
* **order:** add order status tracking ([c86845d](https://github.com/ovh/manager/commit/c86845de577d6d5620889442c611e5bdee7cec58))



## [13.2.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@13.2.1...@ovh-ux/manager-dedicated@13.2.2) (2020-08-26)


### Bug Fixes

* **dedicated:** private cloud guide urls ([#3472](https://github.com/ovh/manager/issues/3472)) ([c5226e9](https://github.com/ovh/manager/commit/c5226e92f51b1aec842ba72f574167b6022b9094)), closes [#MANAGER-5495](https://github.com/ovh/manager/issues/MANAGER-5495)



## [13.2.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@13.2.0...@ovh-ux/manager-dedicated@13.2.1) (2020-08-26)


### Bug Fixes

* **dedicated-server:** bandwidth shown is not correct ([3f77b44](https://github.com/ovh/manager/commit/3f77b448724efe00e5150ea5707c9fff43071d6e)), closes [#DTRSD-18400](https://github.com/ovh/manager/issues/DTRSD-18400)



# [13.2.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@13.1.3...@ovh-ux/manager-dedicated@13.2.0) (2020-08-26)


### Bug Fixes

* **dashboard.options:** check sectorSpecificCompliance availability ([#3477](https://github.com/ovh/manager/issues/3477)) ([0e6c721](https://github.com/ovh/manager/commit/0e6c721afc704b6fb310d2b6ce60e938f9612bbc))
* **dedicated:** pcc ip option order ([#3498](https://github.com/ovh/manager/issues/3498)) ([cb229ec](https://github.com/ovh/manager/commit/cb229ec31aba0d83519c2d2ecaae70c59a4f55db))
* **dedicated:** pcc mailing list ([#3478](https://github.com/ovh/manager/issues/3478)) ([dcabcb6](https://github.com/ovh/manager/commit/dcabcb656aba8c1134e11093191aba40d2697054)), closes [#MANAGER-5531](https://github.com/ovh/manager/issues/MANAGER-5531)
* **dedicated-cloud.license:** allow to have no contracts ([#3476](https://github.com/ovh/manager/issues/3476)) ([e4d97ef](https://github.com/ovh/manager/commit/e4d97ef8aabe1b5a61338518d05599f076016474))
* **dedicated-cloud.terminate:** redirect to complete state ([#3508](https://github.com/ovh/manager/issues/3508)) ([4726a47](https://github.com/ovh/manager/commit/4726a47a3dffa2b0ef549ec0726de883394f62d0))
* **payment-method:** iframe integration validation ([#3507](https://github.com/ovh/manager/issues/3507)) ([9a7c3b9](https://github.com/ovh/manager/commit/9a7c3b9cff37e933f181d9cd33894ae38ad2bd17))
* **pcc:** use cartServiceOption for resource upgrade ([c980ba8](https://github.com/ovh/manager/commit/c980ba80c67c07f7762b0dcb49b34b3082ec790b))


### Features

* **dedicated-cloud:** allow to delete at expiration ([#3466](https://github.com/ovh/manager/issues/3466)) ([ca873c7](https://github.com/ovh/manager/commit/ca873c7eec1d39b8b1ef7f40531aaf6804f61e76))



## [13.1.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@13.1.2...@ovh-ux/manager-dedicated@13.1.3) (2020-08-25)


### Bug Fixes

* **dedicated:** ips are not listing ([c2ee4ad](https://github.com/ovh/manager/commit/c2ee4adb055d735a49d43447c8eeee97b47605e2)), closes [#DTRSD-17970](https://github.com/ovh/manager/issues/DTRSD-17970)



## [13.1.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@13.1.1...@ovh-ux/manager-dedicated@13.1.2) (2020-08-25)


### Bug Fixes

* **autorenew:** add serviceType parameter ([44eb046](https://github.com/ovh/manager/commit/44eb0468eaa010f89fc81d4ec0c26d169d7367d0))



## [13.1.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@13.1.0...@ovh-ux/manager-dedicated@13.1.1) (2020-08-18)


### Bug Fixes

* **hpc:** update text for new range ([28797f9](https://github.com/ovh/manager/commit/28797f9532374d9448823441016efab63794e17f))
* **i18n:** add missing translations [CDS 526] ([350155a](https://github.com/ovh/manager/commit/350155a53c842595e6ceb5f42b3628f6f5ba12af))
* **locale:** move locale detection in bootstrapApplication ([92d1050](https://github.com/ovh/manager/commit/92d1050613a2466ce2447e2c3d322ae81165530a))
* **locale:** use locale/language from environment ([472f3c7](https://github.com/ovh/manager/commit/472f3c728a02d34dd4d956af6562bfc3f0b42d70))
* **locale:** use user locale from manager-config ([81e8d10](https://github.com/ovh/manager/commit/81e8d1009455d7524ee86a5183a8db517640ef41))



# [13.1.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@13.0.2...@ovh-ux/manager-dedicated@13.1.0) (2020-08-05)


### Bug Fixes

* **account.user.password:** retrieve correct email address ([#3366](https://github.com/ovh/manager/issues/3366)) ([6fdaa84](https://github.com/ovh/manager/commit/6fdaa843c8f07393ab3313f7b8ef84bf46423875)), closes [#3015](https://github.com/ovh/manager/issues/3015)
* **dedicated.server:** remove margin from header ([#3370](https://github.com/ovh/manager/issues/3370)) ([6dd00c1](https://github.com/ovh/manager/commit/6dd00c1c8ef2015d3a484528048def8bb120a944))


### Features

* **dedicated:** import notifications sidebar ([83cd477](https://github.com/ovh/manager/commit/83cd477c0b87bb06b7c5b17f55478e3a77290cce))
* **manager:** import manager-account-sidebar ([bdfd5f9](https://github.com/ovh/manager/commit/bdfd5f9c69acdf2c393712401fc2374a472c7eee))



## [13.0.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@13.0.1...@ovh-ux/manager-dedicated@13.0.2) (2020-08-05)


### Bug Fixes

* **billing.autorenew:** import renew constant ([#3375](https://github.com/ovh/manager/issues/3375)) ([0fc9d96](https://github.com/ovh/manager/commit/0fc9d96cd7a5d319912964be7633db10823f1515))
* **deps:** upgrade @ovh-ux/ui-kit to v4.2.3 ([#3376](https://github.com/ovh/manager/issues/3376)) ([fd461ba](https://github.com/ovh/manager/commit/fd461ba26ce7d77328c6951594e3c49ffee51b19))



## [13.0.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@13.0.0...@ovh-ux/manager-dedicated@13.0.1) (2020-07-29)


### Bug Fixes

* **deps:** use latest dependencies ([#3335](https://github.com/ovh/manager/issues/3335)) ([01d3a89](https://github.com/ovh/manager/commit/01d3a8901b7d2404f6299c4c04e1630146b6f2d8))



# [13.0.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.7.2...@ovh-ux/manager-dedicated@13.0.0) (2020-07-29)


### Bug Fixes

* use correct index for stepper position ([#3332](https://github.com/ovh/manager/issues/3332)) ([9414ece](https://github.com/ovh/manager/commit/9414ececb76cd74b14a0ccb858a7848fd4b3372b))
* **dedicated:** replace cancel label with confirm ([#3316](https://github.com/ovh/manager/issues/3316)) ([9126548](https://github.com/ovh/manager/commit/9126548d3e157372f2f46ba7e95fbcfc1c3bf259))
* **dropdown-menu:** use uib-dropdown for toggling ([0f16566](https://github.com/ovh/manager/commit/0f16566676ef8681324b39bf182340c14eab32dc))
* **i18n:** add missing translations [CDS 482] ([23b5a33](https://github.com/ovh/manager/commit/23b5a337f1277f552880eb8e5637fcd5d36b4e4d))
* **i18n:** add missing translations [CDS 483] ([01674c9](https://github.com/ovh/manager/commit/01674c95c72eb4595a4f3b0a969b26aacca1e010))
* **i18n:** add missing translations [CDS 484] ([d4cbfdf](https://github.com/ovh/manager/commit/d4cbfdf5962961703671c198d5fc049317d73407))
* **i18n:** add missing translations [CDS 488] ([08ed551](https://github.com/ovh/manager/commit/08ed551499f9a8adffb2c8a15ec5cf55fa1e6dbe))
* **i18n:** add missing translations [CDS 501] ([e8d1d62](https://github.com/ovh/manager/commit/e8d1d6208bad1012c7713093460fd5ef8c101158))
* **user.support-level:** fix discover button display ([#3325](https://github.com/ovh/manager/issues/3325)) ([a823244](https://github.com/ovh/manager/commit/a823244a81e9400227704df91bde47dec135eed3))
* remove style override for links ([22a784c](https://github.com/ovh/manager/commit/22a784c279fc3819bbeafdddac9cf9bd0215b928))
* **icon:** fix oui-icon-trash_concept ([#3287](https://github.com/ovh/manager/issues/3287)) ([9347797](https://github.com/ovh/manager/commit/934779770b4db186cc4ed53caf3ca216853367c7))


### Features

* upgrade ovh-ui-kit to v4 ([f48f258](https://github.com/ovh/manager/commit/f48f2587c367b06939c452428c5783c2fb1c1b8d))
* upgrade ovh-ui-kit-bs to v4 ([d649cd7](https://github.com/ovh/manager/commit/d649cd7d566ac39d172b2e36625fde83bd99c9f5))
* use component for billing actions on services ([c907399](https://github.com/ovh/manager/commit/c907399239f89a915ab891feff04778de714a9ef))


### BREAKING CHANGES

* bump ovh-ui-kit to latest major

Signed-off-by: Axel Peter <axel.peter@live.com>
* bump ovh-ui-kit-bs to latest major

Signed-off-by: Axel Peter <axel.peter@live.com>



## [12.7.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.7.1...@ovh-ux/manager-dedicated@12.7.2) (2020-07-15)


### Bug Fixes

* **dedicated.server:** installation ([#3254](https://github.com/ovh/manager/issues/3254)) ([5d6e9b0](https://github.com/ovh/manager/commit/5d6e9b00d7fb79f711e50ffa9488b87da759afdd))



## [12.7.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.7.0...@ovh-ux/manager-dedicated@12.7.1) (2020-07-09)


### Bug Fixes

* **ip.order:** limit quantity for VPS ([#3227](https://github.com/ovh/manager/issues/3227)) ([cf5610e](https://github.com/ovh/manager/commit/cf5610eff008aa50b340c6d5333654c7532a84fb))



# [12.7.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.6.2...@ovh-ux/manager-dedicated@12.7.0) (2020-07-08)


### Bug Fixes

* **billing.payment.method:** add missing translations ([#3211](https://github.com/ovh/manager/issues/3211)) ([5ac7a73](https://github.com/ovh/manager/commit/5ac7a7348e4b58a429ba161655a021d9f234b643)), closes [#3156](https://github.com/ovh/manager/issues/3156)
* **dedicated:** handle case of null license ([#3209](https://github.com/ovh/manager/issues/3209)) ([7713039](https://github.com/ovh/manager/commit/77130390b9ad71ae75549ad7700c908ffcf42691))
* **deps:** set right semver range ([#3192](https://github.com/ovh/manager/issues/3192)) ([bd57faa](https://github.com/ovh/manager/commit/bd57faa72cd3f09140363425f360c2069c496d6e)), closes [#3054](https://github.com/ovh/manager/issues/3054)
* **i18n:** add missing translations [CDS 475] ([5c5eb12](https://github.com/ovh/manager/commit/5c5eb1243570dd7029f7883c8cf2e8225b9f970a))
* **i18n:** add missing translations [CDS 478] ([5030f68](https://github.com/ovh/manager/commit/5030f68195ea3b5cc19654fb4d0ea6a5f42c898d))
* **i18n:** add missing translations [CDS 479] ([c547aef](https://github.com/ovh/manager/commit/c547aef25a90f5e155242a76441a228ab31c9a6d))
* prevent angular-chart.js from being instanciated twice ([#2996](https://github.com/ovh/manager/issues/2996)) ([6da0a0b](https://github.com/ovh/manager/commit/6da0a0b9bb1a5a25efafb2b92dd21967b104ed25))


### Features

* **account.user.support:** add display for partners ([694cafc](https://github.com/ovh/manager/commit/694cafc5208bb5573d3ccd0e5076a57f44e8f342))
* **billing:** add warning on payment method add page ([4598fac](https://github.com/ovh/manager/commit/4598facfca763234b5f325002e8f885353dfd178))
* **dedicated:** handle sgx advanced option ([39123d2](https://github.com/ovh/manager/commit/39123d2da1d068ed9b51111595db220fef7583a8))
* **sgx:** add tracking ([8b3cfd1](https://github.com/ovh/manager/commit/8b3cfd1d8fff0de31b11e57bc1922a0154af11a2))



## [12.6.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.6.1...@ovh-ux/manager-dedicated@12.6.2) (2020-07-07)


### Bug Fixes

* **billing.history:** disable revamp for all regions ([#3206](https://github.com/ovh/manager/issues/3206)) ([3420b4c](https://github.com/ovh/manager/commit/3420b4c56db158458b714410eeea2ce84492d984))



## [12.6.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.6.0...@ovh-ux/manager-dedicated@12.6.1) (2020-07-07)


### Bug Fixes

* **billing.history:** display correct translation for total with VAT ([996c1de](https://github.com/ovh/manager/commit/996c1de168f26bd916485f29f8fcd76a350b88d2))
* **billing.history:** use correct error message ([40b69fb](https://github.com/ovh/manager/commit/40b69fb425a64c3170ae38daa1685f93ab28a3ab))



# [12.6.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.5.5...@ovh-ux/manager-dedicated@12.6.0) (2020-07-06)


### Bug Fixes

* **billing.history.legacy:** fix search by reference ([b92a131](https://github.com/ovh/manager/commit/b92a131433c60283d8f7d5290c1e5e18d806de24))
* **i18n:** add missing translations [CDS 460] ([f11fb75](https://github.com/ovh/manager/commit/f11fb75bf6b9d2ee268da624131722657c57aa44))


### Features

* **billing.history:** remove category column ([199fa2a](https://github.com/ovh/manager/commit/199fa2ac5eb0b63ba7cc50b6049a24d695006c08))
* **billing.history:** revamp history display ([d38f4a9](https://github.com/ovh/manager/commit/d38f4a96fabeaf15163f303780d5f3df4000b78d))



## [12.5.5](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.5.4...@ovh-ux/manager-dedicated@12.5.5) (2020-06-17)


### Bug Fixes

* **dedicated.configuration:** update US doc link ([#3111](https://github.com/ovh/manager/issues/3111)) ([2299ffb](https://github.com/ovh/manager/commit/2299ffb03d19c90c64d58d0663f7286aac9dbe32))



## [12.5.4](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.5.3...@ovh-ux/manager-dedicated@12.5.4) (2020-06-16)


### Bug Fixes

* **account.contacts.service:** url encode servicename ([#3077](https://github.com/ovh/manager/issues/3077)) ([a31dc09](https://github.com/ovh/manager/commit/a31dc0966169a825294d04ec7e5a284223b5b929))



## [12.5.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.5.2...@ovh-ux/manager-dedicated@12.5.3) (2020-06-15)


### Bug Fixes

* **dedicatedcloud:** change the way to fetch the catalog ([#3116](https://github.com/ovh/manager/issues/3116)) ([a272cee](https://github.com/ovh/manager/commit/a272cee7653c34444cd3a3378e090264096ea549))



## [12.5.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.5.1...@ovh-ux/manager-dedicated@12.5.2) (2020-06-09)


### Bug Fixes

* **account.user.dashboard:** update bill links for enterprise customer ([#3030](https://github.com/ovh/manager/issues/3030)) ([cac2593](https://github.com/ovh/manager/commit/cac25935b63d5a0a0ed59756288414c0f4fa55db))
* **emailpro:** fix header tabs button ([47d208b](https://github.com/ovh/manager/commit/47d208b44dcad2fedab44b6771d4da79a80dbfc9))
* **ip:** handle deleted services ([296f3a3](https://github.com/ovh/manager/commit/296f3a3ae47ff42996c95e3593252c820f5c5f07))
* **ip:** handle ip offers region based on available countries ([ad32575](https://github.com/ovh/manager/commit/ad32575f728f883df2db677fbd3f495873b8f1cc))


### Reverts

* Revert "fix: remove ui consistency" ([5435159](https://github.com/ovh/manager/commit/543515950323b10d054ba354ff0054c5a8a3d3d1))



## [12.5.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.5.0...@ovh-ux/manager-dedicated@12.5.1) (2020-06-02)


### Bug Fixes

* **deps:** update dependencies with latest version ([#3057](https://github.com/ovh/manager/issues/3057)) ([24d06ad](https://github.com/ovh/manager/commit/24d06addfaab0716e725242beae2d3d92feb8856))



# [12.5.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.4.3...@ovh-ux/manager-dedicated@12.5.0) (2020-06-02)


### Bug Fixes

* **i18n:** add missing translations [CDS 423] ([23a5258](https://github.com/ovh/manager/commit/23a525814da061793ec907b6939e48cca1292d5b))
* **translations:** clean translations files ([#3038](https://github.com/ovh/manager/issues/3038)) ([57040ad](https://github.com/ovh/manager/commit/57040adfcac601cbf48f27fb804decfd60800797))
* remove ui consistency ([#3029](https://github.com/ovh/manager/issues/3029)) ([34be0be](https://github.com/ovh/manager/commit/34be0bea216d575254017265d5650dace12ae582))
* **i18n:** add missing translations [CDS 409] ([86adc04](https://github.com/ovh/manager/commit/86adc0469a44a243bb3fb61296b284245a3b1b6e))
* **server-sidebar:** fix ms-Icon hover effect ([#2983](https://github.com/ovh/manager/issues/2983)) ([4bb32cc](https://github.com/ovh/manager/commit/4bb32ccbd3e7d0e09beb4f60701d3256d7ae7727))


### Features

* **billing.confirm-terminate:** revamp termination form ([faf2755](https://github.com/ovh/manager/commit/faf2755a34c41691f55f11f1ea8ca463cb9bf550))
* add ovhcloud light theme imports ([24d56fb](https://github.com/ovh/manager/commit/24d56fb62a949e01de5f9929c0fe53239c889a59))
* **account.contacts:** sort services consistently by name and category ([#2783](https://github.com/ovh/manager/issues/2783)) ([aa19a43](https://github.com/ovh/manager/commit/aa19a43995da924336288357202585604107999e))
* **sidebar:** apply ovhcloud light theme ([cf38dc9](https://github.com/ovh/manager/commit/cf38dc9e5a788062f22fdbc1432aa36f0edbb29a))



## [12.4.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.4.2...@ovh-ux/manager-dedicated@12.4.3) (2020-05-18)


### Bug Fixes

* **payment:** update notification for bank account validation ([#2943](https://github.com/ovh/manager/issues/2943)) ([d397535](https://github.com/ovh/manager/commit/d39753574034b0dcb92a40eae68fea7b034344d5))



## [12.4.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.4.1...@ovh-ux/manager-dedicated@12.4.2) (2020-05-14)


### Bug Fixes

* **ip:** remove specific route use for vps ([26a476b](https://github.com/ovh/manager/commit/26a476b11a78efe9448fce8b0d73eef4c79bd02b))



## [12.4.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.4.0...@ovh-ux/manager-dedicated@12.4.1) (2020-05-13)


### Bug Fixes

* **account.user.support-level:** use correct url for CZ,FI and LT ([#2930](https://github.com/ovh/manager/issues/2930)) ([23d2df9](https://github.com/ovh/manager/commit/23d2df98596f58e46da593865d7bf6ea2f595a14))



# [12.4.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.3.3...@ovh-ux/manager-dedicated@12.4.0) (2020-05-13)


### Bug Fixes

* **billing:** display pay as you go section ([#2880](https://github.com/ovh/manager/issues/2880)) ([8cda425](https://github.com/ovh/manager/commit/8cda4253003a7cda303ec1be39273ff539e03fc6))
* **i18n:** add missing translations [CDS 383] ([a784a99](https://github.com/ovh/manager/commit/a784a999d869e4b069b7d56f33bb53048fa06bc8))


### Features

* **dedicated.cloud:** add veeam backup storage ([#2320](https://github.com/ovh/manager/issues/2320)) ([61f53d4](https://github.com/ovh/manager/commit/61f53d4b6507158941a76defbc72b7302a4206f3))



## [12.3.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.3.2...@ovh-ux/manager-dedicated@12.3.3) (2020-04-28)


### Bug Fixes

* **dedicated.cloud:** update some hpc texts ([#2825](https://github.com/ovh/manager/issues/2825)) ([9e4a574](https://github.com/ovh/manager/commit/9e4a5749f4a565a5faadea548b63ea6c55a56d44))
* **i18n:** add missing translations [CDS 356] ([d2ae13f](https://github.com/ovh/manager/commit/d2ae13f6679c081a2514a9dafad4955265a4d9bd))
* **i18n:** add missing translations [CDS 357] ([409dc06](https://github.com/ovh/manager/commit/409dc06ae0fc802fe23b859a037347d60908fe4e))
* **i18n:** add missing translations [CDS 363] ([7744b56](https://github.com/ovh/manager/commit/7744b566803e45dd7863d43b21764b5a935fd52f))
* **i18n:** add missing translations [CDS 368] ([d6f6809](https://github.com/ovh/manager/commit/d6f6809ea899cfbd3118f1ee242e0ccc4db7ee8e))
* **i18n:** add missing translations [CDS 369] ([38691ec](https://github.com/ovh/manager/commit/38691eccb391af0d2c9e7b700bdfd2839ef3da85))



## [12.3.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.3.1...@ovh-ux/manager-dedicated@12.3.2) (2020-04-22)


### Bug Fixes

* **dedicated.ip:** can order ip addresses again ([e1cfc8a](https://github.com/ovh/manager/commit/e1cfc8a331adf418efbed11fbbc085d67f476f71))



## [12.3.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.3.0...@ovh-ux/manager-dedicated@12.3.1) (2020-04-21)


### Bug Fixes

* **i18n:** add missing translations [CDS 363] ([33e18d9](https://github.com/ovh/manager/commit/33e18d9ca00a9428eaf70f76ea2adc92c32891d6))
* **payment:** add legal disclaimer ([#2821](https://github.com/ovh/manager/issues/2821)) ([25e248c](https://github.com/ovh/manager/commit/25e248c356be23572c0adbeae522d95dd107a45c))



# [12.3.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.2.3...@ovh-ux/manager-dedicated@12.3.0) (2020-04-20)


### Bug Fixes

* **ip:** add missing annotations ([176f903](https://github.com/ovh/manager/commit/176f903be42c2697b197e4f0f3b7af369f42a75e))
* **ip:** filter correctly vps by region ([e03bd10](https://github.com/ovh/manager/commit/e03bd10e8d7057daa0ddd11483d539ac58d18415))
* **ip:** filter expired services ([ebf3662](https://github.com/ovh/manager/commit/ebf36626eb77480824726c3224d9f7ae65b7cf8c))
* **ip:** use correct label for APAC ip ([d99439e](https://github.com/ovh/manager/commit/d99439e9c5736caba869603fabd1c11054f9b075))
* **ip:** use handling method through array function ([0c0675d](https://github.com/ovh/manager/commit/0c0675dc901f46d89619a2d9be97fc34d2e9415e))
* **vps2020:** filter list of available countries for VPS ([8ae6fa6](https://github.com/ovh/manager/commit/8ae6fa6820d023ff707c4a0cdaf0765ff087771b))


### Features

* **dedicated:** add manager models dep ([8a00966](https://github.com/ovh/manager/commit/8a00966c9e5a32aa08785f215a0184d62868416c))
* **ip:** add vps services to agora ip order ([543416c](https://github.com/ovh/manager/commit/543416c8e51f4b0811bf4899cb011beb930bfaa1))
* **ip:** preselect vps service from legacy order modal ([6d7d2bd](https://github.com/ovh/manager/commit/6d7d2bd17c8812ebf7eecb0a8d2c172ef614c998))
* **ip:** redirect vps new range to agora order modal ([18b7b3a](https://github.com/ovh/manager/commit/18b7b3ae8466d0969867802c25a1931eabc95e9a))
* **ip:** use subsidiary for ip offers ([fc9b16d](https://github.com/ovh/manager/commit/fc9b16d1d937e23b9b74f5f41cdd4aad52781294))
* **vps:** update dependencies ([6850c3c](https://github.com/ovh/manager/commit/6850c3c47d72c38aba2e70a2c26b89dc5ba58f09))



## [12.2.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.2.2...@ovh-ux/manager-dedicated@12.2.3) (2020-04-20)


### Bug Fixes

* **i18n:** add missing translations [CDS 357] ([#2811](https://github.com/ovh/manager/issues/2811)) ([953c51b](https://github.com/ovh/manager/commit/953c51b39eee04c2b2be61269a4948a1f1b50a51))



## [12.2.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.2.1...@ovh-ux/manager-dedicated@12.2.2) (2020-04-16)


### Bug Fixes

* **billing.confirm-terminate:** add missing translations ([#2784](https://github.com/ovh/manager/issues/2784)) ([74158a6](https://github.com/ovh/manager/commit/74158a6cd237b27bba815e1761042aac0bbb3f94))
* **dedicated-cloud:** handle password denied chars ([#2759](https://github.com/ovh/manager/issues/2759)) ([8e16b0d](https://github.com/ovh/manager/commit/8e16b0d4e95d9e726025e06c8184358e265aefc6))
* **error:** remove duplicate routing import ([#2741](https://github.com/ovh/manager/issues/2741)) ([3ca88e9](https://github.com/ovh/manager/commit/3ca88e9ce540837b8a05d9edba4b0a593484256d))
* **i18n:** add missing translations [CDS 335] ([eae91e9](https://github.com/ovh/manager/commit/eae91e9fbf779b3c6e0a34066725d42df764639a))
* **i18n:** add missing translations [CDS 338] ([ce7c630](https://github.com/ovh/manager/commit/ce7c630ccb50b1dc4535756b392947adbbf4c62a))
* **i18n:** add missing translations [CDS 340] ([d9355bb](https://github.com/ovh/manager/commit/d9355bb0179b8673c4a00109899993341ed01fa2))
* **i18n:** add missing translations [CDS 345] ([4a0673e](https://github.com/ovh/manager/commit/4a0673e9627b44076e7d9f641060a04a705be0bc))
* **i18n:** add missing translations [CDS 351] ([c76b783](https://github.com/ovh/manager/commit/c76b783ee6ef33f08cb22361ef45eb583cff3221))
* **i18n:** add missing translations [CDS 353] ([dd57828](https://github.com/ovh/manager/commit/dd578281ceaa43df230eb4e78aa264f78c57827b))
* **server.interfaces:** handle legacy bare metal servers ([#2678](https://github.com/ovh/manager/issues/2678)) ([4749f66](https://github.com/ovh/manager/commit/4749f66d711c8729a54deb42da3fd3aae97d9c06))



## [12.2.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.2.0...@ovh-ux/manager-dedicated@12.2.1) (2020-04-15)


### Performance Improvements

* import dynamically moment locales ([#2755](https://github.com/ovh/manager/issues/2755)) ([5f3320d](https://github.com/ovh/manager/commit/5f3320d92802a1f4a6d65baf60f74917b8e58f4a))



# [12.2.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.1.0...@ovh-ux/manager-dedicated@12.2.0) (2020-04-08)


### Features

* **account.user-dashboard:** display nichandle and customer code ([ddd789a](https://github.com/ovh/manager/commit/ddd789ad3265a6bb8d4ac5a4e9ac328998ff9dd0))



# [12.1.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.0.1...@ovh-ux/manager-dedicated@12.1.0) (2020-04-06)


### Bug Fixes

* **i18n:** add missing translations [CDS 328] ([44f364b](https://github.com/ovh/manager/commit/44f364b7ab7c10b323acd59d6b185c9b00707c7f))


### Features

* **billing.confirm-terminate:** revamp termination form ([c22d44f](https://github.com/ovh/manager/commit/c22d44f66357127f98bab8fd3d559e846888b965))



## [12.0.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@12.0.0...@ovh-ux/manager-dedicated@12.0.1) (2020-04-02)


### Bug Fixes

* **license:** avoid hiding navbar ([#2725](https://github.com/ovh/manager/issues/2725)) ([a5657b9](https://github.com/ovh/manager/commit/a5657b9990c7562ac920a7a4228015841db9ca1b))



# [12.0.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.9.0...@ovh-ux/manager-dedicated@12.0.0) (2020-04-01)


### Bug Fixes

* **i18n:** add missing translations [CDS 314] ([6cb1de2](https://github.com/ovh/manager/commit/6cb1de2873cb762174dd19f86cfd7ed8fff2b654))
* **i18n:** add missing translations [CDS 322] ([7ee8c8b](https://github.com/ovh/manager/commit/7ee8c8b64e5fea8e42d9a34f10eb806acf6b1286))
* **loading:** hide elements during loading ([#2683](https://github.com/ovh/manager/issues/2683)) ([e3aa29e](https://github.com/ovh/manager/commit/e3aa29e5d92aa86849abb2854571c4564b335393))
* **translations:** clean translations files ([#2668](https://github.com/ovh/manager/issues/2668)) ([43c0f80](https://github.com/ovh/manager/commit/43c0f80be6031e176d9c802d991ce7b1eda29f21))


### Code Refactoring

* **hub:** move user panel to @ovh-ux/manager-account-sidebar ([19731b0](https://github.com/ovh/manager/commit/19731b059cc882a40d395c2ca4b3fbd0d19dbdf5))


### Features

* **dedicated:** add application bootstrap ([9fe6c63](https://github.com/ovh/manager/commit/9fe6c63fed6d252a090563c3b075825ce32abb23))
* **dedicated:** add manager language in useraccount ([9304fe6](https://github.com/ovh/manager/commit/9304fe6016619f33cf28ef95ffb840b756eaa2a4))
* **notifications:** update menu ([ee1e419](https://github.com/ovh/manager/commit/ee1e419cec3797dd0c6e5ac087bf3b2c159bc0ee)), closes [#MANAGER-4292](https://github.com/ovh/manager/issues/MANAGER-4292)


### BREAKING CHANGES

* **hub:** init @ovh-ux/manager-account-sidebar module



# [11.9.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.8.0...@ovh-ux/manager-dedicated@11.9.0) (2020-03-25)


### Bug Fixes

* **billing:** update sepa procedure message ([#2630](https://github.com/ovh/manager/issues/2630)) ([1f0f1e2](https://github.com/ovh/manager/commit/1f0f1e2baece0b38cc8e0c1a80fb44af828c6d93))


### Features

* **billing.orders:** enable order tracking is us ([#2548](https://github.com/ovh/manager/issues/2548)) ([04ca14e](https://github.com/ovh/manager/commit/04ca14e5f5920614758f742317555d03fd273503))



# [11.8.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.7.6...@ovh-ux/manager-dedicated@11.8.0) (2020-03-24)


### Features

* **livechat:** update chatbot integration ([8684441](https://github.com/ovh/manager/commit/868444101f5db496e19dacdda622eafeff2f2a6a))



## [11.7.6](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.7.5...@ovh-ux/manager-dedicated@11.7.6) (2020-03-24)


### Bug Fixes

* **billing:** correct credit order message ([#2576](https://github.com/ovh/manager/issues/2576)) ([01d2fca](https://github.com/ovh/manager/commit/01d2fca400e147708b86bc9b7a74f80ad12a1391))



## [11.7.5](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.7.4...@ovh-ux/manager-dedicated@11.7.5) (2020-03-18)


### Bug Fixes

* **deps:** use latest for @ovh-ux/manager-core ([#2394](https://github.com/ovh/manager/issues/2394)) ([df1a12b](https://github.com/ovh/manager/commit/df1a12bc132cebb55f0a70a317e406ee78574faa))
* **i18n:** add missing translations [CDS 304] ([597a3cc](https://github.com/ovh/manager/commit/597a3cc4040ff6aa62df01693efa02a16fa41b8b))
* **i18n:** add missing translations [CDS 305] ([d672369](https://github.com/ovh/manager/commit/d6723692af4b6908c09d92fb8071982f45258143))
* **i18n:** add missing translations [CDS 306] ([cc24d7b](https://github.com/ovh/manager/commit/cc24d7b4bccd25c2b5e2d7d95c6525850a7d0d4f))
* **i18n:** add missing translations [CDS 307] ([f5295a2](https://github.com/ovh/manager/commit/f5295a2c34752721d7cc4c7cb01516f1ac295b2d))
* **i18n:** add missing translations [CDS 308] ([8f8fdfc](https://github.com/ovh/manager/commit/8f8fdfceb1401aa71f43329beb491538b2c8304e))
* **navbar:** remove beta version ([#2473](https://github.com/ovh/manager/issues/2473)) ([7968e3b](https://github.com/ovh/manager/commit/7968e3b99135a2c133df2647d363b414e5a210b1))
* **pcc.datacenter.drp:** use correct route to get drp status ([#2511](https://github.com/ovh/manager/issues/2511)) ([429020c](https://github.com/ovh/manager/commit/429020ca83944a8d10171f466044859794b20ade))



## [11.7.4](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.7.3...@ovh-ux/manager-dedicated@11.7.4) (2020-03-16)


### Bug Fixes

* **billing.history.postalmailoptions:** display the right message ([ebad704](https://github.com/ovh/manager/commit/ebad70427611c0c69d75791f202f5bbd3e452276)), closes [#2444](https://github.com/ovh/manager/issues/2444)



## [11.7.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.7.2...@ovh-ux/manager-dedicated@11.7.3) (2020-03-09)


### Bug Fixes

* **ip:** disable old iplb tab ([#2434](https://github.com/ovh/manager/issues/2434)) ([3048905](https://github.com/ovh/manager/commit/3048905b5d709358b73a8fcdd36c515395af656f))



## [11.7.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.7.1...@ovh-ux/manager-dedicated@11.7.2) (2020-03-09)


### Bug Fixes

* **navbar:** overload max-height notification ([#2431](https://github.com/ovh/manager/issues/2431)) ([ca9e114](https://github.com/ovh/manager/commit/ca9e114906aebe308dfc053377ad1503a79bdb61))



## [11.7.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.7.0...@ovh-ux/manager-dedicated@11.7.1) (2020-03-04)


### Bug Fixes

* **deps:** use latest for @ovh-ux/manager-core ([#2394](https://github.com/ovh/manager/issues/2394)) ([fd0a25b](https://github.com/ovh/manager/commit/fd0a25b11bd5119649daf3b1605bb56bf70f3ff9))



# [11.7.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.6.0...@ovh-ux/manager-dedicated@11.7.0) (2020-03-04)


### Bug Fixes

* **i18n:** add missing translations [CDS 289] ([77faed3](https://github.com/ovh/manager/commit/77faed30cdbe3584ddf5129ef5cd569f1a5ea5bc))
* **translations:** clean translations files ([#2284](https://github.com/ovh/manager/issues/2284)) ([b842838](https://github.com/ovh/manager/commit/b842838fc54abd206c512fc2372a4ce39127ad24))


### Features

* **dedicated.pcc:** create state for PCC dashboard ([3265700](https://github.com/ovh/manager/commit/3265700fb23207b8b3f4ef31f899cff21319dcb7))
* **pcc.datacenter:** update sidebar when changing description ([16d8f5e](https://github.com/ovh/manager/commit/16d8f5e69bf243690187b63834a9aa83a9d36f78))
* **sidebar:** allow updating by other criterias than mere productId ([dabf76f](https://github.com/ovh/manager/commit/dabf76fea1ad084def6a829fbdfd3c7f397ad575))



# [11.6.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.5.3...@ovh-ux/manager-dedicated@11.6.0) (2020-03-03)


### Bug Fixes

* **pcc:** remove legacy call to get automatic payment methods ([a527291](https://github.com/ovh/manager/commit/a52729196c345d4a5e13398393056385b3969667))
* **pcc.datacenter.drp:** remove unsued zssp password regenerate ([825ab37](https://github.com/ovh/manager/commit/825ab3787df66a2b270a6c5a7f63921f8b4fbbbb))
* **pcc.drp:** use correct links to order missing options ([cabb7a3](https://github.com/ovh/manager/commit/cabb7a3b310647d1339e1fd1cccbe55ca01ad6e0))


### Features

* **pcc:** enable zerto for US accounts ([36d2b4c](https://github.com/ovh/manager/commit/36d2b4cbe692be706a619559f607c059fe2a7e6c))



## [11.5.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.5.2...@ovh-ux/manager-dedicated@11.5.3) (2020-02-28)


### Bug Fixes

* **billing.terminate:** encode uri ([#2355](https://github.com/ovh/manager/issues/2355)) ([547ed7c](https://github.com/ovh/manager/commit/547ed7c234ef5e05bfa228571ab6174817445954))



## [11.5.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.5.1...@ovh-ux/manager-dedicated@11.5.2) (2020-02-27)


### Bug Fixes

* **billing.terminate:** encode uri for ip block ([#2347](https://github.com/ovh/manager/issues/2347)) ([06c144d](https://github.com/ovh/manager/commit/06c144dee95d31242e25d4be830b35508fee32e9))



## [11.5.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.5.0...@ovh-ux/manager-dedicated@11.5.1) (2020-02-26)


### Bug Fixes

* **dedicated.server:** force autopay bandwidth in us ([#2334](https://github.com/ovh/manager/issues/2334)) ([216213f](https://github.com/ovh/manager/commit/216213f6c4a4a7412c1ba33042a8886b7818700f))



# [11.5.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.4.3...@ovh-ux/manager-dedicated@11.5.0) (2020-02-19)


### Bug Fixes

* **i18n:** add missing translations [CDS 261] ([aa18579](https://github.com/ovh/manager/commit/aa18579b28f4c6052c66707bf1e12fc1e683e7e5))
* **i18n:** add missing translations [CDS 262] ([9b6f242](https://github.com/ovh/manager/commit/9b6f242faaffcc1423598a5e3dc9ed7458908b37))
* **i18n:** add missing translations [CDS 263] ([97fdd70](https://github.com/ovh/manager/commit/97fdd700eb597bbec065bd6ef8d3598544d7ad71))


### Features

* **billing.autorenew:** add hosting email option terminate redirection ([d26fab1](https://github.com/ovh/manager/commit/d26fab14355152709f320c55246d715501c66882))
* **billing.history:** add date filter to url ([#2231](https://github.com/ovh/manager/issues/2231)) ([7495337](https://github.com/ovh/manager/commit/74953378d3beb0f1d523b2367733ce250b70266f))
* **dedicated.server.interfaces:** add guides url for all subs ([#2251](https://github.com/ovh/manager/issues/2251)) ([bde1b13](https://github.com/ovh/manager/commit/bde1b132edd71e4762f4a6205a132776d3d33f5b))



## [11.4.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.4.2...@ovh-ux/manager-dedicated@11.4.3) (2020-02-13)


### Bug Fixes

* **account.user.support.level:** enable worldwide ([3772c8e](https://github.com/ovh/manager/commit/3772c8e5fc09277d5ebee649f5c784577ad18227))
* **i18n:** add missing translations ([3613358](https://github.com/ovh/manager/commit/361335880bbdaa1b39c027faa6a2987f135feeb0))



## [11.4.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.4.1...@ovh-ux/manager-dedicated@11.4.2) (2020-02-12)


### Bug Fixes

* **i18n:** add missing translations ([8e73275](https://github.com/ovh/manager/commit/8e732758ca4c82c9907282f30dae14a00fcb60ff))



## [11.4.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.4.0...@ovh-ux/manager-dedicated@11.4.1) (2020-02-11)


### Bug Fixes

* **config:** change url for rescue guide ([7087086](https://github.com/ovh/manager/commit/708708675d78f4ccd758a8551e3728cc0a00625b))



# [11.4.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.3.11...@ovh-ux/manager-dedicated@11.4.0) (2020-02-10)


### Bug Fixes

* **billing.payment.method.add:** new contact model in US ([#2217](https://github.com/ovh/manager/issues/2217)) ([feb7f2a](https://github.com/ovh/manager/commit/feb7f2aa9a0bb31dc65b903166e6c43896922449))
* **dedicatedcloud.datacenter.drp:** fix use of preference key ([9ac7cf2](https://github.com/ovh/manager/commit/9ac7cf233d215e01fa5fcbc7b0e98abc67c29667))
* **i18n:** add missing translations [CDS 253] ([af278ae](https://github.com/ovh/manager/commit/af278ae2fc02e3654a81528983d099fa50d89539))
* **i18n:** add missing translations [CDS 254] ([09285b9](https://github.com/ovh/manager/commit/09285b9fd8e61b1d1b5b3ff55b942b477e5339f9))
* **i18n:** add missing translations [CDS 255] ([2285fc1](https://github.com/ovh/manager/commit/2285fc134246478a0bf7ea7f1f79fd81efb93eb1))
* **i18n:** add missing translations [CDS 256] ([7fbf40a](https://github.com/ovh/manager/commit/7fbf40aa0a2516faa874365d64d9376bf86fe04c))
* **i18n:** add missing translations [CDS 257] ([6befb57](https://github.com/ovh/manager/commit/6befb57598963000fb94fec86b8f32d9eb66eeff))
* **server.interfaces:** set right vrack guide ([#2168](https://github.com/ovh/manager/issues/2168)) ([4735503](https://github.com/ovh/manager/commit/47355033fdb8121292faad301881baffa99ee1ec))


### Features

* **billing.orders:** add tracking link on order status ([#2209](https://github.com/ovh/manager/issues/2209)) ([f925103](https://github.com/ovh/manager/commit/f92510321e932d17d28002014b39e9cfe77bd796))



## [11.3.11](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.3.10...@ovh-ux/manager-dedicated@11.3.11) (2020-02-10)


### Bug Fixes

* **i18n:** correct wrong translation ([91b0e39](https://github.com/ovh/manager/commit/91b0e39bd579d048ba11e69f9a013ebc61904817))



## [11.3.10](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.3.9...@ovh-ux/manager-dedicated@11.3.10) (2020-02-03)


### Bug Fixes

* **dedicated.server:** add us missing translation ([c63dc95](https://github.com/ovh/manager/commit/c63dc95467d89363109df9675f775b7389e6c57e))



## [11.3.9](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.3.8...@ovh-ux/manager-dedicated@11.3.9) (2020-01-31)


### Bug Fixes

* **i18n:** add missing translations [CDS 240] ([e872cf2](https://github.com/ovh/manager/commit/e872cf2afe638dff86dbed7af3d8715637cf02b7))
* **i18n:** add missing translations [CDS 245] ([84b48d3](https://github.com/ovh/manager/commit/84b48d3dc92e11806ff73de4902fdaf5e5b4cdf8))
* **i18n:** add missing translations [CDS 246] ([7f8d0cf](https://github.com/ovh/manager/commit/7f8d0cfc9fbe4438a06a5da23685ab5a551baeda))
* **licence:** display readable cpanel options ([#2059](https://github.com/ovh/manager/issues/2059)) ([9e3bae2](https://github.com/ovh/manager/commit/9e3bae2e698e2315afa583f456fa872684d7068c)), closes [#2036](https://github.com/ovh/manager/issues/2036)



## [11.3.8](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.3.7...@ovh-ux/manager-dedicated@11.3.8) (2020-01-27)


### Bug Fixes

* **server.interface:** set right planCode for ola ([98e4120](https://github.com/ovh/manager/commit/98e412074cc9436694b2307e39a8a8f4144f8cad))
* **server.interface.ola-activation:** set right planCode ([f7ed41e](https://github.com/ovh/manager/commit/f7ed41e05d5f695bc5127a294c437f11af5de31d))



## [11.3.7](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.3.6...@ovh-ux/manager-dedicated@11.3.7) (2020-01-27)


### Bug Fixes

* **dedicated:** update dedicated server order link for us ([#2143](https://github.com/ovh/manager/issues/2143)) ([2b1c6cc](https://github.com/ovh/manager/commit/2b1c6ccb0526aeb427aec9b068e1f989111b54b5))
* **server:** unlock ola across all regions ([18ce659](https://github.com/ovh/manager/commit/18ce6597c22dfaef42aaa30a2d15ec4f3dbe15d4))



## [11.3.6](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.3.5...@ovh-ux/manager-dedicated@11.3.6) (2020-01-24)


### Bug Fixes

* **i18n:** add missing translations [CDS 240] ([e4b2814](https://github.com/ovh/manager/commit/e4b281488457da54f57ad5f3ad8d6a27b88e8750))



## [11.3.5](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.3.4...@ovh-ux/manager-dedicated@11.3.5) (2020-01-21)


### Bug Fixes

* **account.user:** add email change validation token request action ([#2016](https://github.com/ovh/manager/issues/2016)) ([9e2bb2e](https://github.com/ovh/manager/commit/9e2bb2eeabbb4da30a8dc0b45153ffc6b1d151d8))
* **i18n:** add missing translations [CDS 220] ([e5b9be8](https://github.com/ovh/manager/commit/e5b9be83f6b70484b15a958ab5bc0d00a6139574))
* **i18n:** add missing translations [CDS 224] ([3e2d0b3](https://github.com/ovh/manager/commit/3e2d0b3c90e9f606a0d40b1d4c0bf488a7a12868))
* **i18n:** add missing translations [CDS 225] ([bf3e4be](https://github.com/ovh/manager/commit/bf3e4bed41d28acd4ac33fc5be2487efcb3c60e4))
* **i18n:** add missing translations [CDS 228] ([6453173](https://github.com/ovh/manager/commit/64531732bead074ea0af10f6ad30e90347aa5188))
* **i18n:** add missing translations [CDS 231] ([97ff113](https://github.com/ovh/manager/commit/97ff113b7a8aa24aff872db89aee7d825152f390))
* **i18n:** add missing translations [CDS 234] ([14021eb](https://github.com/ovh/manager/commit/14021eb5273b4a6fb308b3f46a4eb72ddd5e2cf9))
* **i18n:** add missing translations [CDS 236] ([03945a1](https://github.com/ovh/manager/commit/03945a108d52bb16313d2e000ec40a130df887e2))
* **i18n:** add missing translations [CDS 237] ([67efde3](https://github.com/ovh/manager/commit/67efde34de434103585029f432c175db921d3772))
* **server.interfaces:** update guide url ([#2084](https://github.com/ovh/manager/issues/2084)) ([a48cf0a](https://github.com/ovh/manager/commit/a48cf0aa6ecc9edb62c1a442df04348ad04ac49b))



## [11.3.4](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.3.3...@ovh-ux/manager-dedicated@11.3.4) (2020-01-16)


### Bug Fixes

* **i18n:** add missing translations [CDS 231] ([bf08804](https://github.com/ovh/manager/commit/bf088048b5c0450eda8a5d60f25d60853a160e2d))



## [11.3.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.3.2...@ovh-ux/manager-dedicated@11.3.3) (2020-01-10)


### Bug Fixes

* **dedicated.billing:** add checks for automatic renew ([#2027](https://github.com/ovh/manager/issues/2027)) ([ea5f828](https://github.com/ovh/manager/commit/ea5f82897e25d37d69586bd328849c83f64807d8))



## [11.3.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.3.1...@ovh-ux/manager-dedicated@11.3.2) (2020-01-08)


### Bug Fixes

* **dedicated:** set right favicon path ([#2018](https://github.com/ovh/manager/issues/2018)) ([b910316](https://github.com/ovh/manager/commit/b910316232027dd6b81f0c3f9231344f86f3b14b)), closes [#1686](https://github.com/ovh/manager/issues/1686)
* **dedicated:** use new github link ([#2026](https://github.com/ovh/manager/issues/2026)) ([9be61d5](https://github.com/ovh/manager/commit/9be61d52df72029df821e299ab5387ea8db8db15))
* **i18n:** add missing translations [CDS 199] ([24691eb](https://github.com/ovh/manager/commit/24691eb7a3ef41321610c4e724c540aabd91d3db))
* **i18n:** add missing translations [CDS 200] ([203d3f0](https://github.com/ovh/manager/commit/203d3f0294981f9e3dcc79d9734d9dda38f168d6))
* **i18n:** add missing translations [CDS 206] ([ccc5e5c](https://github.com/ovh/manager/commit/ccc5e5c80c99443c90d6c6f703de6c4289c783f8))
* **i18n:** add missing translations [CDS 212] ([1f85592](https://github.com/ovh/manager/commit/1f8559205e170279929e29e4e52d8e255d688b3d))
* **ip:** refresh correctly ip if not ip block ([#2041](https://github.com/ovh/manager/issues/2041)) ([466eeeb](https://github.com/ovh/manager/commit/466eeeb935a11b0b4b5188f3e9b272ebe35f0f2d))



## [11.3.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.3.0...@ovh-ux/manager-dedicated@11.3.1) (2019-12-19)


### Bug Fixes

* **i18n:** add missing translations [CDS 198] ([1aefea2](https://github.com/ovh/manager/commit/1aefea2e3baf06b45e8187f1e6728d415d880314))



# [11.3.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.2.2...@ovh-ux/manager-dedicated@11.3.0) (2019-12-19)


### Bug Fixes

* **account.user.security.totp.delete:** add missing warning message ([#1954](https://github.com/ovh/manager/issues/1954)) ([dbffffa](https://github.com/ovh/manager/commit/dbffffab5379c1d209f573c69aa938c407e4c72d)), closes [#1953](https://github.com/ovh/manager/issues/1953)
* **dedicated.account.user:** remove shortcuts for some region ([34c4e64](https://github.com/ovh/manager/commit/34c4e647d1c968a6a866a3293b6a404df5593699))
* **i18n:** add missing translations [CDS 182] ([de0bbaa](https://github.com/ovh/manager/commit/de0bbaaf4957ef0c73d1c8a8488c04d85dceab51))
* **i18n:** add missing translations [CDS 184] ([6ec37b2](https://github.com/ovh/manager/commit/6ec37b2226218cecb94307abb01d88ffda824326))
* **i18n:** add missing translations [CDS 187] ([707ec72](https://github.com/ovh/manager/commit/707ec724fe6852a0c5fa855bfb6911fef977df61))
* **i18n:** add missing translations [CDS 193] ([9f4801a](https://github.com/ovh/manager/commit/9f4801a3ad577f6e3c9df4d400072237a4589a04))
* **i18n:** add missing translations [CDS 195] ([7b63630](https://github.com/ovh/manager/commit/7b63630b213b9da1947fa6ccc36a290efa294a67))
* **i18n:** add missing translations [CDS 196] ([acbb2da](https://github.com/ovh/manager/commit/acbb2da34b2d1c2863fd7c2f6cd187b67e065324))
* rename OVH to OVHcloud in preloading and title ([35fc442](https://github.com/ovh/manager/commit/35fc4420850390e2ad80f322f6d23c87fb6a713a))


### Features

* **dedicated.billing:** prevent VIP renew ([#1943](https://github.com/ovh/manager/issues/1943)) ([9a5755c](https://github.com/ovh/manager/commit/9a5755ce2bdb45cd76484df41afced92e42808ed))
* display standard and premium support levels for FR customers ([569b19e](https://github.com/ovh/manager/commit/569b19e231123f820cb537cd4c85f2a079fd9c03))



## [11.2.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.2.1...@ovh-ux/manager-dedicated@11.2.2) (2019-12-11)


### Bug Fixes

* **dedicated:** add back order retractation screen ([c0bb703](https://github.com/ovh/manager/commit/c0bb7037c3d9bbbcce018cb3f2e1cabdafdf2d61))



## [11.2.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.2.0...@ovh-ux/manager-dedicated@11.2.1) (2019-12-10)


### Bug Fixes

* **dedicated.billing:** get state only when available ([e41fd78](https://github.com/ovh/manager/commit/e41fd780bd7bc1a7bbe09583c35c857a71285313))
* **pcc.drp:** fix check on payment method list ([c142d7a](https://github.com/ovh/manager/commit/c142d7a0e38e1e2189426264b7ae2761c80c4c30))



# [11.2.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.1.1...@ovh-ux/manager-dedicated@11.2.0) (2019-12-10)


### Bug Fixes

* **i18n:** add missing translations [CDS 164] ([c424360](https://github.com/ovh/manager/commit/c424360b395751806346d101af4d160f7a80d673))
* **i18n:** add missing translations [CDS 167] ([c1d3c91](https://github.com/ovh/manager/commit/c1d3c91004d6d5170573efa1071764bc0392b512))
* **i18n:** add missing translations [CDS 168] ([29cb4ff](https://github.com/ovh/manager/commit/29cb4ffd1c75ae079b20efc2ab8ed23b625bce43))
* **i18n:** add missing translations [CDS 168] ([a4de58a](https://github.com/ovh/manager/commit/a4de58af1be0ffce69120c6815a861e9fbd0b0d4))
* **i18n:** add missing translations [CDS 171] ([e4a934b](https://github.com/ovh/manager/commit/e4a934b8cfc406e8b25c6175ca21798105f48fc5))
* **i18n:** add missing translations [CDS 172] ([d36cbc4](https://github.com/ovh/manager/commit/d36cbc424c66dff63777cf95c3bc0025b8c242af))
* **i18n:** add missing translations [CDS 174] ([afafd5e](https://github.com/ovh/manager/commit/afafd5e45f6fface9195694730dc131fcf222832))
* **i18n:** add missing translations [CDS 179] ([1de83d7](https://github.com/ovh/manager/commit/1de83d7246ac5b1ec4ada6f301e5070aeb8ce9e5))
* **i18n:** add missing translations [CDS 180] ([b828ef6](https://github.com/ovh/manager/commit/b828ef6b54d71970e6517c8b260d35d6e97b8683))


### Features

* **dedicated:** add IPLB ([5d6a470](https://github.com/ovh/manager/commit/5d6a47010cc58d4298d0fff4205000fa66cb0d05))
* **dedicated:** replace uib-tooltip with oui tooltip ([eb0eb58](https://github.com/ovh/manager/commit/eb0eb58bad9517e22aaf4f66e3b49d0422e6920f))
* **dedicated.billing.autorenew:** add sorting on all columns ([2eb8f0d](https://github.com/ovh/manager/commit/2eb8f0d37b55683ff822e6df4b5d58f670a917e9)), closes [#1501](https://github.com/ovh/manager/issues/1501)
* **iplb:** migrate IPLB ([b78786e](https://github.com/ovh/manager/commit/b78786ee6d70519ca06075697d798b649754d52e))
* **pcc:** add zerto on premise configuration plan feature ([f0cdba9](https://github.com/ovh/manager/commit/f0cdba9f2d983b62652daefc1ae897dcb38ea001))
* **pcc:** extract new translations ([#1847](https://github.com/ovh/manager/issues/1847)) ([7da2de4](https://github.com/ovh/manager/commit/7da2de4ffdfc67606a8e4bd1c7f166c638872472))
* **pcc.drp:** set ovhcloud images ([14ce560](https://github.com/ovh/manager/commit/14ce560b731c160701d9e99f824507242f54653f))



## [11.1.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.1.0...@ovh-ux/manager-dedicated@11.1.1) (2019-12-02)


### Bug Fixes

* **i18n:** add missing translations [CDS 168] ([29cb4ff](https://github.com/ovh/manager/commit/29cb4ffd1c75ae079b20efc2ab8ed23b625bce43))



# [11.1.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.0.1...@ovh-ux/manager-dedicated@11.1.0) (2019-11-28)


### Features

* **dedictated.account.user.advanced:** add beta flag ([c644a97](https://github.com/ovh/manager/commit/c644a97dec6efd5a742abaad1bf764e905b08c27))



## [11.0.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@11.0.0...@ovh-ux/manager-dedicated@11.0.1) (2019-11-27)


### Bug Fixes

* **i18n:** add missing translations [CDS 162] ([1ea9611](https://github.com/ovh/manager/commit/1ea96117169d152a5e999357de0d8d72c6d9dbb0))



# [11.0.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@10.28.3...@ovh-ux/manager-dedicated@11.0.0) (2019-11-27)


### Bug Fixes

* **dedicated.account.contacts:** display error detail ([#1795](https://github.com/ovh/manager/issues/1795)) ([3556a1a](https://github.com/ovh/manager/commit/3556a1a1f2c8377770a7c3657a93ef676d46d537))
* **dedicated.billing:** check engagement date is a past date ([039eef0](https://github.com/ovh/manager/commit/039eef0ba45c7033b79c123b40984d35fdbe40c7))
* **dedicated.server:** add message for bandwith upgrade/downgrade ([#1632](https://github.com/ovh/manager/issues/1632)) ([a60cdfe](https://github.com/ovh/manager/commit/a60cdfef1e382e929513663a144499972299abe5))
* **dedicated.server:** disable ipmi when not available ([#1758](https://github.com/ovh/manager/issues/1758)) ([ae66044](https://github.com/ovh/manager/commit/ae660447922d8580538a0eea532cb408fb11c3ad))
* **i18n:** add missing translations [CDS 148] ([156e571](https://github.com/ovh/manager/commit/156e571e04d9730cfe642c1cf6a84a9c5823712a))
* **i18n:** add missing translations [CDS 150] ([446c03f](https://github.com/ovh/manager/commit/446c03ff321e4ce9830e024cb225a7ad8223fdd4))
* **i18n:** add missing translations [CDS 151] ([736c90f](https://github.com/ovh/manager/commit/736c90f0537e65a3706c3348d630763024a6f774))
* **i18n:** add missing translations [CDS 152] ([b780fd4](https://github.com/ovh/manager/commit/b780fd4c9ba8983c2f98e967752cda4e09345259))
* **i18n:** add missing translations [CDS 154] ([78f5505](https://github.com/ovh/manager/commit/78f55058ce497fff456ba3a8e63991b340584de7))
* **i18n:** add missing translations [CDS 159] ([6bf8e3f](https://github.com/ovh/manager/commit/6bf8e3fd6bf29143eac0a4114c9471032d50a519))
* **i18n:** add missing translations [CDS 161] ([7a6e245](https://github.com/ovh/manager/commit/7a6e245904f0263d603712bb444043bab1aad808))


### Features

* **dedicated:** add nasha module to dedicated ([68251e8](https://github.com/ovh/manager/commit/68251e8c17cc9cf78857e300fcf1a8bbe84a9553))
* **dedicated:** add vrack ([d0d531f](https://github.com/ovh/manager/commit/d0d531f9bbb3a2d334bea242c3844c64745b2857))
* **dedicated.account.user:** extract support level translations ([#1829](https://github.com/ovh/manager/issues/1829)) ([895f625](https://github.com/ovh/manager/commit/895f62525a28a4eff058e2085d99cf1055adf692))
* **dedicated.account.user.advanced:** enable developer mode fo… ([#1787](https://github.com/ovh/manager/issues/1787)) ([4219467](https://github.com/ovh/manager/commit/42194678b8b91b30cd6331ce4d31540df58b3c91))
* **dedicatedcloud.dashboard.tiles.options:** extract translations ([#1783](https://github.com/ovh/manager/issues/1783)) ([fd9eec5](https://github.com/ovh/manager/commit/fd9eec53f7d68edaebff316622598851f8c8d6ff))
* **veeam:** add veeam app & module ([4fd53ef](https://github.com/ovh/manager/commit/4fd53efd2cf11f255e92f6fa45cb3ffe910ca244))


### BREAKING CHANGES

* **veeam:** init @ovh-ux/manager-veeam-cloud-connect application.



## [10.28.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@10.28.2...@ovh-ux/manager-dedicated@10.28.3) (2019-11-22)


### Bug Fixes

* **deps:** upgrade ovh-api-services to v9.27.1 ([fb116c4](https://github.com/ovh/manager/commit/fb116c4a0e9085c71e8fe1266b818f3464e5bc94))



## [10.28.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@10.28.1...@ovh-ux/manager-dedicated@10.28.2) (2019-11-20)


### Bug Fixes

* **orders:** avoid blank screen when url of guides is undefined ([9e9ac1e](https://github.com/ovh/manager/commit/9e9ac1e5964feeb0f60f37678c05836c8f3e27ce))



## [10.28.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@10.28.0...@ovh-ux/manager-dedicated@10.28.1) (2019-11-15)


### Bug Fixes

* **deps:** upgrade ovh-api-services to v9.26.0 ([#1789](https://github.com/ovh/manager/issues/1789)) ([90361dc](https://github.com/ovh/manager/commit/90361dc945014853db1cf4535e2d5b89b67efbea))



# [10.28.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@10.27.8...@ovh-ux/manager-dedicated@10.28.0) (2019-11-13)


### Bug Fixes

* **i18n:** add missing translations [CDS 123] ([3b7c5a5](https://github.com/ovh/manager/commit/3b7c5a5529a3e3c911e56ec29359e914d800ba91))
* **i18n:** add missing translations [CDS 124] ([6d062cc](https://github.com/ovh/manager/commit/6d062cc3f6c817b81546171abfeb553975dde4f3))
* **i18n:** add missing translations [CDS 128] ([799c85b](https://github.com/ovh/manager/commit/799c85b600b736436e6f5d111b0ed65f8998e8d5))
* **i18n:** add missing translations [CDS 129] ([5acca41](https://github.com/ovh/manager/commit/5acca41531fa79aea373d4b0b5b748b0c44fd1ea))
* **i18n:** add missing translations [CDS 132] ([22f185e](https://github.com/ovh/manager/commit/22f185e5600324700f3f68a23487cf6ef8d52a6c))
* **i18n:** add missing translations [CDS 133] ([b11c121](https://github.com/ovh/manager/commit/b11c121ea47fad196add967e4f8509d7f9f9a032))
* **i18n:** add missing translations [CDS 134] ([3828d7a](https://github.com/ovh/manager/commit/3828d7a0f00da9b7c2d3bce3758662a1162d8a4a))
* **i18n:** add missing translations [CDS 138] ([6805f93](https://github.com/ovh/manager/commit/6805f93f3167da49076e5b6401af446200ad81d4))
* **i18n:** add missing translations [CDS 139] ([259f422](https://github.com/ovh/manager/commit/259f422ebbbc2cf0d1aa8ed5d0a44f7b317e9971))
* **i18n:** add missing translations [CDS 142] ([61290ea](https://github.com/ovh/manager/commit/61290ea9d2487fb540c63862662adcaea4e2d373))
* **i18n:** add missing translations [CDS 143] ([74efd95](https://github.com/ovh/manager/commit/74efd9532bf7c7b7a1dc77903f973fe976a16033))
* **server.ovh-tasks:** set right status tasks link ([#1647](https://github.com/ovh/manager/issues/1647)) ([31ed2d7](https://github.com/ovh/manager/commit/31ed2d7203619e38af5d8ea2ab4720e4b44ecfb6))


### Features

* add missing favicon ([4f13b17](https://github.com/ovh/manager/commit/4f13b17192a3b22560e3c822fa34e2266b130967))
* orders refactoring ([#1640](https://github.com/ovh/manager/issues/1640)) ([e4c67fc](https://github.com/ovh/manager/commit/e4c67fcae4664e6c0f0a5f3d96b470519ea1d90a))
* update microsoft icons ([#1725](https://github.com/ovh/manager/issues/1725)) ([99f02d7](https://github.com/ovh/manager/commit/99f02d7a6940adc5d5642a40aefcd7f489f9a7ac))
* **dedicated:** add veeam enterprise ([1e66a4e](https://github.com/ovh/manager/commit/1e66a4e3beddcfed23c086a7e02a95e4d84b4d18))
* **dedicated:** add vps module ([692dbce](https://github.com/ovh/manager/commit/692dbcedc1a15b033093411e7d3672321e78ad0b))
* **dedicated.billing.autorenew:** add Actions column ([#1652](https://github.com/ovh/manager/issues/1652)) ([d0346c3](https://github.com/ovh/manager/commit/d0346c3dc9b35e9e7232815ed19b04f57665858e))
* **dedicated.server:** add ola guides ([#1719](https://github.com/ovh/manager/issues/1719)) ([4d7d236](https://github.com/ovh/manager/commit/4d7d236f3e048f38547b89b8a9c7b0f339641454))



## [10.27.8](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@10.27.7...@ovh-ux/manager-dedicated@10.27.8) (2019-11-06)


### Bug Fixes

* **server.dns.add:** add validation ([#1723](https://github.com/ovh/manager/issues/1723)) ([7ba131e](https://github.com/ovh/manager/commit/7ba131ed625af029928f5025be0a045983cfefd5))



## [10.27.7](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@10.27.6...@ovh-ux/manager-dedicated@10.27.7) (2019-11-06)


### Bug Fixes

* **billing.payment.method:** enable default action ([#1709](https://github.com/ovh/manager/issues/1709)) ([692065c](https://github.com/ovh/manager/commit/692065c8b62626491898bee743dffa344bd945f8))



## [10.27.6](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@10.27.5...@ovh-ux/manager-dedicated@10.27.6) (2019-11-06)


### Bug Fixes

* import exchange module for exchange account renew ([3d387b6](https://github.com/ovh/manager/commit/3d387b6420107a2664d8e009e8fbeea14fec07c1))
* **autorenew:** use standard renew for Exchange services when required ([b3021a7](https://github.com/ovh/manager/commit/b3021a7fb6e30de8fa82aa905d4e9e5f58b204e9))



## [10.27.5](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@10.27.4...@ovh-ux/manager-dedicated@10.27.5) (2019-11-05)


### Bug Fixes

* **license.order:** allow to order license if there is no contr… ([#1651](https://github.com/ovh/manager/issues/1651)) ([7f68895](https://github.com/ovh/manager/commit/7f68895995916b757c4c135d3bb387bafbe67fa4))



## [10.27.4](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@10.27.3...@ovh-ux/manager-dedicated@10.27.4) (2019-11-04)


### Bug Fixes

* **sidebar.menu.account:** add missing menu support translation ([#1692](https://github.com/ovh/manager/issues/1692)) ([6050f83](https://github.com/ovh/manager/commit/6050f8367244a6e18c4b638ffe9d7fa803e52c54))



## [10.27.3](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@10.27.2...@ovh-ux/manager-dedicated@10.27.3) (2019-11-04)


### Bug Fixes

* **billing.payment.retrieve:** bad bank account filter ([eee1b2d](https://github.com/ovh/manager/commit/eee1b2d6b5f7575a52b0dfd6b9bd29042db48369))



## [10.27.2](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@10.27.1...@ovh-ux/manager-dedicated@10.27.2) (2019-10-30)


### Bug Fixes

* add wizard-keydown-disabled on installation modal ([73f49c0](https://github.com/ovh/manager/commit/73f49c0c0829bc813769b7a0b03a221bafe883a6))
* add wizard-keydown-disabled on installation modal ([762debc](https://github.com/ovh/manager/commit/762debc3711b1c15d18490c93b451512224f5d3b))



## [10.27.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@10.27.0...@ovh-ux/manager-dedicated@10.27.1) (2019-10-29)


### Bug Fixes

* **dedicated.account.contact:** inject existing language list ([#1636](https://github.com/ovh/manager/issues/1636)) ([1b193c9](https://github.com/ovh/manager/commit/1b193c9a59ab032083f7722a371325a37ce87bc3))



# [10.27.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@10.26.1...@ovh-ux/manager-dedicated@10.27.0) (2019-10-28)


### Features

* **dedicated:** replace OTRS by Support ([18b4be5](https://github.com/ovh/manager/commit/18b4be5f2041c108da554ad31f5699b486f6ef1a))



## [10.26.1](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@10.26.0...@ovh-ux/manager-dedicated@10.26.1) (2019-10-28)


### Bug Fixes

* **billing.main.history:** fetch postal mail invoices only in EU build ([#1603](https://github.com/ovh/manager/issues/1603)) ([396b8e5](https://github.com/ovh/manager/commit/396b8e5fa509908348e47ef244e1a0c4588c05fa))



# [10.26.0](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@10.25.7...@ovh-ux/manager-dedicated@10.26.0) (2019-10-28)


### Bug Fixes

* **dedicated:** add exchange icons ([#1550](https://github.com/ovh/manager/issues/1550)) ([68e424d](https://github.com/ovh/manager/commit/68e424d8bf1ce256f60cf56bf7dc18d1ea8b502d))
* **dedicated:** fix ck.editor injection ([487c716](https://github.com/ovh/manager/commit/487c716f49c7a585161d48a6fb933e25defe79a8))
* **dedicated:** fix dedicated rtm chart display ([#1544](https://github.com/ovh/manager/issues/1544)) ([8526e64](https://github.com/ovh/manager/commit/8526e64179209614ea9486ac48bb213818db6d85))
* **dedicated:** load exchange module on CA region ([#1554](https://github.com/ovh/manager/issues/1554)) ([3f15faa](https://github.com/ovh/manager/commit/3f15faaea1e5b488e21214bda94b41b4e7a5b3fa))
* **dedicated:** replace account calendar ([2235173](https://github.com/ovh/manager/commit/223517364feadf224f8b75e02257efe6a75adc4b))
* **dedicated.account.contacts:** fix lodash imports ([#1541](https://github.com/ovh/manager/issues/1541)) ([9d038e1](https://github.com/ovh/manager/commit/9d038e152af723d1eee17f375add4162fd266956))
* **i18n:** add missing translations [CDS 113] ([f6db44f](https://github.com/ovh/manager/commit/f6db44faf967c25ce71d85bed84a7d35b42845fa))
* polling works now correctly ([2923786](https://github.com/ovh/manager/commit/29237862be56b0467fa676bcd22525af1dd87550))
* popover is now currently displayed ([#1549](https://github.com/ovh/manager/issues/1549)) ([c82634c](https://github.com/ovh/manager/commit/c82634cfa34436df1e1c1a1012bd3cb461400aea))
* **i18n:** add missing translations [CDS 116] ([388486f](https://github.com/ovh/manager/commit/388486fe3c54b991e9f55f46fb2e071a487e7b10))
* **i18n:** add missing translations [CDS 118] ([31c432b](https://github.com/ovh/manager/commit/31c432b5c1d0a12f57b8b52b8c37fb8c32f220e9))


### Features

* version number ([#1525](https://github.com/ovh/manager/issues/1525)) ([6ba9b98](https://github.com/ovh/manager/commit/6ba9b980f775a9d79027ce8455b907c9e145f3dc))
* **dedicated:** add error page ([79c22bc](https://github.com/ovh/manager/commit/79c22bcbb6414bf7f0215c813453b5e748bb17a8))



## [10.25.7](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@10.25.6...@ovh-ux/manager-dedicated@10.25.7) (2019-10-25)


### Bug Fixes

* bump ovh-ui-angular to v3.9.9 ([#1593](https://github.com/ovh/manager/issues/1593)) ([2ff2f81](https://github.com/ovh/manager/commit/2ff2f813f43453744c5927efc5687a7bb79674e1))



## [10.25.6](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@10.25.5...@ovh-ux/manager-dedicated@10.25.6) (2019-10-24)


### Bug Fixes

* **pci.projects.new:** fix project creation ([c885270](https://github.com/ovh/manager/commit/c88527041c8ff4ba4d9cd86172055c0378053047))



## [10.25.5](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@10.25.4...@ovh-ux/manager-dedicated@10.25.5) (2019-10-23)


### Bug Fixes

* downgrade punycode (2.x drops browser support) ([5bb334e](https://github.com/ovh/manager/commit/5bb334e798d0538e85fa9539e4f5805cd83118ac))



## [10.25.4](https://github.com/ovh/manager/compare/@ovh-ux/manager-dedicated@10.25.3...@ovh-ux/manager-dedicated@10.25.4) (2019-10-23)


### Bug Fixes

* **dedicated:** add bootstrap4 grid and update rem ([ed29ab7](https://github.com/ovh/manager/commit/ed29ab78db4d8bf8e34d593b89c526b4177126ec))
* **dedicated:** override width for large modals ([#1494](https://github.com/ovh/manager/issues/1494)) ([b15cb8d](https://github.com/ovh/manager/commit/b15cb8d369ad6963be471121dc5ff4d1b080a2c5))
* **dedicated:** remove max-width for oui-message ([#1498](https://github.com/ovh/manager/issues/1498)) ([ff34a6a](https://github.com/ovh/manager/commit/ff34a6a58dff0bfb47e22b5c22ecaaa7eddeba4f))
* **dedicated:** sort styles import ([60372d6](https://github.com/ovh/manager/commit/60372d6902d5a9b7d358a30e84cd2022c6edfd1f))
* **dedicated:** update spacing ([#1520](https://github.com/ovh/manager/issues/1520)) ([8df5d9b](https://github.com/ovh/manager/commit/8df5d9b71b7491aa9121418ea7d3b2a84d596e22))
* **i18n:** add missing translations [CDS 106] ([f9d2338](https://github.com/ovh/manager/commit/f9d2338268991329e2816d48e0da6bd293632590))
* fast polling now works correctly ([#1518](https://github.com/ovh/manager/issues/1518)) ([b209e0c](https://github.com/ovh/manager/commit/b209e0c87a55ad045f4fffbf1cd28e1139239bf5))
* replace legacy autocomplete by oui-autocomplete ([#1503](https://github.com/ovh/manager/issues/1503)) ([bff4cfc](https://github.com/ovh/manager/commit/bff4cfc818d886c61405a6d16429d129533ba283))
* replace lodash imports ([af0b5ce](https://github.com/ovh/manager/commit/af0b5ce021b4cbb799624852c6f8e1d85b5976e4))
* **i18n:** add missing translations [CDS 112] ([7edf8f6](https://github.com/ovh/manager/commit/7edf8f6265aa70fa456d75162bc1f1013455b4b6))



## [10.25.3](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-dedicated@10.25.2...@ovh-ux/manager-dedicated@10.25.3) (2019-10-17)


### Bug Fixes

* **dedicated:** restore display size ([#1472](https://github.com/ovh-ux/manager/issues/1472)) ([e2e8c20](https://github.com/ovh-ux/manager/commit/e2e8c20))
* **dedicated:** update ip range ([#1474](https://github.com/ovh-ux/manager/issues/1474)) ([aef93fb](https://github.com/ovh-ux/manager/commit/aef93fb))
* **i18n:** add missing translations [CDS 105] ([c74a659](https://github.com/ovh-ux/manager/commit/c74a659))



## [10.25.2](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-dedicated@10.25.1...@ovh-ux/manager-dedicated@10.25.2) (2019-10-09)


### Bug Fixes

* **sidebar:** remove useless element ([57cf1f0](https://github.com/ovh-ux/manager/commit/57cf1f0))



## [10.25.1](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-dedicated@10.25.0...@ovh-ux/manager-dedicated@10.25.1) (2019-09-30)


### Bug Fixes

* **dedicated:** fix use of lodash identity pick ([#1363](https://github.com/ovh-ux/manager/issues/1363)) ([e38878a](https://github.com/ovh-ux/manager/commit/e38878a))
* **dedicated:** update less rem ([0c22a13](https://github.com/ovh-ux/manager/commit/0c22a13))



# [10.25.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-dedicated@10.24.1...@ovh-ux/manager-dedicated@10.25.0) (2019-09-03)


### Bug Fixes

* **dedicated:** add eslintignore, fix eslint ([7ae92a0](https://github.com/ovh-ux/manager/commit/7ae92a0))
* **dedicated:** dedicated-server-rendezvous translate ([6673b70](https://github.com/ovh-ux/manager/commit/6673b70))
* **dedicated:** import ui-kit-bs-css & fix timeout bug ([7cd8c79](https://github.com/ovh-ux/manager/commit/7cd8c79))
* **dedicated:** punycode import ([87a2660](https://github.com/ovh-ux/manager/commit/87a2660))
* **dedicated:** remove angular.lowercase ([c06b8f0](https://github.com/ovh-ux/manager/commit/c06b8f0))
* **dedicated:** remove ovh-module-exchange deprecated component ([2c295d3](https://github.com/ovh-ux/manager/commit/2c295d3))


### Features

* **dedicated:** initial import ([77fadc6](https://github.com/ovh-ux/manager/commit/77fadc6))
* **dedicated:** rename client to src ([045d82e](https://github.com/ovh-ux/manager/commit/045d82e))



<a name="10.24.1"></a>
## [10.24.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.24.0...v10.24.1) (2019-08-12)


### Bug Fixes

* **dedicated.server:** prevent api calls ([8c32e8d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8c32e8d))



<a name="10.24.0"></a>
# [10.24.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.23.0...v10.24.0) (2019-08-12)


### Features

* **billing.payment.method.add:** remove billingContactId ([#1285](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1285)) ([68a0149](https://github.com/ovh-ux/ovh-manager-dedicated/commit/68a0149))



<a name="10.23.0"></a>
# [10.23.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.22.2...v10.23.0) (2019-08-12)


### Bug Fixes

* **account.otrs:** change status text translation ([#1286](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1286)) ([5ce9ed9](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5ce9ed9))
* update manager urls ([#1316](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1316)) ([a2750dc](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a2750dc))
* **account.user.ssh:** update url to cloud ssh addition ([ab6a731](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ab6a731))
* **billing.autorenew:** allow autorenew activation for some subs ([#1304](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1304)) ([fc4d082](https://github.com/ovh-ux/ovh-manager-dedicated/commit/fc4d082))
* **error:** prevent loop when user is not authenticated ([#1300](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1300)) ([848cb1a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/848cb1a))
* **i18n:** add missing translations [CDS 10] ([2a93004](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2a93004))
* **i18n:** add missing translations [CDS 6] ([4ae29b4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4ae29b4))
* **i18n:** add missing translations [CDS 7] ([e363272](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e363272))
* **i18n:** add missing translations [CDS 8] ([32c1c30](https://github.com/ovh-ux/ovh-manager-dedicated/commit/32c1c30))
* **i18n:** add missing translations [CDS 9] ([be94b0b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/be94b0b))


### Features

* **app:** update and use error page ([#1279](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1279)) ([62a9b36](https://github.com/ovh-ux/ovh-manager-dedicated/commit/62a9b36))
* **dedicated.server:** add upgrade link with tracking ([#1248](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1248)) ([e07d86e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e07d86e))
* **dedicated.server:** disable firewall and backup section in US ([#1244](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1244)) ([dc539b3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/dc539b3))
* add [@ovh-ux](https://github.com/ovh-ux)/ng-ovh-request-tagger ([#1321](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1321)) ([9ccaabb](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9ccaabb))
* use ng-ui-router-line-progress ([#1270](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1270)) ([8030418](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8030418))



<a name="10.22.2"></a>
## [10.22.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.22.1...v10.22.2) (2019-08-12)


### Bug Fixes

* **sidebar:** use nasha from cloud manager ([#1315](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1315)) ([bccc56f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/bccc56f))



<a name="10.22.1"></a>
## [10.22.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.22.0...v10.22.1) (2019-08-09)


### Bug Fixes

* **deps:** upgrade ng-ovh-otrs to v7.1.10 ([#1318](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1318)) ([0c6de32](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0c6de32))



<a name="10.22.0"></a>
# [10.22.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.21.3...v10.22.0) (2019-08-07)


### Bug Fixes

* **dedicated.server.traffic:** use correct filter name ([#1307](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1307)) ([eeffb32](https://github.com/ovh-ux/ovh-manager-dedicated/commit/eeffb32))


### Features

* **billing.autorenew:** remove HOSTING_DOMAIN grouping ([#1308](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1308)) ([3123f3d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/3123f3d))



<a name="10.21.3"></a>
## [10.21.3](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.21.2...v10.21.3) (2019-08-06)


### Bug Fixes

* **dedicatedcloud.dashboard.options:** disable some actions ([#1303](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1303)) ([22079a5](https://github.com/ovh-ux/ovh-manager-dedicated/commit/22079a5))



<a name="10.21.2"></a>
## [10.21.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.21.1...v10.21.2) (2019-08-06)


### Bug Fixes

* **i18n:** add missing translations [CDS 6] ([fd5415f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/fd5415f))



<a name="10.21.1"></a>
## [10.21.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.21.0...v10.21.1) (2019-08-06)



<a name="10.21.0"></a>
# [10.21.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.20.1...v10.21.0) (2019-08-05)


### Bug Fixes

* **dedicated.universe.components.price:** add asia gst price text ([#1245](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1245)) ([5969d3f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5969d3f))
* **i18n:** add missing translations ([9b40dcd](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9b40dcd))
* **i18n:** add missing translations ([9ec70fc](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9ec70fc))
* **i18n:** add missing translations [CDS 2] ([7ab19ed](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7ab19ed))
* **i18n:** add missing translations [CDS 4] ([6a015c5](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6a015c5))
* **ip.reverse.add:** display error fields when value are invalid ([#1277](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1277)) ([9a17342](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9a17342))


### Features

* **billing.autorenew:** remove HOSTING_DOMAIN grouping ([#1255](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1255)) ([ff95fd6](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ff95fd6))



<a name="10.20.1"></a>
## [10.20.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.20.0...v10.20.1) (2019-07-30)


### Bug Fixes

* **i18n:** add missing translations ([5170fb3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5170fb3))
* **i18n:** add missing translations ([0d5627a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0d5627a))
* **i18n:** add missing translations ([eca38fc](https://github.com/ovh-ux/ovh-manager-dedicated/commit/eca38fc))
* **i18n:** add missing translations ([adc0df8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/adc0df8))
* **ip:** allow only reverse update in ipv6 modal ([#1263](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1263)) ([116e242](https://github.com/ovh-ux/ovh-manager-dedicated/commit/116e242))



<a name="10.20.0"></a>
# [10.20.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.19.9...v10.20.0) (2019-07-25)


### Bug Fixes

* **i18n:** add missing translations ([4386f0f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4386f0f))
* **i18n:** add missing translations ([e824d0f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e824d0f))
* **mrtg-graphic:** fix mrtg graphics ([caa7741](https://github.com/ovh-ux/ovh-manager-dedicated/commit/caa7741))


### Features

* **baremetal-agora:** move baremetal option to full agora ([04be0cc](https://github.com/ovh-ux/ovh-manager-dedicated/commit/04be0cc))
* **baremetal-bandwidth:** add new bandwidth options ([e270ec3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e270ec3))
* **baremetal-bandwidth:** add new bandwidth options ([3502213](https://github.com/ovh-ux/ovh-manager-dedicated/commit/3502213))
* **baremetal-bandwidth:** date error fix ([80471f4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/80471f4))
* **baremetal-bandwidth:** fix api query cache ([c466240](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c466240))
* **baremetal-bandwidth:** restructure controller ([d0fe459](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d0fe459))
* **baremetal-bandwidth:** restructure controller ([30978f4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/30978f4))
* **baremetal-bandwidth:** upgrade ovh api services ([af673ea](https://github.com/ovh-ux/ovh-manager-dedicated/commit/af673ea))



<a name="10.19.9"></a>
## [10.19.9](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.19.8...v10.19.9) (2019-07-25)


### Bug Fixes

* **deps:** upgrade ng-ovh-otrs v7.1.7 ([282d886](https://github.com/ovh-ux/ovh-manager-dedicated/commit/282d886))



<a name="10.19.8"></a>
## [10.19.8](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.19.7...v10.19.8) (2019-07-24)


### Bug Fixes

* **i18n:** add missing translations ([83d26e1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/83d26e1))
* **i18n:** add missing translations ([25c29f7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/25c29f7))
* **i18n:** add missing translations ([950c58b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/950c58b))
* **i18n:** add missing translations ([a5f61f7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a5f61f7))
* **ip.reverse:** use vps api only for legacy vps ([5497218](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5497218))



<a name="10.19.7"></a>
## [10.19.7](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.19.6...v10.19.7) (2019-07-11)


### Bug Fixes

* **user.contracts.modal:** remove non-breaking spaces ([#1241](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1241)) ([896a6de](https://github.com/ovh-ux/ovh-manager-dedicated/commit/896a6de))



<a name="10.19.6"></a>
## [10.19.6](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.19.5...v10.19.6) (2019-07-10)


### Bug Fixes

* **account.billing.payment.transactions:** add missing translations ([#1227](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1227)) ([bd81da6](https://github.com/ovh-ux/ovh-manager-dedicated/commit/bd81da6))
* **i18n:** add missing translations ([d65f6aa](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d65f6aa))
* **i18n:** add missing translations ([8a0e1df](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8a0e1df))
* **i18n:** add missing translations ([038746f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/038746f))



<a name="10.19.5"></a>
## [10.19.5](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.19.4...v10.19.5) (2019-07-09)



<a name="10.19.4"></a>
## [10.19.4](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.19.3...v10.19.4) (2019-07-05)


### Bug Fixes

* get access to the chatbot from both billing and account section ([#1228](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1228)) ([b6e5400](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b6e5400))



<a name="10.19.3"></a>
## [10.19.3](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.19.2...v10.19.3) (2019-07-03)


### Bug Fixes

* **drp:** return correct object of plan state response ([1729ace](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1729ace))



<a name="10.19.2"></a>
## [10.19.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.19.1...v10.19.2) (2019-07-01)


### Bug Fixes

* **dedicated.server.statistics:** improve charts display ([#1212](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1212)) ([d89d636](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d89d636))
* **deps:** upgrade ng-ovh-sidebar-menu to v8.3.3 ([#1219](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1219)) ([7c91453](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7c91453))



<a name="10.19.1"></a>
## [10.19.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.19.0...v10.19.1) (2019-06-28)


### Bug Fixes

* **deps:** upgrade some dependencies ([#1213](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1213)) ([be62df3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/be62df3))
* **i18n:** add missing translations ([30056d8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/30056d8))
* **i18n:** add missing translations ([df79ab6](https://github.com/ovh-ux/ovh-manager-dedicated/commit/df79ab6))



<a name="10.19.0"></a>
# [10.19.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.18.3...v10.19.0) (2019-06-28)


### Features

* update tracking id ([bdf262a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/bdf262a))



<a name="10.18.3"></a>
## [10.18.3](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.18.2...v10.18.3) (2019-06-27)


### Bug Fixes

* **deps:** upgrade ng-ovh-otrs to v7.1.5 ([#1207](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1207)) ([9a8e052](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9a8e052))
* **license:** add missing translations ([#1208](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1208)) ([1880c0e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1880c0e))



<a name="10.18.2"></a>
## [10.18.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.18.1...v10.18.2) (2019-06-26)


### Bug Fixes

* **dedicated.server:** fix mrtg graphics ([#1195](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1195)) ([61651b4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/61651b4))
* **deps:** upgrade some dependencies ([#1203](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1203)) ([b867051](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b867051))
* **i18n:** add missing translations ([bc45c0a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/bc45c0a))



<a name="10.18.1"></a>
## [10.18.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.18.0...v10.18.1) (2019-06-25)


### Bug Fixes

* **billing.autorenew:** display alert only if autoRenew is not activated ([#1198](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1198)) ([beab070](https://github.com/ovh-ux/ovh-manager-dedicated/commit/beab070))
* **billing.payment.ovhaccount.retrieve:** add non valid bank accounts ([#1199](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1199)) ([4b811c2](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4b811c2))
* **cdn.dedicated.service:** return data from getSelected method ([#1192](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1192)) ([83f5117](https://github.com/ovh-ux/ovh-manager-dedicated/commit/83f5117))
* **dedicated.cloud.dashboard:** display Arin IP counter ([#1189](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1189)) ([4b93028](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4b93028))
* **deps:** upgrade some dependencies ([#1196](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1196)) ([c681a4a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c681a4a))
* **i18n:** add missing translations ([912bef5](https://github.com/ovh-ux/ovh-manager-dedicated/commit/912bef5))
* **i18n:** add missing translations ([1a51955](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1a51955))
* **i18n:** add missing translations ([bfbd16f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/bfbd16f))
* **i18n:** add missing translations ([bc5b3b0](https://github.com/ovh-ux/ovh-manager-dedicated/commit/bc5b3b0))



<a name="10.18.0"></a>
# 10.18.0 (2019-06-19)


### Bug Fixes

* **backup:** correct link to Veeam presentation ([98597a3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/98597a3))
* **backup:** remove duplicate message ([db0fefb](https://github.com/ovh-ux/ovh-manager-dedicated/commit/db0fefb))
* **backup:** restore functionality ([e7ea1dc](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e7ea1dc))
* **dashboard:** duplicate error messages will display ([5faf591](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5faf591))
* **datacenter:** display error message ([7947cc3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7947cc3))
* **datacenter:** display that data is soon available ([b60473d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b60473d))
* **datacenter:** handle newly created filers & hosts ([22d7c12](https://github.com/ovh-ux/ovh-manager-dedicated/commit/22d7c12))
* **datacenter.backup:** send legacy offer when outside the US ([6048f20](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6048f20))
* **datacenter.datastore:** display hour of last update ([68f5863](https://github.com/ovh-ux/ovh-manager-dedicated/commit/68f5863))
* **datacenter.disable:** display error message correctly ([8737708](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8737708))
* **datastore:** handle case when no data is available yet ([6606d7e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6606d7e))
* **dedicated-cloud:** can order ressources in US again ([0aa547b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0aa547b))
* **dedicated-cloud:** fix eslint warnings ([a480abf](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a480abf))
* **general-information.dashboard:** add message when name was updated ([5095e7c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5095e7c))
* **options:** display Certification is service has one ([3b7bee7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/3b7bee7))
* **security:** display success message correctly ([804a3e3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/804a3e3))
* **selection:** add margin between lines ([f60069c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f60069c))
* **selection:** display message to pay checkout ([1325b67](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1325b67))
* **selection:** remove code specific for PL ([758ce06](https://github.com/ovh-ux/ovh-manager-dedicated/commit/758ce06))
* **selection.confirm:** change text according to item type ([fd95eb7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/fd95eb7))
* **upgrade:** restore missing translations ([1197496](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1197496))
* add missing injections ([2db2c90](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2db2c90))
* fix rebase mistakes ([6da0dac](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6da0dac))
* fix yarn.lock ([7965e34](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7965e34))
* **user:** respect password rules ([6a19d6a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6a19d6a))


### Features

* **datacenter:** add constants about element types ([9db5946](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9db5946))
* **datacenter:** handle hourly consumption for Agora hosts ([a0035b9](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a0035b9))
* **datacenter.datastore:** fetch consumption for Agora ([56158b8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/56158b8))
* **dedicated.server:** remove useless information network tile ([#1185](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1185)) ([8ca2fa6](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8ca2fa6))
* **options:** add guides for all subs ([3388845](https://github.com/ovh-ux/ovh-manager-dedicated/commit/3388845))
* **options:** add new status ([a850357](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a850357))
* **options:** handle option status per option ([deffa6f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/deffa6f))
* **options:** only display Certifications when one is orderable ([c0ea238](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c0ea238))
* **order:** allow resuming order at the correct place ([debfae3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/debfae3))
* **order:** hide modify menu item when needed ([ec8800d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ec8800d))
* **selection:** add translations for vRops option ([61efe26](https://github.com/ovh-ux/ovh-manager-dedicated/commit/61efe26))
* **user.password:** display confirmation message ([5cec279](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5cec279))


### Performance Improvements

* remove duplicate randexp dependency ([#1183](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1183)) ([f6c585d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f6c585d))



<a name="10.17.16"></a>
## [10.17.16](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.17.15...v10.17.16) (2019-06-14)


### Bug Fixes

* **ip:** improve popover positioning ([656cc4a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/656cc4a))



<a name="10.17.15"></a>
## [10.17.15](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.17.14...v10.17.15) (2019-06-11)


### Bug Fixes

* **deps:** upgrade ng-ovh-otrs to v7.1.2 ([#1176](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1176)) ([55bbb56](https://github.com/ovh-ux/ovh-manager-dedicated/commit/55bbb56))



<a name="10.17.14"></a>
## [10.17.14](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.17.13...v10.17.14) (2019-06-10)


### Bug Fixes

* **deps:** upgrade ng-ovh-otrs to v7.1.1 ([#1173](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1173)) ([8465bb0](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8465bb0))



<a name="10.17.13"></a>
## [10.17.13](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.17.12...v10.17.13) (2019-06-06)


### Bug Fixes

* **deps:** upgrade some dependencies ([#1163](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1163)) ([4b8acac](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4b8acac))
* **i18n:** retrieve translations ([#1167](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1167)) ([2f820d8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2f820d8))



<a name="10.17.12"></a>
## [10.17.12](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.17.11...v10.17.12) (2019-06-03)


### Bug Fixes

* **deps:** upgrade manager-server-sidebar to 0.1.6 ([#1157](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1157)) ([51310e9](https://github.com/ovh-ux/ovh-manager-dedicated/commit/51310e9))
* **deps:** upgrade ovh-module-exchange to v9.4.5 ([#1155](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1155)) ([79de050](https://github.com/ovh-ux/ovh-manager-dedicated/commit/79de050))
* **i18n:** retrieve translations ([#1159](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1159)) ([afc9271](https://github.com/ovh-ux/ovh-manager-dedicated/commit/afc9271))



<a name="10.17.11"></a>
## [10.17.11](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.17.10...v10.17.11) (2019-05-29)


### Bug Fixes

* **deps:** bump manager-navbar to v0.5.0 ([#1150](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1150)) ([39f8590](https://github.com/ovh-ux/ovh-manager-dedicated/commit/39f8590))



<a name="10.17.10"></a>
## [10.17.10](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.17.9...v10.17.10) (2019-05-27)


### Bug Fixes

* **account.billing:** add missing translation on cancellation form ([#1132](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1132)) ([b0f155d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b0f155d)), closes [#1131](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1131)
* **dedicated.server:** hide usb storage tab option ([#1108](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1108)) ([9260a55](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9260a55))
* display labels in all server graph ([#1090](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1090)) ([072fb4b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/072fb4b))
* **i18n:** retrieve translations ([ee64274](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ee64274))
* **i18n:** retrieve translations ([9b4a53b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9b4a53b))
* **i18n:** retrieve translations ([#1145](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1145)) ([76119a8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/76119a8))
* **i18n:** submit translations ([6994264](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6994264))
* **i18n:** submit translations ([fd73806](https://github.com/ovh-ux/ovh-manager-dedicated/commit/fd73806))



<a name="10.17.9"></a>
## [10.17.9](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.17.8...v10.17.9) (2019-05-22)



<a name="10.17.8"></a>
## [10.17.8](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.17.7...v10.17.8) (2019-05-22)


### Bug Fixes

* **deps:** upgrade manager-server-sidebar to v0.1.3 ([#1137](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1137)) ([88e4283](https://github.com/ovh-ux/ovh-manager-dedicated/commit/88e4283))



<a name="10.17.7"></a>
## [10.17.7](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.17.6...v10.17.7) (2019-05-22)


### Bug Fixes

* **deps:** upgrade both core and navbar dependencies ([#1134](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1134)) ([31f925b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/31f925b)), closes [#1133](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1133)



<a name="10.17.6"></a>
## [10.17.6](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.17.5...v10.17.6) (2019-05-21)


### Bug Fixes

* CA region use now right link ([f222ba3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f222ba3))



<a name="10.17.5"></a>
## [10.17.5](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.17.4...v10.17.5) (2019-05-21)


### Bug Fixes

* **i18n:** retrieve translations ([#1121](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1121)) ([54ab1b4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/54ab1b4))



<a name="10.17.4"></a>
## [10.17.4](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.17.3...v10.17.4) (2019-05-15)


### Bug Fixes

* **i18n:** retrieve translations ([1f27699](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1f27699))
* **i18n:** submit translations ([fe2f6f7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/fe2f6f7))
* **license:** add missing translations ([#1116](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1116)) ([dad003d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/dad003d))



<a name="10.17.3"></a>
## [10.17.3](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.17.2...v10.17.3) (2019-05-15)


### Bug Fixes

* **deps:** upgrade ovh-module-exchange to v9.4.4 ([#1110](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1110)) ([82570d1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/82570d1))
* **i18n:** retrieve translations ([e615648](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e615648))
* **i18n:** retrieve translations ([#1112](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1112)) ([425ebe3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/425ebe3))
* **i18n:** submit translations ([bf39a4b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/bf39a4b))
* **license:** add both windows server 2019 standard and datacenter ([#1106](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1106)) ([6281350](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6281350))



<a name="10.17.2"></a>
## [10.17.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.17.1...v10.17.2) (2019-05-06)


### Bug Fixes

* **dedicated.server:** display correctly datacenter name ([#1086](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1086)) ([6f15b8b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6f15b8b))
* **deps:** upgrade ovh-module-exchange to v9.4.3 ([#1103](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1103)) ([b4ed8eb](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b4ed8eb))
* **i18n:** retrieve translations ([2c2750a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2c2750a))
* **i18n:** submit translations ([5ee521b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5ee521b))



<a name="10.17.1"></a>
## [10.17.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.17.0...v10.17.1) (2019-05-02)


### Bug Fixes

* **deps:** upgrade ovh-module-exchange to v9.4.2 ([#1096](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1096)) ([e6eab64](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e6eab64))
* **i18n:** retrieve translations ([#1098](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1098)) ([6c95985](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6c95985))


### Features

* **i18n:** new translation ([2b343e4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2b343e4))
* **i18n:** retrieve translations ([0168370](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0168370))
* **i18n:** submit translation ([585f6ff](https://github.com/ovh-ux/ovh-manager-dedicated/commit/585f6ff))



<a name="10.17.0"></a>
# [10.17.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.16.0...v10.17.0) (2019-04-29)


### Bug Fixes

* **components.user.session:** remove duplicate ticket entry ([#1089](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1089)) ([e0f2d96](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e0f2d96))
* **i18n:** retrieve translations ([#1088](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1088)) ([4cdb8f1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4cdb8f1))
* **i18n:** retrieve translations ([#1092](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1092)) ([f3dca1c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f3dca1c))


### Features

* **dedicated.server:** notify installation support rendezvous ([#1091](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1091)) ([85022ba](https://github.com/ovh-ux/ovh-manager-dedicated/commit/85022ba))



<a name="10.16.0"></a>
# [10.16.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.15.5...v10.16.0) (2019-04-17)


### Bug Fixes

* use the correct order ip modal from zerto ([1921ca7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1921ca7))
* **i18n:** retrieve translations ([83083a6](https://github.com/ovh-ux/ovh-manager-dedicated/commit/83083a6))
* **i18n:** retrieve translations ([#1082](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1082)) ([79ce007](https://github.com/ovh-ux/ovh-manager-dedicated/commit/79ce007))
* **i18n:** submit translations ([0732821](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0732821))
* **ip.legacyorder:** add state reload after ip order ([5909fc3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5909fc3))


### Features

* **datacenter.drp:** show service name if there is no description ([#1070](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1070)) ([4a3990b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4a3990b))
* add chatbot accessible from the assistance menu ([#1075](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1075)) ([4871cd9](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4871cd9))



<a name="10.15.5"></a>
## [10.15.5](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.15.4...v10.15.5) (2019-04-12)


### Bug Fixes

* ip order ([7079768](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7079768))



<a name="10.15.4"></a>
## [10.15.4](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.15.3...v10.15.4) (2019-04-11)


### Bug Fixes

* **ip.order:** set a default quantity for express order ([aec1832](https://github.com/ovh-ux/ovh-manager-dedicated/commit/aec1832))



<a name="10.15.3"></a>
## [10.15.3](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.15.2...v10.15.3) (2019-04-11)


### Bug Fixes

* **i18n:** retrieve translations ([a54fc65](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a54fc65))
* **i18n:** retrieve translations ([0ebb53e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0ebb53e))
* **i18n:** submit translations ([c432c84](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c432c84))
* **i18n:** submit translations ([448b223](https://github.com/ovh-ux/ovh-manager-dedicated/commit/448b223))
* **ip:** fix broken linked services ip order agora ([#1014](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1014)) ([22c7b88](https://github.com/ovh-ux/ovh-manager-dedicated/commit/22c7b88))
* **user.contacts.service:** fix update filters ([ef737fd](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ef737fd))
* **user.contacts.service:** prevent flash of empty services in table ([2ceb1ef](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2ceb1ef))



<a name="10.15.2"></a>
## [10.15.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.15.1...v10.15.2) (2019-04-10)


### Bug Fixes

* **ip.legacy-order:** display the right country label ([#1063](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1063)) ([8c8ac87](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8c8ac87))



<a name="10.15.1"></a>
## [10.15.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.15.0...v10.15.1) (2019-04-09)


### Bug Fixes

* **dedicatedcloud.datacenter.drp:** display success message ([#1057](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1057)) ([62c1fab](https://github.com/ovh-ux/ovh-manager-dedicated/commit/62c1fab))



<a name="10.15.0"></a>
# [10.15.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.14.1...v10.15.0) (2019-04-08)


### Bug Fixes

* **datacenter.drp:** disable zerto for us ([f7367d5](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f7367d5))
* **datacenter.drp:** remove debug remains ([7286e08](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7286e08))
* **dedicated-cloud:** add missing annotations ([7861681](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7861681))
* **dedicated-cloud:** close alert message successfully ([df555e3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/df555e3))
* **dedicated-cloud:** remove deprecated notification ([4a3a8ff](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4a3a8ff))
* **dedicated-cloud-security:** menu is displayed only when actions ([1ef4f94](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1ef4f94))
* **dedicated-cloud-security:** reword button texts ([bea057e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/bea057e))
* **dedicated-cloud-security-access:** rewrite text ([4b76b24](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4b76b24))
* **dedicated-cloud-security-add:** display error message correctly ([8909a1e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8909a1e))
* **dedicated-cloud-security-add:** use Promise better ([0804325](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0804325))
* **dedicated-cloud-security-logout:** rewrite text ([5f88a73](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5f88a73))
* **dedicated-cloud-security-max:** rewrite text ([bddf965](https://github.com/ovh-ux/ovh-manager-dedicated/commit/bddf965))
* **dedicated-cloud-security-timeout:** fix wording ([cc464d5](https://github.com/ovh-ux/ovh-manager-dedicated/commit/cc464d5))
* **dedicated-cloud-user:** display menu only if action is possible ([342adaf](https://github.com/ovh-ux/ovh-manager-dedicated/commit/342adaf))
* **dedicated-cloud-user:** remove irrelevant semi-colon ([40f16a5](https://github.com/ovh-ux/ovh-manager-dedicated/commit/40f16a5))
* **dedicated-cloud-user-delete:** display success message correctly ([42c11a3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/42c11a3))
* **dedicatedcloud:** add missing security translation ([#1048](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1048)) ([a8b251c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a8b251c))
* **i18n:** retrieve ([2173503](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2173503))
* **i18n:** retrieve ([6d79092](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6d79092))
* **i18n:** retrieve translations ([d71abef](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d71abef))
* **i18n:** retrieve translations ([#1042](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1042)) ([e628fd2](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e628fd2))
* **i18n:** retrieve translations ([#1049](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1049)) ([2935a7b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2935a7b))
* **i18n:** submit ([45e9466](https://github.com/ovh-ux/ovh-manager-dedicated/commit/45e9466))
* **i18n:** submit ([a64f452](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a64f452))
* **security:** fix typo ([c6fd7bb](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c6fd7bb))
* **user.enable:** add method to ([38c1c0f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/38c1c0f))
* remove tags in text ([c8ca093](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c8ca093))


### Features

* **account.billing:** add exchange account renew in my services ([ba042df](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ba042df))



<a name="10.14.1"></a>
## [10.14.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.14.0...v10.14.1) (2019-04-04)


### Bug Fixes

* **config:** remove sk_SK from language constants ([#1045](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1045)) ([58f2c29](https://github.com/ovh-ux/ovh-manager-dedicated/commit/58f2c29))



<a name="10.14.0"></a>
# [10.14.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.13.5...v10.14.0) (2019-04-01)


### Features

* **i18n:** retrieve translations ([0aaaa2f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0aaaa2f))



<a name="10.13.5"></a>
## [10.13.5](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.13.4...v10.13.5) (2019-03-25)


### Bug Fixes

* **billing.payment.add:** contact choice for ES and IE ([#1030](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1030)) ([e5eb99d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e5eb99d))


### Features

* **i18n:** retrieve translations ([a6bfe32](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a6bfe32))



<a name="10.13.4"></a>
## [10.13.4](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.13.3...v10.13.4) (2019-03-21)


### Bug Fixes

* **dedicated.server:** activate backup ftp title ([1b960ff](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1b960ff))



<a name="10.13.3"></a>
## [10.13.3](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.13.2...v10.13.3) (2019-03-21)


### Bug Fixes

* **billing:** add missing dependency ([5183fe1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5183fe1))
* **dedicatedCloud.translations:** change some zerto translations ([#1007](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1007)) ([016a4e3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/016a4e3))
* **deps:** upgrade ng-ovh-otrs to v7.0.0 ([#1001](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1001)) ([2602ce5](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2602ce5))
* **i18n:** retrieve ([83406c6](https://github.com/ovh-ux/ovh-manager-dedicated/commit/83406c6))
* **i18n:** retrieve translations ([8bbab38](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8bbab38))
* **i18n:** submit translations ([4ce3f52](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4ce3f52))



<a name="10.13.2"></a>
## [10.13.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.13.1...v10.13.2) (2019-03-20)


### Bug Fixes

* **dedicated.server:** edit display name ([449b530](https://github.com/ovh-ux/ovh-manager-dedicated/commit/449b530))



<a name="10.13.1"></a>
## [10.13.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.13.0...v10.13.1) (2019-03-19)


### Features

* **i18n:** retrieve translations ([2c4cae7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2c4cae7))
* **i18n:** retrieve translations ([b050b5e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b050b5e))



<a name="10.13.0"></a>
# [10.13.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.12.0...v10.13.0) (2019-03-13)


### Bug Fixes

* **cdn.dedicated.manage.statistics:** fix chart data ([#1004](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1004)) ([5c1c9d2](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5c1c9d2))
* **dedicated.server.statictics:** fix for mrtg graph plot error ([#984](https://github.com/ovh-ux/ovh-manager-dedicated/issues/984)) ([c2e4c33](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c2e4c33))
* **deps:** upgrade ng-at-internet to v4.0.0 ([#1005](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1005)) ([17897f1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/17897f1))
* **deps:** upgrade ng-ovh-api-wrappers to v3.0.0 ([#997](https://github.com/ovh-ux/ovh-manager-dedicated/issues/997)) ([cd3baac](https://github.com/ovh-ux/ovh-manager-dedicated/commit/cd3baac))
* **deps:** upgrade ovh-api-services to v6.1.2 ([#1011](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1011)) ([37badb8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/37badb8))
* **i18n:** retrieve translations ([#1010](https://github.com/ovh-ux/ovh-manager-dedicated/issues/1010)) ([65e724d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/65e724d))


### Features

* **i18n:** dedicated server new translations ([cf76af5](https://github.com/ovh-ux/ovh-manager-dedicated/commit/cf76af5))
* **i18n:** dedicated server new translations ([483fc05](https://github.com/ovh-ux/ovh-manager-dedicated/commit/483fc05))
* **i18n:** retrieve translations ([07afbf7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/07afbf7))



<a name="10.12.0"></a>
# [10.12.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.11.2...v10.12.0) (2019-03-05)


### Bug Fixes

* **deps:** upgrade ovh-module-exchange to v9.3.3 ([367cb62](https://github.com/ovh-ux/ovh-manager-dedicated/commit/367cb62))
* **deps:** upgrade ovh-module-exchange to v9.3.4 ([f0d7067](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f0d7067))
* **i18n:** retrieve translations ([2c5d213](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2c5d213))
* **i18n:** submit translations ([bf64be4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/bf64be4))


### Features

* **account.billing.history.debt.pay:** add atinternet tracking ([#986](https://github.com/ovh-ux/ovh-manager-dedicated/issues/986)) ([b0b0a18](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b0b0a18))
* **cdn.dedicated:** expose logs to customers ([#982](https://github.com/ovh-ux/ovh-manager-dedicated/issues/982)) ([d0d362d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d0d362d))



<a name="10.11.2"></a>
## [10.11.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.11.1...v10.11.2) (2019-03-01)


### Bug Fixes

* **dedicated.server:** translation issue order vrack ([89fc68e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/89fc68e))



<a name="10.11.1"></a>
## [10.11.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.11.0...v10.11.1) (2019-02-28)


### Bug Fixes

* **i18n:** retrieve translations ([654166c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/654166c))



<a name="10.11.0"></a>
# [10.11.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.10.6...v10.11.0) (2019-02-27)


### Bug Fixes

* **billing.payment:** add explain text for credit card add ([#951](https://github.com/ovh-ux/ovh-manager-dedicated/issues/951)) ([c106b67](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c106b67))
* **deps:** upgrade ng-ovh-apiv7 to v2.0.0 ([79bd5f4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/79bd5f4))
* **i18n:** retrieve ([b556ad1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b556ad1))
* **i18n:** retrieve translations ([69e9d1f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/69e9d1f))
* **i18n:** retrive translations ([77ae1f1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/77ae1f1))
* **i18n:** submit translations ([e796345](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e796345))


### Features

* **dedicated.server:** disable header tabs if service is expired ([#978](https://github.com/ovh-ux/ovh-manager-dedicated/issues/978)) ([ef13c11](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ef13c11))



<a name="10.10.6"></a>
## [10.10.6](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.10.5...v10.10.6) (2019-02-25)


### Bug Fixes

* **billing.balance:** call to existing method ([c48fe4e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c48fe4e))



<a name="10.10.5"></a>
## [10.10.5](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.10.4...v10.10.5) (2019-02-15)


### Bug Fixes

* **dedicatedcloud:** update spla plancode ([2c1ff1a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2c1ff1a))



<a name="10.10.4"></a>
## [10.10.4](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.10.3...v10.10.4) (2019-02-13)


### Bug Fixes

* **ip.mitigation.statistics:** display correct units and details ([#968](https://github.com/ovh-ux/ovh-manager-dedicated/issues/968)) ([3ef5e90](https://github.com/ovh-ux/ovh-manager-dedicated/commit/3ef5e90))



<a name="10.10.3"></a>
## [10.10.3](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.10.2...v10.10.3) (2019-02-12)


### Bug Fixes

* **dedicated.ftp-backup:** add limit to ip blocks ([#959](https://github.com/ovh-ux/ovh-manager-dedicated/issues/959)) ([431669b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/431669b))
* **deps:** upgrade exchange module ([1bfa975](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1bfa975))
* **deps:** upgrade exchange module ([da672a6](https://github.com/ovh-ux/ovh-manager-dedicated/commit/da672a6))
* **i18n:** extract translations ([2429e17](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2429e17)), closes [#960](https://github.com/ovh-ux/ovh-manager-dedicated/issues/960)
* **i18n:** retrieve translations ([7a16725](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7a16725))
* **i18n:** submit translations ([ea6a5c0](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ea6a5c0))



<a name="10.10.2"></a>
## [10.10.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.10.1...v10.10.2) (2019-02-04)


### Bug Fixes

* **i18n:** retrieve translations ([e7485c5](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e7485c5))
* **i18n:** submit translations ([addaf6d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/addaf6d))
* **navbar:** revamp style and texts ([#877](https://github.com/ovh-ux/ovh-manager-dedicated/issues/877)) ([531a33e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/531a33e))



<a name="10.10.1"></a>
## [10.10.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.10.0...v10.10.1) (2019-01-31)


### Bug Fixes

* **account.billing.payment.add:** us payment add ([8690acb](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8690acb))
* **billing.payment:** clear vantiv iframe if already exist ([2a416aa](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2a416aa))
* **billing.payment.method:** disbale default credit card with bad status ([eb0cb42](https://github.com/ovh-ux/ovh-manager-dedicated/commit/eb0cb42))
* **dedicated.server:** display tabs on reinstall error ([cc3e161](https://github.com/ovh-ux/ovh-manager-dedicated/commit/cc3e161))



<a name="10.10.0"></a>
# [10.10.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.9.4...v10.10.0) (2019-01-30)


### Bug Fixes

* **i18n:** retrieve translations ([e9408d8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e9408d8))
* **i18n:** submit translations ([1fa1f19](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1fa1f19))
* **translation:** incorrect translation while moving IP ([51d5377](https://github.com/ovh-ux/ovh-manager-dedicated/commit/51d5377)), closes [#MBE-238](https://github.com/ovh-ux/ovh-manager-dedicated/issues/MBE-238)


### Features

* **account.user.contacts:** support kubernetes ([#941](https://github.com/ovh-ux/ovh-manager-dedicated/issues/941)) ([e3d3992](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e3d3992))



<a name="10.9.4"></a>
## [10.9.4](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.9.3...v10.9.4) (2019-01-23)


### Bug Fixes

* **account.billing.autorenew:**  rearrange payment frequency table ([#905](https://github.com/ovh-ux/ovh-manager-dedicated/issues/905)) ([4071d2b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4071d2b))
* **account.user.ssh:** removed cache ([#923](https://github.com/ovh-ux/ovh-manager-dedicated/issues/923)) ([b795388](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b795388))
* **config:** replace invalid guide link on IPMI ([#910](https://github.com/ovh-ux/ovh-manager-dedicated/issues/910)) ([c3f9e19](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c3f9e19))
* **configuration:** change message for FR subsidiary ([#866](https://github.com/ovh-ux/ovh-manager-dedicated/issues/866)) ([3aacf20](https://github.com/ovh-ux/ovh-manager-dedicated/commit/3aacf20))
* **i18n:** retrieve translations ([47bc300](https://github.com/ovh-ux/ovh-manager-dedicated/commit/47bc300))
* **i18n:** submit translations ([77bfeae](https://github.com/ovh-ux/ovh-manager-dedicated/commit/77bfeae))
* **ip.order:** improve modal form ([#921](https://github.com/ovh-ux/ovh-manager-dedicated/issues/921)) ([a873f20](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a873f20))



<a name="10.9.3"></a>
## [10.9.3](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.9.2...v10.9.3) (2019-01-23)



<a name="10.9.2"></a>
## [10.9.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.9.1...v10.9.2) (2019-01-23)


### Bug Fixes

* **dedicated.server:** infinite loading when installation error ([93c07f1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/93c07f1))



<a name="10.9.1"></a>
## [10.9.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.9.0...v10.9.1) (2019-01-17)


### Bug Fixes

* billingMean injection in autorenew view ([f6c4c52](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f6c4c52))
* BillingPaymentMethod injection in autorenew view ([6fd1962](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6fd1962))



<a name="10.9.0"></a>
# [10.9.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.8.2...v10.9.0) (2019-01-17)


### Bug Fixes

* prevent loading angularjs more than once ([ef38fae](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ef38fae))


### Features

* **billing.payment:** add new payment methods ([dddf1a7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/dddf1a7))



<a name="10.8.2"></a>
## [10.8.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.8.1...v10.8.2) (2019-01-17)



<a name="10.8.1"></a>
## [10.8.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.8.0...v10.8.1) (2019-01-16)


### Bug Fixes

* **billing.autorenew:** change redirection for exchange dedicated offers ([#903](https://github.com/ovh-ux/ovh-manager-dedicated/issues/903)) ([5e1c9f0](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5e1c9f0))
* **billing.autorenew:** fix resiliation for exchange services ([356c2fd](https://github.com/ovh-ux/ovh-manager-dedicated/commit/356c2fd))
* **billing.history:** display right due date value ([c72505a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c72505a))
* **i18n:** retrieve translations ([24ada1f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/24ada1f))
* **ie11:** bump [@ovh-ux](https://github.com/ovh-ux)/translate-async-loader ([5b9f941](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5b9f941))
* **server.statistics:** add only milliseconds offset ([#901](https://github.com/ovh-ux/ovh-manager-dedicated/issues/901)) ([99347e1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/99347e1))



<a name="10.8.0"></a>
# [10.8.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.7.8...v10.8.0) (2019-01-09)


### Bug Fixes

* **config:** update some guide links ([#893](https://github.com/ovh-ux/ovh-manager-dedicated/issues/893)) ([ada8f72](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ada8f72))
* **i18n:** add missing translations for payment method ([0483b7a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0483b7a))
* **i18n:** retrieve ([7ad7fdd](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7ad7fdd))
* **i18n:** retrieve translations ([e822e45](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e822e45))
* **i18n:** submit ([ede79f4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ede79f4))
* **i18n:** submit translations ([8e7f81e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8e7f81e))
* **ip.ip-lb:** add port redirection ([961a0f3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/961a0f3))
* **vantiv:** increasing the value of numYears to be 10 at a time ([#882](https://github.com/ovh-ux/ovh-manager-dedicated/issues/882)) ([34f533a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/34f533a))


### Features

* **billing.autorenew:** allow only nic billing to pay debt ([#890](https://github.com/ovh-ux/ovh-manager-dedicated/issues/890)) ([b108932](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b108932))
* **billing.history:** change message if there is no debt to pay ([06f276d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/06f276d))
* **components.user.session:** remove some assistance menu items for FR ([838c047](https://github.com/ovh-ux/ovh-manager-dedicated/commit/838c047))



<a name="10.7.8"></a>
## [10.7.8](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.7.7...v10.7.8) (2019-01-04)


### Bug Fixes

* **billing.autorenew:** fix autorenew activation  button  display ([#887](https://github.com/ovh-ux/ovh-manager-dedicated/issues/887)) ([eb55776](https://github.com/ovh-ux/ovh-manager-dedicated/commit/eb55776))



<a name="10.7.7"></a>
## [10.7.7](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.7.6...v10.7.7) (2019-01-02)


### Bug Fixes

* **billing.orders:** fix bill download for delivered orders ([7697d69](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7697d69))
* **billing.orders:** fix translation ([19f6473](https://github.com/ovh-ux/ovh-manager-dedicated/commit/19f6473))



<a name="10.7.6"></a>
## [10.7.6](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.7.5...v10.7.6) (2018-12-20)


### Bug Fixes

* **i18n:** add missing translations ([b0ed166](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b0ed166))



<a name="10.7.5"></a>
## [10.7.5](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.7.4...v10.7.5) (2018-12-20)


### Bug Fixes

* **billing.autorenew:** fix exchange renew redirection ([d4906cc](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d4906cc))
* **user.contacts:** replace ng-show with ng-if ([a73809f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a73809f))



<a name="10.7.4"></a>
## [10.7.4](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.7.3...v10.7.4) (2018-12-13)



<a name="10.7.3"></a>
## [10.7.3](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.7.2...v10.7.3) (2018-12-11)


### Bug Fixes

* **billing.mean:** change message for payment mean addition ([1bd9989](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1bd9989))
* **billing.mean:** prevent default mean choice if there is none ([b553403](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b553403))
* **dedicated.server.dashboard:** prevent displaying modal as background ([1b1e342](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1b1e342))
* **i18n:** retrieve translations ([3a9a995](https://github.com/ovh-ux/ovh-manager-dedicated/commit/3a9a995))
* **i18n:** submit translations ([9caad3f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9caad3f))



<a name="10.7.2"></a>
## [10.7.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.7.1...v10.7.2) (2018-12-10)


### Bug Fixes

* **nas.order:** missing injection ([ae5cd5e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ae5cd5e))



<a name="10.7.1"></a>
## [10.7.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.7.0...v10.7.1) (2018-12-06)


### Bug Fixes

* **dedicatedcloud:** restore dashboard alert ([a490251](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a490251))



<a name="10.7.0"></a>
# [10.7.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.6.6...v10.7.0) (2018-12-05)


### Bug Fixes

* **dedicatedcloud:** remove duplicate error messages ([8908736](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8908736))
* **i18n:** retrieve translations ([3ff6992](https://github.com/ovh-ux/ovh-manager-dedicated/commit/3ff6992))
* **i18n:** submit translations ([bb70c90](https://github.com/ovh-ux/ovh-manager-dedicated/commit/bb70c90))


### Features

* **billing:** disable autorenew if there is no valid payment mean ([e36da53](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e36da53))



<a name="10.6.6"></a>
## [10.6.6](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.6.5...v10.6.6) (2018-11-29)


### Bug Fixes

* **dedicated.server:** dashboard refresh on status error ([e6f9967](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e6f9967))



<a name="10.6.5"></a>
## [10.6.5](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.6.4...v10.6.5) (2018-11-29)



<a name="10.6.4"></a>
## [10.6.4](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.6.3...v10.6.4) (2018-11-29)


### Bug Fixes

* **account.user.security.sms:** re-enable sms ([7f72362](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7f72362))



<a name="10.6.3"></a>
## [10.6.3](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.6.2...v10.6.3) (2018-11-27)


### Bug Fixes

* **account.billing:** confirmTerminate domain not working ([3a0a64c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/3a0a64c))
* **account.billing.autorenew:** search text capture from url ([fe603fe](https://github.com/ovh-ux/ovh-manager-dedicated/commit/fe603fe))
* **account.user.contacts:** update country code ([2dad39c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2dad39c))
* **dedicated-server:** tabs loading ([7b50024](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7b50024))
* **deps:** upgrade npm-run-all to v4.1.5 ([552d549](https://github.com/ovh-ux/ovh-manager-dedicated/commit/552d549))
* **i18n:** retrieve translations ([629ccdc](https://github.com/ovh-ux/ovh-manager-dedicated/commit/629ccdc))
* **i18n:** retrieve translations ([fe51e78](https://github.com/ovh-ux/ovh-manager-dedicated/commit/fe51e78))
* **i18n:** submit translations ([3b636eb](https://github.com/ovh-ux/ovh-manager-dedicated/commit/3b636eb))
* **license.order:** align and fix table ([c92d6ad](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c92d6ad))



<a name="10.6.2"></a>
## [10.6.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.6.1...v10.6.2) (2018-11-23)


### Bug Fixes

* **constants:** fix FI order url ([ef55e66](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ef55e66))



<a name="10.6.1"></a>
## [10.6.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.6.0...v10.6.1) (2018-11-21)



<a name="10.6.0"></a>
# [10.6.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.5.1...v10.6.0) (2018-11-20)


### Bug Fixes

* **autorenew:** redirect to exchange on service termination ([ceab566](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ceab566))
* **autorenew:** update automatic payment enable/disable conditions ([8472482](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8472482))
* **dedicated.ipmi:** fix kvm order ([874c3a1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/874c3a1))
* **deps:** update manager-webpack-config to v2.4.7 ([717cbe4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/717cbe4))
* **deps:** upgrade manager-webpack-config to v3.0.0 ([caf72a1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/caf72a1))
* **deps:** upgrade ovh-api-services to v3.24.0 ([1151415](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1151415))
* **deps:** upgrade ovh-module-exchange to v9.1.0 ([a153619](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a153619))
* **deps:** upgrade ovh-ui-angular to v2.22.1 ([968b2f9](https://github.com/ovh-ux/ovh-manager-dedicated/commit/968b2f9))
* **i18n:** retrieve translations ([f380ab4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f380ab4))
* **i18n:** retrieve translations ([6dbe2e7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6dbe2e7))
* **i18n:** retrieve translations ([1131d3a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1131d3a))
* **i18n:** submit translations ([bade8e0](https://github.com/ovh-ux/ovh-manager-dedicated/commit/bade8e0))
* **i18n:** submit translations ([e725d43](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e725d43))
* **working-status:** replace by new view OVH-tasks ([7b0694a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7b0694a))


### Features

* **autorenew:** disable service edition for exchange services ([b4d30a8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b4d30a8))
* **billing.autorenew:** disable renew action for in debt services ([f2883ac](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f2883ac))
* **billing.autorenew:** rename renew buttons ([6e5cbe2](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6e5cbe2))
* **kvm-html:** kvm html in ipmi tab ([22b4e99](https://github.com/ovh-ux/ovh-manager-dedicated/commit/22b4e99))
* **navbar.user:** add tracking on user menu ([7daaee1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7daaee1))



<a name="10.5.1"></a>
## [10.5.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.5.0...v10.5.1) (2018-11-09)


### Bug Fixes

* **exchange:** upgrade ovh-module-exchange to v9.0.6 ([b6f3133](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b6f3133))
* **exchange:** upgrade ovh-module-exchange to v9.0.7 ([061fbdb](https://github.com/ovh-ux/ovh-manager-dedicated/commit/061fbdb))



<a name="10.5.0"></a>
# [10.5.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.4.10...v10.5.0) (2018-11-08)


### Bug Fixes

* **dedicated.installation:** fix progress for expired servers ([bd616ba](https://github.com/ovh-ux/ovh-manager-dedicated/commit/bd616ba))
* **dedicated.server:** delete service ([8ca7370](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8ca7370))
* **deps:** update manager-webpack-config to v2.4.6 ([d7e714c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d7e714c))
* **deps:** update translate-async-loader to v1.0.5 ([2d8ff63](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2d8ff63))
* **deps:** upgrade ovh-angular-otrs to v6.3.0 ([c9e54d1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c9e54d1))
* **deps:** upgrade ovh-module-exchange to v9.0.5 ([62fbb0f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/62fbb0f))
* **deps:** upgrade ovh-ui-kit to v2.22.0 ([d94883e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d94883e))
* **i18n:** retrieve translations ([16f51b0](https://github.com/ovh-ux/ovh-manager-dedicated/commit/16f51b0))
* **i18n:** submit translations ([c65c575](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c65c575))


### Features

* **account.tracking:** add tracking in account section ([94742ef](https://github.com/ovh-ux/ovh-manager-dedicated/commit/94742ef))
* **navbar:** add tracking for assistance and notifications ([77a4134](https://github.com/ovh-ux/ovh-manager-dedicated/commit/77a4134))



<a name="10.4.10"></a>
## [10.4.10](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.4.9...v10.4.10) (2018-11-07)


### Bug Fixes

* **dedicated.server:** installation template error ([1f81819](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1f81819))



<a name="10.4.9"></a>
## [10.4.9](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.4.8...v10.4.9) (2018-11-06)


### Bug Fixes

* **dedicated server:** fix ssh list display ([#760](https://github.com/ovh-ux/ovh-manager-dedicated/issues/760)) ([280df06](https://github.com/ovh-ux/ovh-manager-dedicated/commit/280df06))



<a name="10.4.8"></a>
## [10.4.8](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.4.7...v10.4.8) (2018-10-30)


### Bug Fixes

* apply htmlhint rules ([9ad8360](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9ad8360))
* **ipfo:** agora order on non us dedicated service ([23878ce](https://github.com/ovh-ux/ovh-manager-dedicated/commit/23878ce))
* **ipfo:** display country only if more than one country ([6ed8d2d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6ed8d2d))
* **ipfo:** set good catalog name param ([f3196d4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f3196d4))
* **pcc:** us veeam link ([e26630e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e26630e))



<a name="10.4.7"></a>
## [10.4.7](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.4.6...v10.4.7) (2018-10-22)



<a name="10.4.6"></a>
## [10.4.6](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.4.5...v10.4.6) (2018-10-19)


### Bug Fixes

* **ckeditor:** rollback to ckeditor 4 ([c36408d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c36408d))



<a name="10.4.5"></a>
## [10.4.5](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.4.4...v10.4.5) (2018-10-18)


### Features

* **home:** change subscription banner by updates banner ([9d91bcf](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9d91bcf))



<a name="10.4.4"></a>
## [10.4.4](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.4.3...v10.4.4) (2018-10-18)


### Features

* **home:** change subscription banner to live banner ([3d71ebd](https://github.com/ovh-ux/ovh-manager-dedicated/commit/3d71ebd))



<a name="10.4.3"></a>
## [10.4.3](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.4.2...v10.4.3) (2018-10-17)


### Bug Fixes

* **i18n:** retrieve translations ([28021d9](https://github.com/ovh-ux/ovh-manager-dedicated/commit/28021d9))



<a name="10.4.2"></a>
## [10.4.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.4.1...v10.4.2) (2018-10-16)


### Bug Fixes

* **dedicatedcloud.security:** fix guides ([6935cf4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6935cf4))



<a name="10.4.1"></a>
## [10.4.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.4.0...v10.4.1) (2018-10-16)


### Bug Fixes

* **ckeditor:** rollback to ckeditor 4 ([e2f0985](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e2f0985))



<a name="10.4.0"></a>
# [10.4.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.3.4...v10.4.0) (2018-10-16)


### Bug Fixes

* **2fa:** phone number preload  ([278f4d4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/278f4d4))
* **billing.autorenew:** changed title for dialogs ([1a1161b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1a1161b))
* **dedicated cloud:** add optional label to description field ([734dc06](https://github.com/ovh-ux/ovh-manager-dedicated/commit/734dc06))
* **dedicated cloud kms:** merge steps 2, 3 and 4 - fix text overflow ([f5045eb](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f5045eb))
* **i18n:** retrieve translations ([ab66cc9](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ab66cc9))
* **i18n:** retrieve translations ([f70f78d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f70f78d))
* **i18n:** retrieve translations ([8000d49](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8000d49))
* **i18n:** retrieve translations ([f36cdf0](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f36cdf0))
* **i18n:** retrieve translations ([1345a08](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1345a08))
* **i18n:** submit translations ([14e9c50](https://github.com/ovh-ux/ovh-manager-dedicated/commit/14e9c50))
* **i18n:** submit translations ([5be8ef6](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5be8ef6))
* **pcc.datacenter.host:** changed message and removed cross ([9323099](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9323099))


### Features

* add veeam enterprise ([8ad2628](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8ad2628))
* **dedicated cloud:** VM Encryption edit and delete kms - guides ([57e455a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/57e455a))
* **dedicated.cloud:** add VM Encryption kms ([339454a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/339454a))



<a name="10.3.4"></a>
## [10.3.4](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.3.3...v10.3.4) (2018-10-09)


### Bug Fixes

* **ie11:** app will now display correctly ([2f2f2ba](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2f2f2ba))



<a name="10.3.3"></a>
## [10.3.3](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.3.2...v10.3.3) (2018-10-08)


### Bug Fixes

* set correct relative path to background images ([faab143](https://github.com/ovh-ux/ovh-manager-dedicated/commit/faab143))



<a name="10.3.2"></a>
## [10.3.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.3.1...v10.3.2) (2018-10-08)


### Bug Fixes

* **components.manager-preload:** center hr element ([0d64020](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0d64020))



<a name="10.3.1"></a>
## [10.3.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.3.0...v10.3.1) (2018-10-05)


### Bug Fixes

* **summitbanner:** display only for some subsidiaries ([5ca4ee0](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5ca4ee0))
* remove border top of the summit banner ([0ec9bbb](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0ec9bbb))
* update gitignore file ([161ea70](https://github.com/ovh-ux/ovh-manager-dedicated/commit/161ea70))



<a name="10.3.0"></a>
# [10.3.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.2.2...v10.3.0) (2018-10-03)


### Bug Fixes

* apply eslint rules ([3acd4a5](https://github.com/ovh-ux/ovh-manager-dedicated/commit/3acd4a5))
* remove unused makefile ([a865245](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a865245))
* **eslint:** add WEBPACK_ENV eslint env var ([1cabc2a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1cabc2a))
* update license file ([9c423eb](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9c423eb))
* **cdn:** fix quota order error ([a9c1cf2](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a9c1cf2))
* **eslint:** update configuration ([f882883](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f882883))
* **i18n:** submit / retrieve (summit) ([71367a8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/71367a8))
* **license:** fix license spla add modal ([c5a54d4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c5a54d4))
* **otrs:** add translations ([9ce0eb7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9ce0eb7))
* **style:** fix lint ([2da2fdc](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2da2fdc))
* **webpack:** disable yarn test ([252b94a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/252b94a))
* **webpack:** fix broken ui-angular import ([5aeaeb4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5aeaeb4))


### Features

* **billing.termination:** Add new reasons ([6a6207a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6a6207a))
* **configuration:** added banner for Summit ([1e6b757](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1e6b757))
* **us:** activate agora order for veeam backup ([e5fa081](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e5fa081))
* **webpack:** add module exchange ([45d9986](https://github.com/ovh-ux/ovh-manager-dedicated/commit/45d9986))



<a name="10.2.2"></a>
## [10.2.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.2.1...v10.2.2) (2018-10-02)


### Bug Fixes

* **i18n:** submit / retrieve (summit) ([dec0e10](https://github.com/ovh-ux/ovh-manager-dedicated/commit/dec0e10))


### Features

* **configuration:** added banner for Summit ([be0ef05](https://github.com/ovh-ux/ovh-manager-dedicated/commit/be0ef05))



<a name="10.2.1"></a>
## [10.2.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.2.0...v10.2.1) (2018-09-25)


### Bug Fixes

* fix accent display ([f193a8e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f193a8e))
* **billing:** fix expiration date display ([e0e37fe](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e0e37fe))
* fix after review ([2bef5e6](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2bef5e6))
* **us:** disable veeam backup agora order for US temporarly ([be2caf8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/be2caf8))


### Features

* **us:** activate veeam backup ([2aec1d5](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2aec1d5))



<a name="10.2.0"></a>
# [10.2.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.1.3...v10.2.0) (2018-09-20)


### Bug Fixes

* bills export to csv does not work ([c41aee3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c41aee3))
* invalid guide links ([c99e29f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c99e29f))


### Features

* **dedicatedcloud.datacenter.host.order:** added help message ([f76adc4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f76adc4))



<a name="10.1.3"></a>
## [10.1.3](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.1.2...v10.1.3) (2018-09-18)


### Bug Fixes

* **us:** switch ovh.us to us.ovhcloud.com ([ac14a39](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ac14a39))
* **us:** switch ovhcloud.com to us.ovhcloud.com ([821d640](https://github.com/ovh-ux/ovh-manager-dedicated/commit/821d640))



<a name="10.1.2"></a>
## [10.1.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.1.1...v10.1.2) (2018-09-17)


### Bug Fixes

* **billing.autorenew:** prevent renewal&resiliation for all ([bf5c55c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/bf5c55c))



<a name="10.1.1"></a>
## [10.1.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.1.0...v10.1.1) (2018-09-11)


### Bug Fixes

* **billing.terminate:** add warning about termination ([222e2f4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/222e2f4))
* **license.detail:** apply tag-pair rule on dd element ([e9d0cb1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e9d0cb1))
* **package:** fix ui-kit versions ([8a435c8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8a435c8))


### Features

* **billing.terminate:** next steps confirm termination ([938911f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/938911f))



<a name="10.1.0"></a>
# [10.1.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.0.10...v10.1.0) (2018-09-06)


### Bug Fixes

* enable testing branch for ovh-ui-angular ([d32f654](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d32f654))
* **billing.ovhAccount:** missing translation ([e836df0](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e836df0))
* **billing.ovhAccount:** translation typo ([5c764c6](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5c764c6))
* **dedicated server:** alert background color fix ([c96d9f3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c96d9f3))
* **i18n:** missing translation ([6d35ad7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6d35ad7))
* **pcc operation:** re-enable operation execution date change ([01b74e5](https://github.com/ovh-ux/ovh-manager-dedicated/commit/01b74e5))
* set new ui-angular version ([705880b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/705880b))


### Features

* **billing.autorenew:** SMS pack menu item redirects to renewal page ([c399b5f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c399b5f))



<a name="10.0.10"></a>
## [10.0.10](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.0.9...v10.0.10) (2018-08-24)


### Bug Fixes

* **language:** default and fallback languages ([#602](https://github.com/ovh-ux/ovh-manager-dedicated/issues/602)) ([4f8c3d2](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4f8c3d2))



<a name="10.0.9"></a>
## [10.0.9](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.0.8...v10.0.9) (2018-08-23)


### Bug Fixes

* **billing.debt:** active debt with todoAmount ([bc8a2bc](https://github.com/ovh-ux/ovh-manager-dedicated/commit/bc8a2bc))



<a name="10.0.8"></a>
## [10.0.8](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.0.7...v10.0.8) (2018-08-22)


### Bug Fixes

* **billing.debt:** pay all debt response ([2f2b4e3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2f2b4e3))



<a name="10.0.7"></a>
## [10.0.7](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.0.6...v10.0.7) (2018-08-22)



<a name="10.0.6"></a>
## [10.0.6](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.0.5...v10.0.6) (2018-08-22)


### Bug Fixes

* **license:** fix license type in api route ([b007e4f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b007e4f))
* **translation:** transation parameters sanitization ([b066320](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b066320))


### Features

* **billing.autorenew:** autoDisabled is now the same as manual ([9e13afd](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9e13afd))



<a name="10.0.5"></a>
## [10.0.5](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.0.4...v10.0.5) (2018-08-22)


### Bug Fixes

* **build:** smarttage integration ([6bb1516](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6bb1516))



<a name="10.0.4"></a>
## [10.0.4](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.0.3...v10.0.4) (2018-08-21)


### Bug Fixes

* **autorenew:** allow only terminate option for oneShot private database ([6f35cdb](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6f35cdb))
* **autorenew:** clean private database termination ([4ce2f17](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4ce2f17))
* **license agora order:** set plan code for plesk powerpack option ([b717631](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b717631))



<a name="10.0.3"></a>
## [10.0.3](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.0.2...v10.0.3) (2018-08-17)


### Bug Fixes

* **cache-rules-loading:** infinite loading ([03bef3d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/03bef3d))
* **cache-rules-loading:** infinite loading ([9a865ee](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9a865ee))
* **cache-rules-loading:** infinite loading ([14def55](https://github.com/ovh-ux/ovh-manager-dedicated/commit/14def55))
* **cache-rules-loading:** infinite loading ([e66e973](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e66e973))



<a name="10.0.2"></a>
## [10.0.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.0.1...v10.0.2) (2018-08-17)


### Bug Fixes

* **sidebar-menu:** add cloud project url to actions menu popup ([64bba97](https://github.com/ovh-ux/ovh-manager-dedicated/commit/64bba97))



<a name="10.0.1"></a>
## [10.0.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v10.0.0...v10.0.1) (2018-08-16)


### Bug Fixes

* **billing.debt:** pay debt return ([0074f42](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0074f42))



<a name="10.0.0"></a>
# [10.0.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.7.10...v10.0.0) (2018-08-14)


### Bug Fixes

* **billing.debt:** remove body request for debt payment ([8e167de](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8e167de))



<a name="9.7.10"></a>
## [9.7.10](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.7.9...v9.7.10) (2018-08-14)


### Bug Fixes

* **account.billing:** billing menu inactive in EU ([9c0ed6c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9c0ed6c))



<a name="9.7.9"></a>
## [9.7.9](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.7.8...v9.7.9) (2018-08-10)


### Bug Fixes

* **license order:** fix missing itemId ([c089699](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c089699))



<a name="9.7.8"></a>
## [9.7.8](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.7.7...v9.7.8) (2018-08-10)


### Bug Fixes

* **dedicatedcloud.user.passwword:** disable confirm button when reseting ([b1a3886](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b1a3886))



<a name="9.7.7"></a>
## [9.7.7](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.7.6...v9.7.7) (2018-08-09)


### Bug Fixes

* **datastores:** fix host order modal overflow ([5698fc6](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5698fc6))
* **license:** fix missing ip param in agora license order ([b221f20](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b221f20))
* **users:** fix invalid token validator value in users table ([472b0ae](https://github.com/ovh-ux/ovh-manager-dedicated/commit/472b0ae))



<a name="9.7.6"></a>
## [9.7.6](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.7.5...v9.7.6) (2018-08-09)


### Bug Fixes

* **service-expiration:** hide link on service expiration for US ([04140d8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/04140d8))
* **service.expiration.date:** add missing $ctrl ([d39ed3f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d39ed3f))



<a name="9.7.5"></a>
## [9.7.5](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.7.4...v9.7.5) (2018-08-09)


### Bug Fixes

* **dedicated.server:** edit display name for non-us customer ([2bebcaa](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2bebcaa))
* **server:** display subscription contacts for non US only ([2b7a6a5](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2b7a6a5))
* **service-expiration:** display date for US ([097fb0c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/097fb0c))



<a name="9.7.4"></a>
## [9.7.4](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.7.3...v9.7.4) (2018-08-08)


### Bug Fixes

* **datastores:** fix order datastore action ([b4123e3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b4123e3))



<a name="9.7.3"></a>
## [9.7.3](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.7.2...v9.7.3) (2018-08-07)


### Bug Fixes

* **deps:** bump ovh-api-services to v3.12.1 ([4f47966](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4f47966))



<a name="9.7.2"></a>
## [9.7.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.7.1...v9.7.2) (2018-08-07)


### Bug Fixes

* **dedicatedcloud.user.edit:** update switch template ([0cb7bd3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0cb7bd3))



<a name="9.7.1"></a>
## [9.7.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.7.0...v9.7.1) (2018-08-07)


### Bug Fixes

* **billing.autorenew:** update payment.mean state ([68d521d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/68d521d))



<a name="9.7.0"></a>
# [9.7.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.6.22...v9.7.0) (2018-08-07)


### Bug Fixes

* text on edit dedicated service popup overflows out of modal ([#485](https://github.com/ovh-ux/ovh-manager-dedicated/issues/485)) ([84e3760](https://github.com/ovh-ux/ovh-manager-dedicated/commit/84e3760)), closes [#MFRWW-691](https://github.com/ovh-ux/ovh-manager-dedicated/issues/MFRWW-691)
* **autorenew:** fix redirection to billing history ([9e8cc78](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9e8cc78))
* **billing:** fix responsible tabs content ([638e8d9](https://github.com/ovh-ux/ovh-manager-dedicated/commit/638e8d9))
* **billing:** use  instead of modal state for postal options ([67bcdd8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/67bcdd8))
* **billing history:** fix after review and add error alert ([43fed9f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/43fed9f))
* **billing history:** fix get debtAccount in case of 404 from API ([a3974aa](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a3974aa))
* **billing payg:** fix ui-kit versions ([38fb327](https://github.com/ovh-ux/ovh-manager-dedicated/commit/38fb327))
* **billing payg:** remove forecast calculation ([177beb1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/177beb1))
* **billing.autorenew:** remove menu for SMS services ([de35462](https://github.com/ovh-ux/ovh-manager-dedicated/commit/de35462))
* **billing.payasyougo:** handle empty route.url and route.path ([43b4142](https://github.com/ovh-ux/ovh-manager-dedicated/commit/43b4142))
* code review ([5ff35bd](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5ff35bd))
* fix typo in package.json ([6881654](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6881654))
* yarn.lock ([74b41c7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/74b41c7))
* **billing.paymentmethod.add:** upgrade expiration date list ([d5430ec](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d5430ec))
* **cache-rules-loading:** infinite loading ([#468](https://github.com/ovh-ux/ovh-manager-dedicated/issues/468)) ([e597a54](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e597a54))
* **dedicated cloud user:** replace table with oui-datagrid ([#469](https://github.com/ovh-ux/ovh-manager-dedicated/issues/469)) ([55f64b3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/55f64b3))
* **license:** add windows server license missing trads ([337c53b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/337c53b))
* **pcc operation:** replace table with oui-datagrid ([#470](https://github.com/ovh-ux/ovh-manager-dedicated/issues/470)) ([4874d61](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4874d61))
* **server:** update sd dashboard to use ui-kit ([#266](https://github.com/ovh-ux/ovh-manager-dedicated/issues/266)) ([9b0589f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9b0589f)), closes [#416](https://github.com/ovh-ux/ovh-manager-dedicated/issues/416) [#337](https://github.com/ovh-ux/ovh-manager-dedicated/issues/337)
* **yarn:** update some package version ([e614b0b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e614b0b))


### Features

* **billing:** enable pay as you go section for US only ([9a8ccb6](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9a8ccb6))
* **billing payg:** add pay as you go section content ([b3c54e0](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b3c54e0))
* **chore:** yarn upgrade ovh-api-services ([9927a1c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9927a1c))



<a name="9.6.22"></a>
## [9.6.22](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.6.21...v9.6.22) (2018-08-06)


### Bug Fixes

* **account.user.advanced:** update switch template ([7f2e881](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7f2e881))



<a name="9.6.21"></a>
## [9.6.21](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.6.20...v9.6.21) (2018-08-03)


### Bug Fixes

* **server.installation:** can add OVH template again ([ea00116](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ea00116))



<a name="9.6.20"></a>
## [9.6.20](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.6.19...v9.6.20) (2018-08-03)


### Bug Fixes

* **billing.history:** sort billing by date asc ([b8dd4e9](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b8dd4e9))



<a name="9.6.19"></a>
## [9.6.19](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.6.18...v9.6.19) (2018-08-02)


### Bug Fixes

* **billing.autorenew.update:** can deactivate AutoRenew using update dialog ([bc34e6c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/bc34e6c))



<a name="9.6.18"></a>
## [9.6.18](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.6.17...v9.6.18) (2018-08-01)


### Bug Fixes

* **dedicatedcloud.datacenter:** display host datagrid ([74c0710](https://github.com/ovh-ux/ovh-manager-dedicated/commit/74c0710))



<a name="9.6.17"></a>
## [9.6.17](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.6.16...v9.6.17) (2018-08-01)


### Bug Fixes

* **billing.autorenew:** display undo cancellation menu item correctly ([9ef244b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9ef244b))
* **billing.autorenew:** undoing cancellation banner will now display correctly ([b40dfaf](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b40dfaf))



<a name="9.6.16"></a>
## [9.6.16](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.6.15...v9.6.16) (2018-07-31)


### Bug Fixes

* **billing.autorenew:** added back menu item ([5be9d6e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5be9d6e))



<a name="9.6.15"></a>
## [9.6.15](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.6.14...v9.6.15) (2018-07-31)


### Bug Fixes

* **css:** action dropdown menu does not work in mobile ([cba63d6](https://github.com/ovh-ux/ovh-manager-dedicated/commit/cba63d6)), closes [#MFRWW-753](https://github.com/ovh-ux/ovh-manager-dedicated/issues/MFRWW-753)



<a name="9.6.14"></a>
## [9.6.14](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.6.13...v9.6.14) (2018-07-30)


### Bug Fixes

* **billing.mean.add:** fix adding credit card and paypal account ([6777038](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6777038))



<a name="9.6.13"></a>
## [9.6.13](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.6.12...v9.6.13) (2018-07-30)


### Bug Fixes

* **billing:** hide useless actions for MX plan and change label ([903a805](https://github.com/ovh-ux/ovh-manager-dedicated/commit/903a805))
* **billing.renew:** have two buttons instead of one for service paying ([a3ffa6e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a3ffa6e))
* **renew:** autorenew cancellation wording & character issues ([de9d82e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/de9d82e))


### Features

* **billing:** autorenew service in debt warning ([c571c27](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c571c27))
* **billing.autorenew:** add dialog before paying service while having a debt ([4b8fc7a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4b8fc7a))
* **billing.mean.add:** sepa fields separated for France only ([9b2521b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9b2521b))
* **renew:** allow undoing cancellations ([977e6c0](https://github.com/ovh-ux/ovh-manager-dedicated/commit/977e6c0))



<a name="9.6.12"></a>
## [9.6.12](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.6.11...v9.6.12) (2018-07-25)



<a name="9.6.11"></a>
## [9.6.11](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.6.10...v9.6.11) (2018-07-19)


### Bug Fixes

* use heading attribut on oui-back-button ([4f10f8b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4f10f8b)), closes [/github.com/ovh-ux/ovh-ui-angular/commit/5ddc0ef2edba5898b97fcca0a73124d369432778#diff-c9aba9326a8bbfe4300255981d64e080R12](https://github.com//github.com/ovh-ux/ovh-ui-angular/commit/5ddc0ef2edba5898b97fcca0a73124d369432778/issues/diff-c9aba9326a8bbfe4300255981d64e080R12)
* **license:** fix upgrade button redirection ([#425](https://github.com/ovh-ux/ovh-manager-dedicated/issues/425)) ([9b1f311](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9b1f311))


### Features

* **billing:** add more information in terminate confirmation message ([0c68fa7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0c68fa7))
* **navbar:** translations for navbar placeholder ([#437](https://github.com/ovh-ux/ovh-manager-dedicated/issues/437)) ([0153ff7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0153ff7))
* **sidebar:** add sidebar order tracking ([#410](https://github.com/ovh-ux/ovh-manager-dedicated/issues/410)) ([307a7d5](https://github.com/ovh-ux/ovh-manager-dedicated/commit/307a7d5))



<a name="9.6.10"></a>
## [9.6.10](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.6.9...v9.6.10) (2018-07-11)


### Bug Fixes

* **account:** remove marketing consent optin for US ([ea4bcf0](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ea4bcf0))
* **dedicated server intervention:** show empty datagrid if expired ([60cdbfc](https://github.com/ovh-ux/ovh-manager-dedicated/commit/60cdbfc))



<a name="9.6.9"></a>
## [9.6.9](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.6.8...v9.6.9) (2018-07-04)


### Bug Fixes

* **credit:** use new API attribute ([60e38cc](https://github.com/ovh-ux/ovh-manager-dedicated/commit/60e38cc))



<a name="9.6.8"></a>
## [9.6.8](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.6.7...v9.6.8) (2018-07-04)


### Bug Fixes

* **billing.autorenew:** display autorenew activation button again ([b32a3ff](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b32a3ff))



<a name="9.6.7"></a>
## [9.6.7](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.6.6...v9.6.7) (2018-07-04)


### Bug Fixes

* **otrs:** upgrade otrs version ([a39b8a3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a39b8a3))



<a name="9.6.6"></a>
## [9.6.6](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.6.5...v9.6.6) (2018-06-21)


### Bug Fixes

* **dedicated:server:** renewal date for autorenew ([d3c8ea3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d3c8ea3))
* **dedicated.server:** Display renewal date for US ([3f652f1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/3f652f1))
* **pcc:** replace table with datagrid in datastore section ([#412](https://github.com/ovh-ux/ovh-manager-dedicated/issues/412)) ([41e4d50](https://github.com/ovh-ux/ovh-manager-dedicated/commit/41e4d50))
* **pcc dc host:** replace table with datagrid ([#409](https://github.com/ovh-ux/ovh-manager-dedicated/issues/409)) ([c221d91](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c221d91))


### Features

* **billing:** add confirm terminate for all subsidiaries ([3153a61](https://github.com/ovh-ux/ovh-manager-dedicated/commit/3153a61))
* **navbar:** add new navbar notifications ([f9877f0](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f9877f0))
* **oui-angular:** add translations for oui components ([7dadfcf](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7dadfcf))



<a name="9.6.5"></a>
## [9.6.5](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.6.4...v9.6.5) (2018-06-19)


### Bug Fixes

* **dedicated:server:** ipmi session for resellers ([e219d06](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e219d06))



<a name="9.6.4"></a>
## [9.6.4](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.6.3...v9.6.4) (2018-06-19)


### Bug Fixes

* **dedicated:server:** ipmi geolocation ip for resellers only ([5e7247c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5e7247c))
* **dedicated:server:** ipmi IP check in US ([8b0b545](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8b0b545))
* **dedicated:server:** ipmi IP check in US CR ([015e661](https://github.com/ovh-ux/ovh-manager-dedicated/commit/015e661))



<a name="9.6.3"></a>
## [9.6.3](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.6.2...v9.6.3) (2018-06-18)


### Bug Fixes

* won't display autorenew banner and input when not needed ([#414](https://github.com/ovh-ux/ovh-manager-dedicated/issues/414)) ([d80abc1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d80abc1))



<a name="9.6.2"></a>
## [9.6.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.6.1...v9.6.2) (2018-06-13)



<a name="9.6.1"></a>
## [9.6.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.6.0...v9.6.1) (2018-06-12)


### Bug Fixes

* set IP title in order action menu ([9fa00e0](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9fa00e0))


### Features

* **ip order:** access ip agora order through a dedicated state ([45e512a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/45e512a))



<a name="9.6.0"></a>
# [9.6.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.5.15...v9.6.0) (2018-06-07)


### Bug Fixes

* **ip spla order:** minor code review changes ([f544c60](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f544c60))
* **order spla us:** fix indent ([280fdcd](https://github.com/ovh-ux/ovh-manager-dedicated/commit/280fdcd))
* **spla order:** close model on submit order ([3fc186d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/3fc186d))
* **spla order us:** code review ([7918e7b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7918e7b))
* **user account:** base url ([c008234](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c008234))


### Features

* **agreement:** add more context to gdpr agreements ([6a4b133](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6a4b133))
* **order spla:** add spla order for us region ([c3e377c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c3e377c))
* **order spla:** wip ([0294ef8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0294ef8))



<a name="9.5.15"></a>
## [9.5.15](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.5.14...v9.5.15) (2018-06-06)


### Bug Fixes

* **menu:** re-enable nas calls ([90ad703](https://github.com/ovh-ux/ovh-manager-dedicated/commit/90ad703))



<a name="9.5.14"></a>
## [9.5.14](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.5.13...v9.5.14) (2018-06-05)


### Bug Fixes

* **order link:** fix US order link for vrack ([64b3861](https://github.com/ovh-ux/ovh-manager-dedicated/commit/64b3861))



<a name="9.5.13"></a>
## [9.5.13](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.5.12...v9.5.13) (2018-06-05)


### Bug Fixes

* **order:** set good order funnel url ([15a9690](https://github.com/ovh-ux/ovh-manager-dedicated/commit/15a9690))



<a name="9.5.12"></a>
## [9.5.12](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.5.11...v9.5.12) (2018-06-04)


### Bug Fixes

* **ipmi:** hide sol for US ([0757e4b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0757e4b))
* **navbar:** fix navbar title ([7867307](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7867307))


### Features

* **agreement:** add gdpr trads ([6f9faa6](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6f9faa6))



<a name="9.5.11"></a>
## [9.5.11](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.5.10...v9.5.11) (2018-06-04)


### Bug Fixes

* **dedicated server:** hide vrack bandwidth cancel ([e67bc68](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e67bc68))



<a name="9.5.10"></a>
## [9.5.10](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.5.9...v9.5.10) (2018-06-01)


### Bug Fixes

* **app:** Disable ovh-tasks ([0beca6c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0beca6c))



<a name="9.5.9"></a>
## [9.5.9](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.5.8...v9.5.9) (2018-06-01)


### Bug Fixes

* **nas:** remove dupe in menu ([ad3f014](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ad3f014))



<a name="9.5.8"></a>
## [9.5.8](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.5.7...v9.5.8) (2018-06-01)


### Bug Fixes

* remove unecessary translations files ([271f404](https://github.com/ovh-ux/ovh-manager-dedicated/commit/271f404))
* **menu:** Remove nas calls ([b0aef92](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b0aef92))



<a name="9.5.7"></a>
## [9.5.7](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.5.6...v9.5.7) (2018-05-30)


### Bug Fixes

* **dedicated:server:** close reboot modal ([788744e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/788744e))
* **navbar:** remove labs URL ([0ac72dd](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0ac72dd))



<a name="9.5.6"></a>
## [9.5.6](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.5.5...v9.5.6) (2018-05-25)


### Bug Fixes

* **user:** Disable consent for US ([650fbdc](https://github.com/ovh-ux/ovh-manager-dedicated/commit/650fbdc))



<a name="9.5.5"></a>
## [9.5.5](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.5.4...v9.5.5) (2018-05-25)



<a name="9.5.4"></a>
## [9.5.4](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.5.3...v9.5.4) (2018-05-25)


### Bug Fixes

* **useraccount:** fix account creation link ([57f6871](https://github.com/ovh-ux/ovh-manager-dedicated/commit/57f6871))
* **useraccount:** minor code changes ([5bd5d99](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5bd5d99))
* **useraccount:** remove redirectTo in account creation link ([fddc752](https://github.com/ovh-ux/ovh-manager-dedicated/commit/fddc752))



<a name="9.5.3"></a>
## [9.5.3](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.5.2...v9.5.3) (2018-05-25)


### Bug Fixes

* **cdn domain:** fix stats chart labels ([274acd7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/274acd7))
* **ipmi:** fix sol guide ([7fec97e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7fec97e))
* **ipmi:** minor code review changes ([1fe4d92](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1fe4d92))
* match updated API scheme ([80fa0c6](https://github.com/ovh-ux/ovh-manager-dedicated/commit/80fa0c6))
* removed mandatory text ([74ca18b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/74ca18b))


### Features

* added checkbox for commercial communications ([7508db3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7508db3))



<a name="9.5.2"></a>
## [9.5.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.5.1...v9.5.2) (2018-05-24)


### Bug Fixes

* **translations:** en_ASIA language now display the right language ([f457e74](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f457e74))


### Features

* update otrs module ([d5bff3e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d5bff3e))



<a name="9.5.1"></a>
## [9.5.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.5.0...v9.5.1) (2018-05-23)



<a name="9.5.0"></a>
# [9.5.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.4.1...v9.5.0) (2018-05-22)


### Bug Fixes

* add EN translations for US debt payment ([89e9d95](https://github.com/ovh-ux/ovh-manager-dedicated/commit/89e9d95))
* add link to delete modal ([7597689](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7597689))
* fix ssl add template url ([5ad4433](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5ad4433))
* fix typo ([63137f3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/63137f3))
* fix typo after merge ([93e9b5d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/93e9b5d))
* **cdn dedicated ssl:** reload parent state successful operations ([09fb3b3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/09fb3b3))
* **cdn dedicated ssl:** use type on oui-modal to display warning ([a2e1708](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a2e1708))
* **cdn dedicated ssl add:** use type on oui-modal to display warning ([c6d4a12](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c6d4a12))
* upgrade ovh-api-services ([2e94748](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2e94748))
* **cdn dedicated ssl generate:** use oui-modal type to display warning ([98ab92b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/98ab92b))
* upgrade ovh-api-services version ([dc1d23b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/dc1d23b))
* **cdn dedicated ssl update:** use oui-modal type to display warning ([1949d91](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1949d91))
* **dedicated:server:** Remove useless tabs for US ([d01fe5b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d01fe5b))
* **i18n:** set some english translations ([6f5abb4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6f5abb4))
* **user rights:** code review ([c0e3409](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c0e3409))
* **user rights:** replace table with oui-datagrid ([94fa160](https://github.com/ovh-ux/ovh-manager-dedicated/commit/94fa160))


### Features

* **dedicatedcloud:** use ui-state for confirm and terminate a pcc ([06390e3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/06390e3))
* **dedicatedcloud terminate:** set termination into modal layout state ([472b785](https://github.com/ovh-ux/ovh-manager-dedicated/commit/472b785))
* **dedicatedcloud terminate:** wip confirm modal ([88b66b8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/88b66b8))
* **pcc terminate:** add route ([06bbd5c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/06bbd5c))



<a name="9.4.1"></a>
## [9.4.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.4.0...v9.4.1) (2018-05-18)


### Bug Fixes

* **ipfo order:** minor html fix ([458d233](https://github.com/ovh-ux/ovh-manager-dedicated/commit/458d233))



<a name="9.4.0"></a>
# [9.4.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.3.6...v9.4.0) (2018-05-18)


### Bug Fixes

* **ipfo order:** fix broken selector ([1293cb8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1293cb8))
* **sidebar:** add vrack order item ([6245b42](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6245b42))
* **trads:** fix broken trads ([a7b2e39](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a7b2e39))
* add vrackUrl const into grunt ngConstant prod task ([8969d27](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8969d27))


### Features

* **vrack:** add sidebar menu item ([278b5fd](https://github.com/ovh-ux/ovh-manager-dedicated/commit/278b5fd))



<a name="9.3.6"></a>
## [9.3.6](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.3.5...v9.3.6) (2018-05-16)


### Bug Fixes

* **billing:sla:** Wrong template path ([c5cdbf5](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c5cdbf5))



<a name="9.3.5"></a>
## [9.3.5](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.3.4...v9.3.5) (2018-05-15)


### Bug Fixes

* display message for enterprise customer ([4d20e99](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4d20e99))



<a name="9.3.4"></a>
## [9.3.4](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.3.3...v9.3.4) (2018-05-15)


### Bug Fixes

* add EN translations for US debt payment ([71556cf](https://github.com/ovh-ux/ovh-manager-dedicated/commit/71556cf))
* remove unecessary span with non existing translation key ([005e98d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/005e98d))



<a name="9.3.3"></a>
## [9.3.3](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.3.2...v9.3.3) (2018-05-14)


### Bug Fixes

* **autorenew:** fix missing dependency injection ([6fe6d59](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6fe6d59))
* **license:** fix spla active state ([2dd4df4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2dd4df4))
* re-enable us debt message ([5956257](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5956257))
* use ngTranslate in US debt pay link ([b018254](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b018254))



<a name="9.3.2"></a>
## [9.3.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.3.1...v9.3.2) (2018-05-11)



<a name="9.3.1"></a>
## [9.3.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.3.0...v9.3.1) (2018-05-11)


### Bug Fixes

* **guides:** update links for all languages ([093cd7e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/093cd7e))



<a name="9.3.0"></a>
# [9.3.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.16...v9.3.0) (2018-05-09)


### Bug Fixes

* **account:** improve layout ([74d418f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/74d418f))
* **account billing:** replace i18n with angular-translate ([c9ccca0](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c9ccca0))
* **account billing autorenew:** replace i18n with angular-translate ([c063e89](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c063e89))
* **account billing credits:** wrong translation ([c5b485e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c5b485e))
* **account billing mean:** replace i18n with angular-translate ([19b7302](https://github.com/ovh-ux/ovh-manager-dedicated/commit/19b7302))
* **account user:** replace i18n with angular-translate ([6c2f323](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6c2f323))
* **account user contacts:** replace i18n with angular-translate ([0c412ee](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0c412ee))
* **account user contacts:** replace i18n with angular-translate ([3c8cec9](https://github.com/ovh-ux/ovh-manager-dedicated/commit/3c8cec9))
* **account user otrs:** replace i18n with angular-translate ([5092900](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5092900))
* **account user password:** replace i18n with angular-translate ([79d7e51](https://github.com/ovh-ux/ovh-manager-dedicated/commit/79d7e51))
* **account user security:** replace i18n with angular-translate ([be4aa8f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/be4aa8f))
* **account user security:** replace i18n with angular-translate ([729751a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/729751a))
* **chore:** fix translation parts loading ([58026c3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/58026c3))
* **components:** fix duration filter translation ([4e1bbb9](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4e1bbb9))
* **contact-services:** fix buttons translation ([a0bea11](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a0bea11))
* **contracts:** fix translation ([3cead60](https://github.com/ovh-ux/ovh-manager-dedicated/commit/3cead60))
* **credits:** fix translation ([e54f001](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e54f001))
* **datastore:** fix tooltip bindings ([87fb3a7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/87fb3a7))
* **date range:** fix translation ([4d2ce79](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4d2ce79))
* **dedicated cloud security options:** missing translation ([e63bceb](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e63bceb))
* **dedicated cloud user:** missing translation ([95874c8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/95874c8))
* **dedicated housing dashboard:** remove unused trad ([8976094](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8976094))
* **dedicated housing task:** remove unused trad ([765f0e7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/765f0e7))
* **dedicated nas details:** missing  injection ([fe5e41c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/fe5e41c))
* **dedicated nas details:** syntax error ([86a0641](https://github.com/ovh-ux/ovh-manager-dedicated/commit/86a0641))
* **dedicated nas details partition:** translation ([e2bf59f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e2bf59f))
* **dedicated server ftp backup:** add oui-action-menu ([8193de1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8193de1))
* **dedicated server task:** remove unused trad ([f5f74c2](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f5f74c2))
* **dedicated server usb-storage:** missing translation ([f4451ce](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f4451ce))
* **dedicatedcloud dashboard:** fix tooltip placement ([27df441](https://github.com/ovh-ux/ovh-manager-dedicated/commit/27df441))
* **dedicatedcloud security:** missing connection translation ([c389cd7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c389cd7))
* **dedicatedcloud security:** missing session-timeout translation ([b1d28b8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b1d28b8))
* **dns:** replace table with oui-datagrid ([b9cfe77](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b9cfe77))
* **i18n:** batch fix invalid ng-bindings ([a6bf654](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a6bf654))
* **i18n:** fix some translate bindings ([e2142c9](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e2142c9))
* **i18n:** fix typo ([24acdbe](https://github.com/ovh-ux/ovh-manager-dedicated/commit/24acdbe))
* **i18n:** fix wizard cancel button ([999dfa5](https://github.com/ovh-ux/ovh-manager-dedicated/commit/999dfa5))
* **i18n:** fix wizard confirm button ([8edf80d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8edf80d))
* **i18n:** fix wizard title ([467a633](https://github.com/ovh-ux/ovh-manager-dedicated/commit/467a633))
* **i18n:** remove angular filter in translations ([874201d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/874201d))
* **i18n:** replace i18n with angular translate ([a000546](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a000546))
* **i18n:** replace translator tr with angular translate ([aeee54d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/aeee54d))
* **i18n:** replace translator tr with angular-translate ([c09a79e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c09a79e))
* **i18n:** replace trpl with angular translate for bandwidth order ([acabba9](https://github.com/ovh-ux/ovh-manager-dedicated/commit/acabba9))
* **i18n:** replace trpl with angular translate for ip section ([7204a95](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7204a95))
* **i18n:** replace trpl with ng pluralize ([f0296ca](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f0296ca))
* **i18n:** replace trpl with pluralize in cdn stats section ([48c3fa8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/48c3fa8))
* **interventions:** replace table with oui-datagrid ([89cac60](https://github.com/ovh-ux/ovh-manager-dedicated/commit/89cac60))
* **ip:** replace i18n with angular-translate ([cb8341e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/cb8341e))
* **ip:** replace i18n with angular-translate ([716e35e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/716e35e))
* **ip:** replace scope.tr with angular-translate ([44a97eb](https://github.com/ovh-ux/ovh-manager-dedicated/commit/44a97eb))
* **licence:** display public licence id instead of internal one ([817374a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/817374a))
* **licence:** display public licence id instead of internal one in list ([a8f6a2c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a8f6a2c))
* **monitoring:** fix monitoring enable modal ([cee31fd](https://github.com/ovh-ux/ovh-manager-dedicated/commit/cee31fd))
* **navbar:** language button position and format ([368fe1f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/368fe1f))
* ovh-api-services version ([0844f15](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0844f15))
* **orders:** fix missing translations ([5dccf57](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5dccf57))
* **payment mean:** fix translation ([ca27827](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ca27827))
* **pcc operations:** fix createdBy label ([6ac00fc](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6ac00fc))
* **ssh:** fix ssh key display ([8987469](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8987469))
* replace i18n with angular-translate ([71d387c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/71d387c)), closes [ovh-ux/ovh-utils-angular#16](https://github.com/ovh-ux/ovh-utils-angular/issues/16)
* **translate:** fix oui-column ([3180fb7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/3180fb7))
* merging error ([2ac0824](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2ac0824))
* **translation:** fix missing license_loading trad ([22d4632](https://github.com/ovh-ux/ovh-manager-dedicated/commit/22d4632))
* **translations:** user security section ([94921dc](https://github.com/ovh-ux/ovh-manager-dedicated/commit/94921dc))
* **translator:** remove some i18n references, fix translate bindings ([3163cea](https://github.com/ovh-ux/ovh-manager-dedicated/commit/3163cea))
* option only for FR accounts ([55fdf00](https://github.com/ovh-ux/ovh-manager-dedicated/commit/55fdf00))
* pr feedback ([82dec10](https://github.com/ovh-ux/ovh-manager-dedicated/commit/82dec10))
* remove old tr method ([f1d32f0](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f1d32f0))
* replace i18n with angular-translate ([d668a98](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d668a98))
* SSH menu now available everywhere as before ([d5b4d51](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d5b4d51))


### Features

* deleted "User Subscriptions" section ([4d65fa8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4d65fa8))
* **billing:** add option to set paper or paperless for bills ([12b766e](https://github.com/ovh-ux/ovh-manager-dedicated/commit/12b766e))
* **exchange:** bump exchange module to 8.0.0 ([252b6ef](https://github.com/ovh-ux/ovh-manager-dedicated/commit/252b6ef))
* **i18n:** retrieve translations ([667e088](https://github.com/ovh-ux/ovh-manager-dedicated/commit/667e088))
* **translations:** replace {\d} by {{t}} when xml -> json ([82e5027](https://github.com/ovh-ux/ovh-manager-dedicated/commit/82e5027))



<a name="9.2.16"></a>
## [9.2.16](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.15...v9.2.16) (2018-05-03)


### Bug Fixes

* **modal:** remove aria-hidden and tab-index ([e48e50c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e48e50c))



<a name="9.2.15"></a>
## [9.2.15](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.14...v9.2.15) (2018-05-03)


### Bug Fixes

* **interventions:** add missing serviceName param ([b32d0fb](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b32d0fb))



<a name="9.2.14"></a>
## [9.2.14](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.13...v9.2.14) (2018-04-26)


### Bug Fixes

* display pay debt button only when dueAmount is more than 0 in US ([7ddaf4f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7ddaf4f))
* display publicLabel when no description on payment method ([47c933c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/47c933c))
* fix after review ([954e4e6](https://github.com/ovh-ux/ovh-manager-dedicated/commit/954e4e6))
* fix and refactor billing history details view ([eb5ca18](https://github.com/ovh-ux/ovh-manager-dedicated/commit/eb5ca18))
* fix link to state for new payment method ([550da86](https://github.com/ovh-ux/ovh-manager-dedicated/commit/550da86))
* fix payment method label in select ([d63a331](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d63a331))
* fix some trads and remove EU link for US ([31a03bd](https://github.com/ovh-ux/ovh-manager-dedicated/commit/31a03bd))
* package.json and remove unnecessary comments ([cee68a3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/cee68a3))
* pass payment method id in pay debt request ([52d8cdd](https://github.com/ovh-ux/ovh-manager-dedicated/commit/52d8cdd))
* update DEBTACCOUNT_DEBT translation for US test ([2c00d62](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2c00d62))
* upgrade ovh-api-services version ([8c4b472](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8c4b472))


### Features

* **debtaccount:** manage debt for US customers ([431b3c8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/431b3c8))



<a name="9.2.13"></a>
## [9.2.13](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.12...v9.2.13) (2018-04-25)


### Bug Fixes

* display info to the enterprise customer concerning retail prices ([0290db9](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0290db9))
* rename services to v6 and v7 ([f216afd](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f216afd)), closes [ovh-ux/ovh-api-services#68](https://github.com/ovh-ux/ovh-api-services/issues/68)
* use internal state definition instead of initial declaration ([e678a71](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e678a71))
* **billing confirm terminate:** add missing translation key for cpanel ([5ccc6c9](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5ccc6c9))
* **dedicated ml-subscribe:** fix _.some to indexOf ([2cd6665](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2cd6665))
* **dedicatedcloud:** fix after review ([aaf976b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/aaf976b))
* **dedicatedcloud:** fix ml subscribe modal display on user view ([b9a3e4c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b9a3e4c))
* **dedicatedcloud:** remove unecessary translation for ml subscribe ([34fbc7d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/34fbc7d))
* **dedicatedcloud ml subscribe:** fix after review ([43bf071](https://github.com/ovh-ux/ovh-manager-dedicated/commit/43bf071))
* **dedicatedcloud ml subscribe:** remove mock in modal ([67d44f8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/67d44f8))
* **housing tasks:** replace table with oui-datagrid ([c9cf573](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c9cf573))
* **ip:** improve ip organisation table to match ovh oui-kit style ([b87f61c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b87f61c))
* **layout modal:** fix toChilds detection ([deb092f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/deb092f))
* **me-alerts:** fix bad links to billing statements ([539f6ef](https://github.com/ovh-ux/ovh-manager-dedicated/commit/539f6ef))
* **modal layout:** fix unecessary child states applied to layout ([e675707](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e675707))
* **pcc datacenters:** replace table with oui-datagrid ([adae0dc](https://github.com/ovh-ux/ovh-manager-dedicated/commit/adae0dc))
* **pcc datacenters:** tooltip if has discount ([e76c1f4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e76c1f4))
* **server tasks:** replace table with oui-datagrid ([980a8bc](https://github.com/ovh-ux/ovh-manager-dedicated/commit/980a8bc))
* **sidebar:** users management section available in all targets ([c871e7a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c871e7a)), closes [#161](https://github.com/ovh-ux/ovh-manager-dedicated/issues/161)
* **uibmodal stateful:** update stateful modal closing methods ([d0e4c21](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d0e4c21))
* **yarn.lock:** fix ovh-utils-angular version ([64ee416](https://github.com/ovh-ux/ovh-manager-dedicated/commit/64ee416))
* fix after review ([c363375](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c363375))
* fix typo ([b3beaeb](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b3beaeb))
* set link instead of button for .go('^') onClick ([c7900c0](https://github.com/ovh-ux/ovh-manager-dedicated/commit/c7900c0))


### Features

* **dedicatedcloud:** subscribe to ML modal through ui-router ([4b788ce](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4b788ce))
* **dedicatedcloud:** wip - migrate modal to states ([5201f3f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5201f3f))
* handle roles in user tab ([eac1205](https://github.com/ovh-ux/ovh-manager-dedicated/commit/eac1205))



<a name="9.2.12"></a>
## [9.2.12](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.11...v9.2.12) (2018-04-19)


### Bug Fixes

* temporarily remove debt messages for US ([639c738](https://github.com/ovh-ux/ovh-manager-dedicated/commit/639c738))



<a name="9.2.11"></a>
## [9.2.11](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.10...v9.2.11) (2018-04-12)


### Bug Fixes

* **user contracts:** enhance modal layout ([5355502](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5355502))



<a name="9.2.10"></a>
## [9.2.10](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.9...v9.2.10) (2018-04-12)


### Bug Fixes

* **contracts:** closing modal on validate ([32b64a1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/32b64a1))



<a name="9.2.9"></a>
## [9.2.9](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.8...v9.2.9) (2018-04-12)


### Bug Fixes

* **contracts:** wrong modal id ([14140d7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/14140d7))



<a name="9.2.8"></a>
## [9.2.8](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.7...v9.2.8) (2018-04-10)


### Bug Fixes

* **license delete:** display message if already terminating ([4595cdd](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4595cdd))



<a name="9.2.7"></a>
## [9.2.7](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.6...v9.2.7) (2018-04-10)


### Bug Fixes

* **bootstrap fonts path:** copy glyphicons font ([7f6659a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7f6659a))
* **dedicated server:** add HIL DC location ([a564239](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a564239))
* **license order:** replace deprecated loader to oui-spinner ([f023cb5](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f023cb5))


### Features

* **billing:** improve add payment method view ([8166a1d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/8166a1d))
* **i18n:** retrieve translations ([70df3bb](https://github.com/ovh-ux/ovh-manager-dedicated/commit/70df3bb))



<a name="9.2.6"></a>
## [9.2.6](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.5...v9.2.6) (2018-04-09)


### Bug Fixes

* ui-kit font path ([e2b96e4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e2b96e4))



<a name="9.2.5"></a>
## [9.2.5](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.4...v9.2.5) (2018-04-09)


### Bug Fixes

* **account billing refunds:** fix payment type info unavailable ([d3f4ef3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d3f4ef3))
* **dedicated server:** add HIL DC location ([d184ea4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d184ea4))
* **dedicated server ipmi:** fix typo ([0e1e2b7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0e1e2b7))
* **dedicatedcloud resource upgrade:** migrate from bs2 to bs3 ([5504e8b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5504e8b))
* **firewall rule:** avoid errors and set null values to rule attributes ([dd4d184](https://github.com/ovh-ux/ovh-manager-dedicated/commit/dd4d184))
* **firewall rule:** fix after review ([83cffb1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/83cffb1))
* **firewall rule:** fix firewall rule creation ([d109bf4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d109bf4))
* **firewall rule:** fix trim on undefined error ([f4fbd98](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f4fbd98))
* **ipmi:** fix after review ([4112fd6](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4112fd6))
* **sso:** fix sso auth login for dev mode ([7675468](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7675468))


### Features

* **dedicated server ipmi:** add information of os installation in IPMI ([70d9e5c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/70d9e5c))
* **multi users:** add account id col ([cfa503a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/cfa503a))
* **users:** add explain message ([9977dcb](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9977dcb))



<a name="9.2.4"></a>
## [9.2.4](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.3...v9.2.4) (2018-04-05)



<a name="9.2.3"></a>
## [9.2.3](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.2...v9.2.3) (2018-04-04)


### Bug Fixes

* **sidebar:** use User.getUrlOf for url retrieval ([333c452](https://github.com/ovh-ux/ovh-manager-dedicated/commit/333c452))



<a name="9.2.2"></a>
## [9.2.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.1...v9.2.2) (2018-04-03)


### Bug Fixes

* **ckeditor:** fix CKEDITOR_BASEPATH initialization ([d85c6c5](https://github.com/ovh-ux/ovh-manager-dedicated/commit/d85c6c5))
* **ip mitigation:** fix html ([b77c402](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b77c402))
* **ip mitigation:** use chart js to render mitigation stats ([0ce984a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0ce984a))



<a name="9.2.1"></a>
## [9.2.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.2.0...v9.2.1) (2018-03-27)


### Bug Fixes

* **dedicatedcloud hds:** fix step 3 validation ([e1981da](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e1981da))



<a name="9.2.0"></a>
# [9.2.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.1.2...v9.2.0) (2018-03-26)


### Bug Fixes

* improve some modals content ([30607e3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/30607e3))
* **account user contacts:** TypeError property ovhSubsidiary ([1b3dc8c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1b3dc8c))
* **dashboard:** hide PCC guides from US customers ([5113611](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5113611))
* **dedicated server ftp-backup access:** update confirm button text ([0b34881](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0b34881))
* **dedicatedcloud dashboard:** reduce icon size ([fed541a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/fed541a))
* **pcc datacenter:** code review ([5f37d6f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5f37d6f))
* **pcc order:** fix button href ([631bc21](https://github.com/ovh-ux/ovh-manager-dedicated/commit/631bc21))
* **pcc order:** fix quantity, fix order button location ([6d2a479](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6d2a479))
* **us pcc order:** FR translations ([245f197](https://github.com/ovh-ux/ovh-manager-dedicated/commit/245f197))


### Features

* **pcc datastore order:** add pcc datastore order for us target ([2e485ce](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2e485ce))
* **pcc host order:** add pcc host order for us target ([062efde](https://github.com/ovh-ux/ovh-manager-dedicated/commit/062efde))
* **pcc us order:** code review ([57c00f4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/57c00f4))
* **pcc us order:** code review) ([33586c3](https://github.com/ovh-ux/ovh-manager-dedicated/commit/33586c3))
* **pcc us order:** filter filers ([e25233b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e25233b))
* **pcc us order:** fix trads ([6b065cb](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6b065cb))



<a name="9.1.2"></a>
## [9.1.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.1.1...v9.1.2) (2018-03-22)


### Bug Fixes

* update route, /me/user has moved to /me/identity/user ([29af383](https://github.com/ovh-ux/ovh-manager-dedicated/commit/29af383))



<a name="9.1.1"></a>
## [9.1.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.1.0...v9.1.1) (2018-03-22)


### Bug Fixes

* **dedicated server firewall:** prevent multiple alert displaying ([f0f86d8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f0f86d8))
* **dedicatedcloud datacenters:** add dropdown-append-to-body ([f8867e7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f8867e7))
* **sso auth modal:** load translations from npm folder instead of bower ([1854628](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1854628))


### Features

* **multi users:** add link in sidebar menu ([6c3fc4f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6c3fc4f))



<a name="9.1.0"></a>
# [9.1.0](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.19...v9.1.0) (2018-03-21)


### Bug Fixes

* **cdn:** add tiles to statistics view for cdn & cdn domains ([503320f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/503320f))
* **dedicated cloud:** remove security options for US cust ([32ad0c8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/32ad0c8))
* **dedicatedcloud:** fix after quality check ([298ddbc](https://github.com/ovh-ux/ovh-manager-dedicated/commit/298ddbc))
* **dedicatedcloud:** fix old href to ui-sref ([de1ea01](https://github.com/ovh-ux/ovh-manager-dedicated/commit/de1ea01))
* **dedicatedcloud:** fix tabs display on resolution width 1200 ([97c5fb2](https://github.com/ovh-ux/ovh-manager-dedicated/commit/97c5fb2))
* **dedicatedcloud:** remove unecessary folder ([b446076](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b446076))
* **dedicatedcloud backup:** display button if dc has at least 1 host ([48eb1dd](https://github.com/ovh-ux/ovh-manager-dedicated/commit/48eb1dd))
* **dedicatedcloud user:** add EN translations for test ([2bb0018](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2bb0018))
* **dedicatedcloud user:** fix after review ([562f10d](https://github.com/ovh-ux/ovh-manager-dedicated/commit/562f10d))
* **dedicatedcloud user rights:** fix translations ([ca36231](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ca36231))
* **license:** add oui-datagrid, fix title ([b14870f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/b14870f))
* **nas:** add oui-datagrid ([53fe190](https://github.com/ovh-ux/ovh-manager-dedicated/commit/53fe190))
* **nas:** code review ([79f68da](https://github.com/ovh-ux/ovh-manager-dedicated/commit/79f68da))
* **pcc:** hide compliante options for us customers until it is available ([dc58eff](https://github.com/ovh-ux/ovh-manager-dedicated/commit/dc58eff))
* **sd:** button design primary -> default ([386bcb7](https://github.com/ovh-ux/ovh-manager-dedicated/commit/386bcb7))
* **server:** fix rtm link language detection ([77b1d6f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/77b1d6f))


### Features

* **dedicatedcloud:** add backup actions to ui-router ([9a2e40c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9a2e40c))
* **dedicatedcloud:** use ui-router in dedicatedCloud section ([0dba0de](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0dba0de))
* **dedicatedcloud user:** nsx user right edit ([6bfd54a](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6bfd54a))



<a name="9.0.19"></a>
## [9.0.19](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.18...v9.0.19) (2018-03-20)



<a name="9.0.18"></a>
## [9.0.18](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.17...v9.0.18) (2018-03-20)


### Bug Fixes

* **license:** temporary fix spla license screen for us customers ([5933f41](https://github.com/ovh-ux/ovh-manager-dedicated/commit/5933f41))



<a name="9.0.17"></a>
## [9.0.17](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.16...v9.0.17) (2018-03-15)


### Bug Fixes

* **cdn:** fix broken chart legend ([2fa86f1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/2fa86f1))



<a name="9.0.16"></a>
## [9.0.16](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.15...v9.0.16) (2018-03-15)


### Bug Fixes

* **guide:** fix us monitoring guide ([e4e07b4](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e4e07b4))



<a name="9.0.15"></a>
## [9.0.15](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.14...v9.0.15) (2018-03-14)


### Bug Fixes

* **codeowners:** set owners to the whole repository ([78e8893](https://github.com/ovh-ux/ovh-manager-dedicated/commit/78e8893))
* **double authentication:** remove backup code rejection ([6c98b04](https://github.com/ovh-ux/ovh-manager-dedicated/commit/6c98b04))



<a name="9.0.14"></a>
## [9.0.14](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.13...v9.0.14) (2018-03-14)



<a name="9.0.13"></a>
## [9.0.13](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.12...v9.0.13) (2018-03-14)



<a name="9.0.12"></a>
## [9.0.12](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.11...v9.0.12) (2018-03-14)



<a name="9.0.11"></a>
## [9.0.11](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.10...v9.0.11) (2018-03-13)


### Bug Fixes

* **billing:** fix filter on service page ([ce0b6c8](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ce0b6c8))
* **dedicatedserver:** fix template installation ([f53eb38](https://github.com/ovh-ux/ovh-manager-dedicated/commit/f53eb38))



<a name="9.0.10"></a>
## [9.0.10](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.9...v9.0.10) (2018-03-12)


### Bug Fixes

* **autorenew:** fix activation modal ([4800f03](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4800f03))
* **otrs:** fix text not displaying ([a01442c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a01442c))
* **user:** add contact url redirection for legacy url ([25cda75](https://github.com/ovh-ux/ovh-manager-dedicated/commit/25cda75))



<a name="9.0.9"></a>
## [9.0.9](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.8...v9.0.9) (2018-03-09)


### Bug Fixes

* **installation:** fix custom template ([a1c3a3b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/a1c3a3b))



<a name="9.0.8"></a>
## [9.0.8](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.7...v9.0.8) (2018-03-09)


### Bug Fixes

* **user:** manage legacy url for contact edition ([4706908](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4706908))



<a name="9.0.7"></a>
## [9.0.7](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.6...v9.0.7) (2018-03-09)


### Bug Fixes

* **user:** fix edit contact page ([0ba3048](https://github.com/ovh-ux/ovh-manager-dedicated/commit/0ba3048))



<a name="9.0.6"></a>
## [9.0.6](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.5...v9.0.6) (2018-03-08)


### Bug Fixes

* **dedicatedCloud:** add token & action params ([ab9ae86](https://github.com/ovh-ux/ovh-manager-dedicated/commit/ab9ae86))



<a name="9.0.5"></a>
## [9.0.5](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.4...v9.0.5) (2018-03-08)


### Bug Fixes

* **account:** fix image path ([36d34ce](https://github.com/ovh-ux/ovh-manager-dedicated/commit/36d34ce))
* **billing:** fix terminate confirmation ([e71dbce](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e71dbce))
* **dedicated:** fix user link in operation tab ([1fdad7c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1fdad7c))
* **dedicatedcloud:** fix progressbar style for operation in todo ([962827c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/962827c))
* **dedicatedcloud user:** display error in user edition ([e33de8b](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e33de8b))



<a name="9.0.4"></a>
## [9.0.4](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.3...v9.0.4) (2018-03-08)


### Bug Fixes

* update responsive layout ([9ecc102](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9ecc102))
* **billing:** fix textual close button ([67a249f](https://github.com/ovh-ux/ovh-manager-dedicated/commit/67a249f))
* **billing:** manager my service - fix actions menu for hosting item ([9f64c75](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9f64c75))
* **billing services:** change button location for web hosting domain ([dfb4d62](https://github.com/ovh-ux/ovh-manager-dedicated/commit/dfb4d62))
* **home:** change some links to guides for fr_FR ([3c5e5f1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/3c5e5f1))
* **home:** fix and remove 2 mores guides ([e1c703c](https://github.com/ovh-ux/ovh-manager-dedicated/commit/e1c703c))
* **home:** fix guide urls on home page ([1b742f1](https://github.com/ovh-ux/ovh-manager-dedicated/commit/1b742f1))



<a name="9.0.3"></a>
## [9.0.3](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.2...v9.0.3) (2018-03-07)


### Bug Fixes

* **dedicated:** fix invalid contacts link ([76e4e69](https://github.com/ovh-ux/ovh-manager-dedicated/commit/76e4e69))
* **nas order:** fix final order modal ([9dbb566](https://github.com/ovh-ux/ovh-manager-dedicated/commit/9dbb566))



<a name="9.0.2"></a>
## [9.0.2](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.1...v9.0.2) (2018-03-07)


### Bug Fixes

* minors fixes (images, invoice ...) ([7d72002](https://github.com/ovh-ux/ovh-manager-dedicated/commit/7d72002))
* **pcc:** fix vmware vrealize order ([4d8b2cd](https://github.com/ovh-ux/ovh-manager-dedicated/commit/4d8b2cd))



<a name="9.0.1"></a>
## [9.0.1](https://github.com/ovh-ux/ovh-manager-dedicated/compare/v9.0.0...v9.0.1) (2018-03-07)


### Bug Fixes

* **translations:** fix translations path ([11eefc5](https://github.com/ovh-ux/ovh-manager-dedicated/commit/11eefc5))



<a name="9.0.0"></a>
# 9.0.0 (2018-03-07)
