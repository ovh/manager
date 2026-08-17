# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.16.0](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.15.3...@ovh-ux/backup-licenses@1.16.0) (2026-08-17)


### Bug Fixes

* **backup-licenses:** align the module's zod with the resolvers peer ([11eeb05](https://github.com/ovh/manager/commit/11eeb05265d0169802df5696fd6542907f334731))
* **backup-licenses:** discover the cart pricing parameters instead of assuming P1M ([a912307](https://github.com/ovh/manager/commit/a912307f034e5b229688f90cb0307842478b2a70))
* **backup-licenses:** last returns from po ([8983ea7](https://github.com/ovh/manager/commit/8983ea71968506a9b5b91131a8de3dfdcf53146d)), closes [#bkp-1161](https://github.com/ovh/manager/issues/bkp-1161)
* **backup-licenses:** read licence prices from the catalogue addons ([add3864](https://github.com/ovh/manager/commit/add3864f76e061c4121ad38138b231b543664782))
* **backup-licenses:** satisfy prettier on the vault-order specs ([1b8987e](https://github.com/ovh/manager/commit/1b8987e50c92d56ffd9839cd51113fcf30f132b6))
* **backup-licenses:** state the price unit and the storage rate ([aa1d887](https://github.com/ovh/manager/commit/aa1d8875bf2d4371494cc31c379c3328258fa5e1))
* **onboarding:** plug onboarding page to bmc and fix translations ([dde37d2](https://github.com/ovh/manager/commit/dde37d2503cdd087e34d4986f01574efb5a96576)), closes [#bkp-1161](https://github.com/ovh/manager/issues/bkp-1161)


### Features

* **backup-licenses:** add billing tab consumption table ([7917538](https://github.com/ovh/manager/commit/7917538b894188e96460d5f38380b0c893ba5193)), closes [#BKP-1216](https://github.com/ovh/manager/issues/BKP-1216)
* **backup-licenses:** add correct api orders to get terms and conditions ([3405340](https://github.com/ovh/manager/commit/34053403a2ac17c8ea6f22a74d93feffe5230989)), closes [#bkp-1161](https://github.com/ovh/manager/issues/bkp-1161)
* **backup-licenses:** add general information page ([5441548](https://github.com/ovh/manager/commit/5441548cb1f4158c9462eb1e16122d65597eb024)), closes [#BKP-1226](https://github.com/ovh/manager/issues/BKP-1226)
* **backup-licenses:** add onboarding page ([#1206](https://github.com/ovh/manager/issues/1206)) ([30d85db](https://github.com/ovh/manager/commit/30d85db6e4ebce96f1cb0f46b9b7b02944d6948c)), closes [#BKP-1206](https://github.com/ovh/manager/issues/BKP-1206)
* **backup-licenses:** add order tunnel ([bd9dbd1](https://github.com/ovh/manager/commit/bd9dbd148910c312133c6889d8a22f3310a6bc93)), closes [#BKP-1208](https://github.com/ovh/manager/issues/BKP-1208)
* **backup-licenses:** add the shared Agora order api layer ([a6bb04c](https://github.com/ovh/manager/commit/a6bb04c9cd5a98828e443756a75b131898177992))
* **backup-licenses:** add tunnel to add extra VBR server ([5c9233a](https://github.com/ovh/manager/commit/5c9233a1e41cdb5e246a954bbbaedc357f8e0c4d)), closes [#BKP-1217](https://github.com/ovh/manager/issues/BKP-1217)
* **backup-licenses:** add vbr server list page ([#1216](https://github.com/ovh/manager/issues/1216)) ([5f83e95](https://github.com/ovh/manager/commit/5f83e959a31bbc9f4808ad9bfeeb457b6b394d52)), closes [#BKP-1216](https://github.com/ovh/manager/issues/BKP-1216)
* **backup-licenses:** install the real Agora vault order channel (BKP-1223) ([a608669](https://github.com/ovh/manager/commit/a6086693c034f337d4452a778a5f36f8c7c43b6f))
* **backup-licenses:** list the vaults of the service (BKP-1221) ([64fd110](https://github.com/ovh/manager/commit/64fd1107559919b87c43982f62e3c3e2ab2a6e47))
* **backup-licenses:** order an additional vault (BKP-1223) ([4ea5d2a](https://github.com/ovh/manager/commit/4ea5d2acf0cd8719ec309f3bcb57ec468b37c5cc))
* **backup-licenses:** scope the shared backupServices reads to this product line ([141bc7e](https://github.com/ovh/manager/commit/141bc7e5c49ca84ce94cf188dc7d87b4804d7279))
* **backup-licenses:** serve every screen from the real API ([c7d06a9](https://github.com/ovh/manager/commit/c7d06a9b2994db47ac4a7b34cc409bb9a49840b7))
* **backup-licenses:** show the S3 credentials of a vault (BKP-1222) ([2b238a5](https://github.com/ovh/manager/commit/2b238a56f8ef201307c0f49e4152d51ecf885c65))
* **backup-licenses:** terminate a vault (BKP-1224) ([15022ed](https://github.com/ovh/manager/commit/15022ede1fe900779b66597a16bb6d66a73b9f93))
* **backup-licenses:** unmock 1208 and wire bmc-backup-licenses menu entry ([6a936bd](https://github.com/ovh/manager/commit/6a936bddfda52e8aabd63996dfdb9adc8d9bdfbd)), closes [#BKP-1208](https://github.com/ovh/manager/issues/BKP-1208)
* **backup-licenses:** update vbr server ([0c939df](https://github.com/ovh/manager/commit/0c939df962d8c334d5f7d012b124c6191145b237)), closes [#BKP-1218](https://github.com/ovh/manager/issues/BKP-1218)
* **backup-licenses:** wire the order funnel submit to the Agora cart (BKP-1208) ([68d1d40](https://github.com/ovh/manager/commit/68d1d4078bd55c6583b693ff0ff383fb7f91fd9f))
* **hpc-backup-licences:** init hpc backup licences apps ([daf3e9f](https://github.com/ovh/manager/commit/daf3e9f4e1097f301658b4b7e12e085d22ac6561)), closes [#BKP-1161](https://github.com/ovh/manager/issues/BKP-1161)
* **vbr-servers:** add modal to delete a server ([ce65a23](https://github.com/ovh/manager/commit/ce65a230988d69b1e664969631b691aa9871eaef)), closes [#BKP-1219](https://github.com/ovh/manager/issues/BKP-1219)





## [1.15.3](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.15.2...@ovh-ux/backup-licenses@1.15.3) (2026-03-25)


### Bug Fixes

* **i18n:** add missing translations [CDS 4717] ([2bc0730](https://github.com/ovh/manager/commit/2bc07304da066b0cbcbef75e20e7761c5268d55c))
* **i18n:** add missing translations [CDS 4720] ([f3ce184](https://github.com/ovh/manager/commit/f3ce1845f34b72f7d7210902144f2686fea3a5e0))
* **i18n:** add missing translations [CDS 4721] ([bc6b500](https://github.com/ovh/manager/commit/bc6b500a0168a457b4ebd858f3fdde246b3408a5))





## [1.15.2](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.15.1...@ovh-ux/backup-licenses@1.15.2) (2026-03-18)


### Bug Fixes

* **i18n:** add missing translations [CDS 1220] ([3aef67d](https://github.com/ovh/manager/commit/3aef67d4a1a874a954172d049f9f04c68d62a54f))
* **i18n:** add missing translations [CDS 4708] ([cca4ac6](https://github.com/ovh/manager/commit/cca4ac654eebdcdb90ce468b7481f6395ba11cb2))





## [1.15.1](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.15.0...@ovh-ux/backup-licenses@1.15.1) (2026-02-26)


### Bug Fixes

* **i18n:** add missing translations [CDS 4675] ([0db6537](https://github.com/ovh/manager/commit/0db65378d07656f87004736e891567a972f3eb98))
* **i18n:** add missing translations [CDS 4677] ([2ca0331](https://github.com/ovh/manager/commit/2ca03314fccdbafcd9176502cc48dc0566d02d54))
* **i18n:** add missing translations [CDS 4679] ([77b0828](https://github.com/ovh/manager/commit/77b0828586767215c2031c1264af8f1ced6718e0))





# [1.15.0](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.14.4...@ovh-ux/backup-licenses@1.15.0) (2026-02-25)


### Bug Fixes

* **backup-licenses:** fix agent listing refresh not working ([87e907d](https://github.com/ovh/manager/commit/87e907d5cb0a3dea4c2ec1c171864229d0301721)), closes [#BKP-863](https://github.com/ovh/manager/issues/BKP-863)


### Features

* **backup-licenses:** add helper banner when no agent installed ([872e5d7](https://github.com/ovh/manager/commit/872e5d71697cdbac6559b07daafe09be108f047b)), closes [#BKP-753](https://github.com/ovh/manager/issues/BKP-753)





## [1.14.4](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.14.3...@ovh-ux/backup-licenses@1.14.4) (2026-02-20)


### Bug Fixes

* **i18n:** add missing translations [CDS 1143] ([ef05c3a](https://github.com/ovh/manager/commit/ef05c3aebb33d9827b585fd23e424af6ea1c76af))
* **i18n:** add missing translations [CDS 4674] ([99fbd98](https://github.com/ovh/manager/commit/99fbd98b1125909dc22cdfbdbdab7045f7984926))





## [1.14.3](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.14.2...@ovh-ux/backup-licenses@1.14.3) (2026-02-17)


### Bug Fixes

* **i18n:** add missing translations [CDS 4666] ([e297a5c](https://github.com/ovh/manager/commit/e297a5cddefea355769fbdce90eaf9f6c2d5d129))
* **i18n:** add missing translations [CDS 4669] ([81247b5](https://github.com/ovh/manager/commit/81247b5f4510e1dfa0b251ecdedb938504b3a94f))





## [1.14.2](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.14.1...@ovh-ux/backup-licenses@1.14.2) (2026-02-12)


### Bug Fixes

* **i18n:** add missing translations [CDS 4658] ([cbfd1dc](https://github.com/ovh/manager/commit/cbfd1dcf018a04366aabdfa6bfa569dd69dded53))





## [1.14.1](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.14.0...@ovh-ux/backup-licenses@1.14.1) (2026-02-11)


### Bug Fixes

* **i18n:** add missing translations [CDS 4648] ([98edbe8](https://github.com/ovh/manager/commit/98edbe887e1a2e93edb0850d318e4c11289c6aba))
* **i18n:** add missing translations [CDS 4654] ([2488c5b](https://github.com/ovh/manager/commit/2488c5bde4efb820a39ebb8d475aa4d3a46cf2e1))





# [1.14.0](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.13.2...@ovh-ux/backup-licenses@1.14.0) (2026-02-09)


### Bug Fixes

* **backup-licenses:** fix vault information tile loading declaration ([0a6cbe9](https://github.com/ovh/manager/commit/0a6cbe9d5e356617d3eb355745608b9374845da8)), closes [#BKP-738](https://github.com/ovh/manager/issues/BKP-738)
* **i18n:** add missing translations [CDS 1100] ([7b9521b](https://github.com/ovh/manager/commit/7b9521bf504dc403cdb47b5aa74afc4c3b3d14c1)), closes [#BKP-787](https://github.com/ovh/manager/issues/BKP-787) [#BKP-738](https://github.com/ovh/manager/issues/BKP-738)


### Features

* **backup-licenses:** add reset tenant password ([1510ee0](https://github.com/ovh/manager/commit/1510ee085b710591ad047aa0e01fcd2f63a233d4)), closes [#BKP-738](https://github.com/ovh/manager/issues/BKP-738)
* **backup-licenses:** change routing of services and agents ([d95c618](https://github.com/ovh/manager/commit/d95c6185cc694fd37c0b0e8beb3ff5a3899eed99)), closes [#BKP-785](https://github.com/ovh/manager/issues/BKP-785)
* **backup-licenses:** display vault immutability details ([e2fdd1d](https://github.com/ovh/manager/commit/e2fdd1ddc7e53d330dc592207b609c6df9cb42b7)), closes [#BKP-787](https://github.com/ovh/manager/issues/BKP-787)





## [1.13.2](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.13.1...@ovh-ux/backup-licenses@1.13.2) (2026-02-06)


### Bug Fixes

* **i18n:** add missing translations [CDS 4647] ([0681dfe](https://github.com/ovh/manager/commit/0681dfedd238a31ffba0c256f47cd19969e99f7f))





## [1.13.1](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.13.0...@ovh-ux/backup-licenses@1.13.1) (2026-02-05)


### Bug Fixes

* **i18n:** add missing translations [CDS 4643] ([19c075b](https://github.com/ovh/manager/commit/19c075b8fdc073ca289f1e0ae6ac2aed25617f42))





# [1.13.0](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.12.3...@ovh-ux/backup-licenses@1.13.0) (2026-02-05)


### Bug Fixes

* **backup-licenses:** fix translations of details of status ([ed21caa](https://github.com/ovh/manager/commit/ed21caaa472a3ab841d1078db3336fb692f30a7d)), closes [#BKP-740](https://github.com/ovh/manager/issues/BKP-740)


### Features

* **backup-licenses:** add agents and vaults columns ([076f681](https://github.com/ovh/manager/commit/076f68108a1a92d7ff4c2f4333f51a0e0383d0f2)), closes [#BKP-752](https://github.com/ovh/manager/issues/BKP-752)
* **backup-licenses:** add status legend in agent listing page ([8079eeb](https://github.com/ovh/manager/commit/8079eebd3ac836bc78fedec487627f03f7c9b416)), closes [#BKP-740](https://github.com/ovh/manager/issues/BKP-740)
* **backup-licenses:** update delete modal text ([3c84331](https://github.com/ovh/manager/commit/3c8433120d942f805f2313575814ca83768c1d00)), closes [#BKP-782](https://github.com/ovh/manager/issues/BKP-782)





## [1.12.3](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.12.2...@ovh-ux/backup-licenses@1.12.3) (2026-02-04)

**Note:** Version bump only for package @ovh-ux/backup-licenses





## [1.12.2](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.12.1...@ovh-ux/backup-licenses@1.12.2) (2026-02-03)


### Bug Fixes

* **i18n:** add missing translations [CDS 4635] ([9956c57](https://github.com/ovh/manager/commit/9956c576ef1e8ed1b21af71e69887a518bf6cb68))





## [1.12.1](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.12.0...@ovh-ux/backup-licenses@1.12.1) (2026-02-01)


### Bug Fixes

* **i18n:** add missing translations [CDS 4633] ([b0adee9](https://github.com/ovh/manager/commit/b0adee9cabb30077119603428dd863c5943e3428))





# [1.12.0](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.11.1...@ovh-ux/backup-licenses@1.12.0) (2026-01-30)


### Bug Fixes

* **i18n:** add missing translations [CDS 4626] ([1b5dfd3](https://github.com/ovh/manager/commit/1b5dfd35a8e263cadc37107312a95e54304a3ad4))


### Features

* resolve flaky tests and lint staged enhancement ([28b920f](https://github.com/ovh/manager/commit/28b920f6ac5e1180b9c7c4c23a9e3b5b920be7ca))





## [1.11.1](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.11.0...@ovh-ux/backup-licenses@1.11.1) (2026-01-29)


### Bug Fixes

* **i18n:** add missing translations [CDS 4617] ([927a2d3](https://github.com/ovh/manager/commit/927a2d384a06dd66f87992fdb8811c15db4ca3ca))
* **i18n:** add missing translations [CDS 4623] ([5b32c60](https://github.com/ovh/manager/commit/5b32c60cf7da76e65614bcf49feeb1ac7c6b03ad))





# [1.11.0](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.10.0...@ovh-ux/backup-licenses@1.11.0) (2026-01-27)


### Features

* **backup-licenses:** add reload button component, remove reload from vaults and add it in agents page ([92ed729](https://github.com/ovh/manager/commit/92ed7290c144604b6b59b9a1ed3c07b3a21e85c2)), closes [#BKP-739](https://github.com/ovh/manager/issues/BKP-739)
* **backup-licenses:** add tabs descriptions ([63c8de7](https://github.com/ovh/manager/commit/63c8de798e940763b7d98493b97afef27f73a01a)), closes [#BKP-754](https://github.com/ovh/manager/issues/BKP-754)
* **backup-licenses:** update status types ([86d5cb4](https://github.com/ovh/manager/commit/86d5cb4b942fc29d15357865be95c80f72aea761)), closes [#BKP-737](https://github.com/ovh/manager/issues/BKP-737)
* **bmc-backup-licenses-baremetal:** replace more info link ([2c6aff5](https://github.com/ovh/manager/commit/2c6aff535461bf65dd2e379bb0bab0d7ec547c54)), closes [#BKP-757](https://github.com/ovh/manager/issues/BKP-757)





# [1.10.0](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.9.2...@ovh-ux/backup-licenses@1.10.0) (2026-01-26)


### Features

* **backup-licenses:** add baremetal details hooks ([962d15b](https://github.com/ovh/manager/commit/962d15be9e135c46731bb5a7e3c94112ac027ca2)), closes [#BKP-705](https://github.com/ovh/manager/issues/BKP-705)
* **backup-licenses:** export use required params ([1582d8a](https://github.com/ovh/manager/commit/1582d8ac798ab2fac7520bc7a1ce83fc046aefb6)), closes [#BKP-705](https://github.com/ovh/manager/issues/BKP-705)





## [1.9.2](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.9.1...@ovh-ux/backup-licenses@1.9.2) (2026-01-23)

**Note:** Version bump only for package @ovh-ux/backup-licenses





## [1.9.1](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.9.0...@ovh-ux/backup-licenses@1.9.1) (2026-01-20)

**Note:** Version bump only for package @ovh-ux/backup-licenses





# [1.9.0](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.8.1...@ovh-ux/backup-licenses@1.9.0) (2026-01-19)


### Features

* **backup-licenses:** add guides on all dashboard ([9bac090](https://github.com/ovh/manager/commit/9bac0903272fc03a1b6dd242f3d2d87fb81d7861)), closes [#BKP-736](https://github.com/ovh/manager/issues/BKP-736)
* **backup-licenses:** add powershell command for windows agent ([256b8e6](https://github.com/ovh/manager/commit/256b8e60be2442df37104600ccbebad373659c04)), closes [#BKP-733](https://github.com/ovh/manager/issues/BKP-733)
* **backup-licenses:** add server column on agent listing ([3794efa](https://github.com/ovh/manager/commit/3794efa7b6ef02a2eae1a7fe68830937247a14af)), closes [#BKP-734](https://github.com/ovh/manager/issues/BKP-734)
* **backup-licenses:** disabled configuration for agent not enabled ([b29ad41](https://github.com/ovh/manager/commit/b29ad41223790e4b86fbbc441452872785eba88a)), closes [#BKP-735](https://github.com/ovh/manager/issues/BKP-735)
* **download-agent:** add get link filename utils ([174c426](https://github.com/ovh/manager/commit/174c42606297b9ffeb49fedbf3fb88618fe50c3b)), closes [#BKP-733](https://github.com/ovh/manager/issues/BKP-733)





## [1.8.1](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.8.0...@ovh-ux/backup-licenses@1.8.1) (2026-01-15)

**Note:** Version bump only for package @ovh-ux/backup-licenses





# [1.8.0](https://github.com/ovh/manager/compare/@ovh-ux/backup-licenses@1.7.12...@ovh-ux/backup-licenses@1.8.0) (2026-01-15)


### Bug Fixes

* **backup-licenses:** add agent listing page ([edab7b3](https://github.com/ovh/manager/commit/edab7b344ea5c013ed31e3bcf1d173f66f570a08)), closes [#BKP-717](https://github.com/ovh/manager/issues/BKP-717)
* **backup-licenses:** add delete tenant modal on dashboard ([d25a221](https://github.com/ovh/manager/commit/d25a2217ee6b838b275ad27e57d5ec7156236b46)), closes [#BKP-717](https://github.com/ovh/manager/issues/BKP-717)
* **backup-licenses:** add delete vault modal on dashboard ([d36a299](https://github.com/ovh/manager/commit/d36a2995215ac2d95f1b323c6438f68ab975264d)), closes [#BKP-717](https://github.com/ovh/manager/issues/BKP-717)
* **backup-licenses:** add iam on listing page and actions ([b6fdc6e](https://github.com/ovh/manager/commit/b6fdc6e4a316aff95cba17bc1e8650afec093072)), closes [#BKP-713](https://github.com/ovh/manager/issues/BKP-713)
* **backup-licenses:** agent status function ([cfaaa5a](https://github.com/ovh/manager/commit/cfaaa5a3172d6389dff509096cedc16bc0c5ef9f)), closes [#BKP-713](https://github.com/ovh/manager/issues/BKP-713)
* **backup-licenses:** fix a11y build issues ([efe441f](https://github.com/ovh/manager/commit/efe441f3505d481d808cc972820b9394fc97d7a8)), closes [#BKP-704](https://github.com/ovh/manager/issues/BKP-704)
* **backup-licenses:** fix agent listing status badge color ([ab1604f](https://github.com/ovh/manager/commit/ab1604f066d7facdb948e11943ddcbaa1bbf2f8e)), closes [#BKP-713](https://github.com/ovh/manager/issues/BKP-713)
* **backup-licenses:** fix dashboard display ([e317417](https://github.com/ovh/manager/commit/e317417eb090e538a7c4d00a29370a91e6c33d20)), closes [#BKP-465](https://github.com/ovh/manager/issues/BKP-465)
* **backup-licenses:** fix delete-vault embedded routing ([79d2083](https://github.com/ovh/manager/commit/79d20831c8fdacfff01425bd91d966462996e0ad)), closes [#BKP-700](https://github.com/ovh/manager/issues/BKP-700)
* **backup-licenses:** fix download code on download modal ([dafe3b9](https://github.com/ovh/manager/commit/dafe3b9280a279b841a3dbbd806a1ea2e50ae3cc)), closes [#BKP-713](https://github.com/ovh/manager/issues/BKP-713)
* **backup-licenses:** fix downloadAgent display rules ([d28412d](https://github.com/ovh/manager/commit/d28412d3772a7c5d4d8971d9837a06e1f73c6063)), closes [#BKP-717](https://github.com/ovh/manager/issues/BKP-717)
* **backup-licenses:** fix failing tests ([85c71e1](https://github.com/ovh/manager/commit/85c71e1e22bd75c5f2fde09f0d9b6105d2ca136b)), closes [#BKP-704](https://github.com/ovh/manager/issues/BKP-704)
* **backup-licenses:** remove react error on tenant backup stat ([0e66dc3](https://github.com/ovh/manager/commit/0e66dc3d6fecd92af6e27084997ac2db814d3440)), closes [#BKP-713](https://github.com/ovh/manager/issues/BKP-713)
* **backup-licenses:** replace tenant by vspcTenant in dashboard ([4942440](https://github.com/ovh/manager/commit/4942440e2e9d84bebd5467843a9097123db47dcb)), closes [#BKP-717](https://github.com/ovh/manager/issues/BKP-717)
* **backup-licenses:** replace tenant by vspcTenant in listing services ([c01dfc8](https://github.com/ovh/manager/commit/c01dfc806137735bd93d495727a693eedad217cb)), closes [#BKP-717](https://github.com/ovh/manager/issues/BKP-717)
* **backup-licenses:** unmock vault service consumption ([e7a2972](https://github.com/ovh/manager/commit/e7a2972d0c50100b7ba2e0ab7624a018a3c92311)), closes [#BKP-717](https://github.com/ovh/manager/issues/BKP-717)
* **backup-licenses:** update vault listing column names ([1307f3e](https://github.com/ovh/manager/commit/1307f3e5bbc2b8719b6814b98e30e1e122f11d98)), closes [#BKP-717](https://github.com/ovh/manager/issues/BKP-717)
* build lint and test configuration and issues ([2a7aa5c](https://github.com/ovh/manager/commit/2a7aa5ce45ca8f12ddbe0934a6f2df776e265065)), closes [#MANAGER-18591](https://github.com/ovh/manager/issues/MANAGER-18591)
* **i18n:** add missing translations [CDS 903] ([6eabc0d](https://github.com/ovh/manager/commit/6eabc0d4f1e5302f263a0637e64050710ad54446))
* **i18n:** add missing translations [CDS 974] ([5155a2f](https://github.com/ovh/manager/commit/5155a2f046c10b90e0712765b0dc2e32c68dba29))
* **i18n:** add missing translations [CDS 992] ([6df7c45](https://github.com/ovh/manager/commit/6df7c45fcc49189a5a2c9d76bd8f5cee2a194a89))


### Features

* **backup-licenses:**  remove buy button on listing pages ([5c65694](https://github.com/ovh/manager/commit/5c65694113f5679d2588983e0da6d20559faa845)), closes [#BKP-699](https://github.com/ovh/manager/issues/BKP-699)
* **backup-licenses:** add add configuration page for agent tenant ([ec2f15f](https://github.com/ovh/manager/commit/ec2f15ff79470dd2dbe534df586b2fd2dedc13dc)), closes [#BKP-652](https://github.com/ovh/manager/issues/BKP-652)
* **backup-licenses:** add agent details request ([4fd91b1](https://github.com/ovh/manager/commit/4fd91b1b3139e8b72b2332560f5626be1dee85a8)), closes [#BKP-656](https://github.com/ovh/manager/issues/BKP-656)
* **backup-licenses:** add backup agent deletion ([afe8a0b](https://github.com/ovh/manager/commit/afe8a0bea4a057c1966b27e953926879e9d5cbd9))
* **backup-licenses:** add billing listing page ([9c3c39f](https://github.com/ovh/manager/commit/9c3c39f710d85ef183088b0a7121e6aa598382b9)), closes [#BKP-505](https://github.com/ovh/manager/issues/BKP-505)
* **backup-licenses:** add bucket vault list ([1aa625f](https://github.com/ovh/manager/commit/1aa625f22169f6c365ae6c25db433d70a7f5aad5)), closes [#BKP-493](https://github.com/ovh/manager/issues/BKP-493)
* **backup-licenses:** add bucket vault tab ([426da90](https://github.com/ovh/manager/commit/426da90d4674098d0923962b1f69eac321bd30ca)), closes [#BKP-493](https://github.com/ovh/manager/issues/BKP-493)
* **backup-licenses:** add data location on agent dashboard ([2fcadd5](https://github.com/ovh/manager/commit/2fcadd5851ce9b938195ba8c0dec9c44ab5fd3be)), closes [#BKP-718](https://github.com/ovh/manager/issues/BKP-718)
* **backup-licenses:** add delete vault to module ([cc84692](https://github.com/ovh/manager/commit/cc846927aed683ca2ae1846c55d73c704663005b)), closes [#BKP-489](https://github.com/ovh/manager/issues/BKP-489)
* **backup-licenses:** add download agent from addConfig drawer ([894c2c0](https://github.com/ovh/manager/commit/894c2c055de3d8821e6c564c385ece9143d00c9e)), closes [#BKP-703](https://github.com/ovh/manager/issues/BKP-703)
* **backup-licenses:** add download agent modal ([2eca2ce](https://github.com/ovh/manager/commit/2eca2ce2618ace20d01c38df1d3b2851669ca494)), closes [#BKP-651](https://github.com/ovh/manager/issues/BKP-651)
* **backup-licenses:** add edit configuration agent drawer ([2741575](https://github.com/ovh/manager/commit/2741575341f299af6659149ea7af0bed03e818dd)), closes [#BKP-656](https://github.com/ovh/manager/issues/BKP-656)
* **backup-licenses:** add feature flipping for delete function ([0801769](https://github.com/ovh/manager/commit/08017699ac00969ef7af3d0fc748d22c3d9ef7b3)), closes [#BKP-663](https://github.com/ovh/manager/issues/BKP-663)
* **backup-licenses:** add listing details for tenants ([236b4f4](https://github.com/ovh/manager/commit/236b4f4aa427ef77e08eb7a5df478995b7b0b836))
* **backup-licenses:** add notice on delete-agent ([04a938f](https://github.com/ovh/manager/commit/04a938f6430425bc3395a72746ee89e3d99451c5)), closes [#BKP-700](https://github.com/ovh/manager/issues/BKP-700)
* **backup-licenses:** add notification message on agents actions ([912366f](https://github.com/ovh/manager/commit/912366fddb2371281f0db5fb201d7ff836911807)), closes [#BKP-727](https://github.com/ovh/manager/issues/BKP-727)
* **backup-licenses:** add redirection when user have backup service ([1b3fc1f](https://github.com/ovh/manager/commit/1b3fc1ff7062decf0dc435215515570e69b5b62f)), closes [#BKP-713](https://github.com/ovh/manager/issues/BKP-713)
* **backup-licenses:** add reference on vault general info tile ([073d50b](https://github.com/ovh/manager/commit/073d50b9b734772732413dcb1962b37382cc5bc3)), closes [#BKP-700](https://github.com/ovh/manager/issues/BKP-700)
* **backup-licenses:** add services pages ([291f33a](https://github.com/ovh/manager/commit/291f33abf8203e9ded2cfe51436c6a530941419f)), closes [#BKP-598](https://github.com/ovh/manager/issues/BKP-598)
* **backup-licenses:** add tenant agents list ([bfcd4a4](https://github.com/ovh/manager/commit/bfcd4a4b658ee3c888bf524605d4fdcc2e4ad684)), closes [#BKP-501](https://github.com/ovh/manager/issues/BKP-501)
* **backup-licenses:** add tenant agents subscription ([d22792b](https://github.com/ovh/manager/commit/d22792bf337a28b33ec7133372772dfba13e7cde)), closes [#BKP-498](https://github.com/ovh/manager/issues/BKP-498)
* **backup-licenses:** add tenants tabs on dashboard page ([b0b4dd0](https://github.com/ovh/manager/commit/b0b4dd0c7bccaba1fae9df613def45c89bea5cad)), closes [#BKP-498](https://github.com/ovh/manager/issues/BKP-498)
* **backup-licenses:** add tooltip on vault consumption ([894855d](https://github.com/ovh/manager/commit/894855d6b4bc6d83fd34b87badf60b1be6ee9870)), closes [#BKP-700](https://github.com/ovh/manager/issues/BKP-700)
* **backup-licenses:** add translation on main layout ([94ee370](https://github.com/ovh/manager/commit/94ee370759d7785912a7a5dff132c93d0e60341d)), closes [#BKP-598](https://github.com/ovh/manager/issues/BKP-598)
* **backup-licenses:** add vault consumption ([1fab07d](https://github.com/ovh/manager/commit/1fab07d77a11ad1daa3063e59a603dc692919397)), closes [#BKP-505](https://github.com/ovh/manager/issues/BKP-505)
* **backup-licenses:** add vaults page on module ([f9fa1d5](https://github.com/ovh/manager/commit/f9fa1d5f9a2fc24b05f13fb6ccbbdb7d497c1c26)), closes [#BKP-598](https://github.com/ovh/manager/issues/BKP-598)
* **backup-licenses:** add vspc link on vspc dashboard ([736bf85](https://github.com/ovh/manager/commit/736bf8534ccbbf175b9c3980ba768adcd1b22cdd)), closes [#BKP-660](https://github.com/ovh/manager/issues/BKP-660)
* **backup-licenses:** change input type for add agent ([51fa1bd](https://github.com/ovh/manager/commit/51fa1bd02f3b3dedc7b52b9d3485026c050a671f)), closes [#BKP713](https://github.com/ovh/manager/issues/BKP713)
* **backup-licenses:** disable vault functionality ([d8999d0](https://github.com/ovh/manager/commit/d8999d04d66ce456887aa2eb1605bf208855213e)), closes [#BKP-661](https://github.com/ovh/manager/issues/BKP-661)
* **backup-licenses:** disabled delete button on services listing ([a9fc97c](https://github.com/ovh/manager/commit/a9fc97cca3351205a5806b2ae6b0b4d218fff270)), closes [#BKP-663](https://github.com/ovh/manager/issues/BKP-663)
* **backup-licenses:** disabled delete functionality for tenant ([5c09068](https://github.com/ovh/manager/commit/5c090681727261e46018d098f0a1cb7a979d02da)), closes [#BKP-663](https://github.com/ovh/manager/issues/BKP-663)
* **backup-licenses:** extract general information tile of vault ([e991ad8](https://github.com/ovh/manager/commit/e991ad8d519eb0283659ba70b414e58e6b965664)), closes [#BKP-498](https://github.com/ovh/manager/issues/BKP-498)
* **backup-licenses:** fix agent count on tenant dashboard ([0bc79e5](https://github.com/ovh/manager/commit/0bc79e5671c118f4d39d0e198735c01e3db6369d)), closes [#BKP-713](https://github.com/ovh/manager/issues/BKP-713)
* **backup-licenses:** improve add agent form ([ce68499](https://github.com/ovh/manager/commit/ce6849912de4b8afcbb83433514eaeb7dad6f527)), closes [#BKP-713](https://github.com/ovh/manager/issues/BKP-713)
* **backup-licenses:** include backupServicesId in api routes ([0d32894](https://github.com/ovh/manager/commit/0d328943ef56d570de251c8aeb897d33ef42a205)), closes [#BKP-704](https://github.com/ovh/manager/issues/BKP-704)
* **backup-licenses:** init module for backup agent ([2d7a18d](https://github.com/ovh/manager/commit/2d7a18d2aaeb9712794d349f61804884ef0b2f2a)), closes [#BKP-598](https://github.com/ovh/manager/issues/BKP-598)
* **backup-licenses:** move baremetal logics in backup-licenses module ([d269288](https://github.com/ovh/manager/commit/d269288e6182dd329650b6eb9254ea6ec11d0b35)), closes [#BKP-652](https://github.com/ovh/manager/issues/BKP-652)
* **backup-licenses:** move deleteVault check from listing to modal ([ba7ac33](https://github.com/ovh/manager/commit/ba7ac332f109ba822c19e75518e88a17a28aa9ea)), closes [#BKP-717](https://github.com/ovh/manager/issues/BKP-717)
* **backup-licenses:** remove back button on main dashboard ([e8e7fda](https://github.com/ovh/manager/commit/e8e7fda930c9cfd81cffcb041fedfee1fb78f797)), closes [#BKP-465](https://github.com/ovh/manager/issues/BKP-465)
* **backup-licenses:** remove link on agent and bucket listing ([e57809a](https://github.com/ovh/manager/commit/e57809a5cd58221e2fe24f0168475d16c1c1c74a)), closes [#BKP-699](https://github.com/ovh/manager/issues/BKP-699)
* **backup-licenses:** remove macOS from OS options ([a1a0dba](https://github.com/ovh/manager/commit/a1a0dba59b811d07e147b380619146b33c499485)), closes [#BKP-700](https://github.com/ovh/manager/issues/BKP-700)
* **backup-licenses:** replace id by productResourceName in edit agent ([e93c330](https://github.com/ovh/manager/commit/e93c33027592a919a349fdcbaa72e61646411bd8)), closes [#BKP-713](https://github.com/ovh/manager/issues/BKP-713)
* **backup-licenses:** unmock module with backup services endpoints ([0fa0ec3](https://github.com/ovh/manager/commit/0fa0ec322feb2e788b7bf74bbdb44bd00230d88a)), closes [#BKP-704](https://github.com/ovh/manager/issues/BKP-704)
* **backup-licenses:** update agent form ([c9f645b](https://github.com/ovh/manager/commit/c9f645ba5601c882975af8b8104cf063948f286e)), closes [#BKP-699](https://github.com/ovh/manager/issues/BKP-699)
* **backup-licenses:** update request api for backup services ([3f42079](https://github.com/ovh/manager/commit/3f42079c4e427e816ff806ef65632c59b8de866a)), closes [#BKP-704](https://github.com/ovh/manager/issues/BKP-704)
* **backup-licenses:** update vspc dashboard wording ([c6e08d8](https://github.com/ovh/manager/commit/c6e08d87ec77f59f9fa1f3a6ed1c24b1a22a76fb)), closes [#BKP-727](https://github.com/ovh/manager/issues/BKP-727)
* **backup-licenses:** update wording on global module ([8b42c53](https://github.com/ovh/manager/commit/8b42c536d5eadb1575db05dfeeb93f580dd91d5c)), closes [#BKP-720](https://github.com/ovh/manager/issues/BKP-720)
* **backup-licenses:** vault dashboard translation ([9c3ca7a](https://github.com/ovh/manager/commit/9c3ca7a2ccd21a8eb2ebf0a2f43f585bc54aa43f)), closes [#BKP-727](https://github.com/ovh/manager/issues/BKP-727)
* **bmc-backup-licenses-baremetal:** add backup-licenses logo on onboarding ([5214bfc](https://github.com/ovh/manager/commit/5214bfc3976d020e49d2318788108791819d7a5d)), closes [#BRAND-1969](https://github.com/ovh/manager/issues/BRAND-1969)
* **bmc-backup-licenses-baremetal:** add message when order is in progress ([a02175b](https://github.com/ovh/manager/commit/a02175b6623219728c64d5f860bff59d85ea1d56)), closes [#BKP-730](https://github.com/ovh/manager/issues/BKP-730)
* **bmc-backup-licenses-baremetal:** add susbcribe to first backup agent ([9aaeef5](https://github.com/ovh/manager/commit/9aaeef5c944f0934cef8b614f29d6f71b476a02c)), closes [#BKP-654](https://github.com/ovh/manager/issues/BKP-654)
* **bmc-backup-licenses-baremetal:** update onboarding guides ([e7a0fc6](https://github.com/ovh/manager/commit/e7a0fc6cb9489b219d20016a612a89755d20d0c4)), closes [#BKP-727](https://github.com/ovh/manager/issues/BKP-727)





## [1.7.12](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.7.11...@ovh-ux/logs-to-customer@1.7.12) (2025-10-12)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.7.11](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.7.10...@ovh-ux/logs-to-customer@1.7.11) (2025-10-09)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.7.10](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.7.9...@ovh-ux/logs-to-customer@1.7.10) (2025-10-07)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.7.9](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.7.8...@ovh-ux/logs-to-customer@1.7.9) (2025-10-02)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.7.8](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.7.7...@ovh-ux/logs-to-customer@1.7.8) (2025-09-30)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.7.7](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.7.6...@ovh-ux/logs-to-customer@1.7.7) (2025-09-25)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.7.6](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.7.5...@ovh-ux/logs-to-customer@1.7.6) (2025-09-23)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.7.5](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.7.4...@ovh-ux/logs-to-customer@1.7.5) (2025-09-18)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.7.4](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.7.3...@ovh-ux/logs-to-customer@1.7.4) (2025-09-12)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.7.3](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.7.2...@ovh-ux/logs-to-customer@1.7.3) (2025-09-11)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.7.2](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.7.1...@ovh-ux/logs-to-customer@1.7.2) (2025-09-09)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.7.1](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.7.0...@ovh-ux/logs-to-customer@1.7.1) (2025-09-09)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





# [1.7.0](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.6.5...@ovh-ux/logs-to-customer@1.7.0) (2025-09-06)


### Features

* static kit integration in core, tools and modules modules ([bddbe5e](https://github.com/ovh/manager/commit/bddbe5e07453c8a657f2ca216d48d1f6f2bc0ca5))





## [1.6.5](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.6.4...@ovh-ux/logs-to-customer@1.6.5) (2025-09-04)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.6.4](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.6.3...@ovh-ux/logs-to-customer@1.6.4) (2025-09-03)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.6.3](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.6.2...@ovh-ux/logs-to-customer@1.6.3) (2025-09-02)


### Bug Fixes

* **logs-to-customer:** disabled cache on subscription request ([c3cb5b7](https://github.com/ovh/manager/commit/c3cb5b7e9a95b3dfd84d834166ebe0e4ab2c586b))





## [1.6.2](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.6.1...@ovh-ux/logs-to-customer@1.6.2) (2025-08-29)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.6.1](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.6.0...@ovh-ux/logs-to-customer@1.6.1) (2025-08-20)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





# [1.6.0](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.5.10...@ovh-ux/logs-to-customer@1.6.0) (2025-08-19)


### Bug Fixes

* **i18n:** add missing translations [CDS 4234] ([ef4b847](https://github.com/ovh/manager/commit/ef4b84795a82b68f827c2905cdce821c48afe52f))


### Features

* **ldp:** add a tooltip for sub-streams ([f6006e5](https://github.com/ovh/manager/commit/f6006e546389bdd5e39f8bb6abaa0a4e0a72e46d)), closes [#MANAGER-16889](https://github.com/ovh/manager/issues/MANAGER-16889)





## [1.5.10](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.5.9...@ovh-ux/logs-to-customer@1.5.10) (2025-08-14)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.5.9](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.5.8...@ovh-ux/logs-to-customer@1.5.9) (2025-08-07)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.5.8](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.5.7...@ovh-ux/logs-to-customer@1.5.8) (2025-08-05)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.5.7](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.5.6...@ovh-ux/logs-to-customer@1.5.7) (2025-08-01)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.5.6](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.5.5...@ovh-ux/logs-to-customer@1.5.6) (2025-07-24)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.5.5](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.5.4...@ovh-ux/logs-to-customer@1.5.5) (2025-07-24)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.5.4](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.5.3...@ovh-ux/logs-to-customer@1.5.4) (2025-07-21)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.5.3](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.5.2...@ovh-ux/logs-to-customer@1.5.3) (2025-07-21)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.5.2](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.5.1...@ovh-ux/logs-to-customer@1.5.2) (2025-07-17)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.5.1](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.5.0...@ovh-ux/logs-to-customer@1.5.1) (2025-07-10)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





# [1.5.0](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.4.6...@ovh-ux/logs-to-customer@1.5.0) (2025-07-04)


### Features

* **logs:** no service use-case ([c139b85](https://github.com/ovh/manager/commit/c139b859167c57798412210a8977fcd0bfd590fd)), closes [#MANAGER-18166](https://github.com/ovh/manager/issues/MANAGER-18166)





## [1.4.6](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.4.5...@ovh-ux/logs-to-customer@1.4.6) (2025-07-02)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.4.5](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.4.4...@ovh-ux/logs-to-customer@1.4.5) (2025-06-20)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.4.4](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.4.3...@ovh-ux/logs-to-customer@1.4.4) (2025-06-20)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.4.3](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.4.2...@ovh-ux/logs-to-customer@1.4.3) (2025-06-12)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.4.2](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.4.1...@ovh-ux/logs-to-customer@1.4.2) (2025-06-12)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.4.1](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.4.0...@ovh-ux/logs-to-customer@1.4.1) (2025-06-11)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





# [1.4.0](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.3.5...@ovh-ux/logs-to-customer@1.4.0) (2025-06-11)


### Features

* **logs-to-customer:** add component Route for logs routing ([0135a44](https://github.com/ovh/manager/commit/0135a44d384dd4106d0dfa8d3f4de10fd2c93f3a)), closes [#MANAGER-18438](https://github.com/ovh/manager/issues/MANAGER-18438)





## [1.3.5](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.3.4...@ovh-ux/logs-to-customer@1.3.5) (2025-06-10)


### Bug Fixes

* **logs:** fix css layout ([4fae091](https://github.com/ovh/manager/commit/4fae0914dae7f843e65d31a8bf484b7431425a94)), closes [#MANAGER-17703](https://github.com/ovh/manager/issues/MANAGER-17703)
* **logs:** fix kind and subscription api calls ([8a6fabd](https://github.com/ovh/manager/commit/8a6fabd43ecdba1fd1c5b8b7b096c22b7df1c858)), closes [#MANAGER-17702](https://github.com/ovh/manager/issues/MANAGER-17702)





## [1.3.4](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.3.3...@ovh-ux/logs-to-customer@1.3.4) (2025-06-05)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.3.3](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.3.2...@ovh-ux/logs-to-customer@1.3.3) (2025-05-29)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.3.2](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.3.1...@ovh-ux/logs-to-customer@1.3.2) (2025-05-27)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.3.1](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.3.0...@ovh-ux/logs-to-customer@1.3.1) (2025-05-23)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





# [1.3.0](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.2.6...@ovh-ux/logs-to-customer@1.3.0) (2025-05-15)


### Features

* **mrc:** bump ods 18.6.2 ([da8d233](https://github.com/ovh/manager/commit/da8d23327c353dda493f395d303ed128a2976c14)), closes [#MANAGER-17692](https://github.com/ovh/manager/issues/MANAGER-17692)





## [1.2.6](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.2.5...@ovh-ux/logs-to-customer@1.2.6) (2025-05-08)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.2.5](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.2.4...@ovh-ux/logs-to-customer@1.2.5) (2025-04-30)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.2.4](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.2.3...@ovh-ux/logs-to-customer@1.2.4) (2025-04-30)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.2.3](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.2.2...@ovh-ux/logs-to-customer@1.2.3) (2025-04-29)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.2.2](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.2.1...@ovh-ux/logs-to-customer@1.2.2) (2025-04-24)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.2.1](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.2.0...@ovh-ux/logs-to-customer@1.2.1) (2025-04-17)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





# [1.2.0](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.1.3...@ovh-ux/logs-to-customer@1.2.0) (2025-04-14)


### Features

* **logs-to-customer:** add disable cache on get logs steams ([3675a35](https://github.com/ovh/manager/commit/3675a354ac2d871c97194bfbc518faaf5ba2067f)), closes [#MANAGER-17609](https://github.com/ovh/manager/issues/MANAGER-17609)





## [1.1.3](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.1.2...@ovh-ux/logs-to-customer@1.1.3) (2025-04-10)


### Bug Fixes

* **i18n:** add missing translations [CDS 3832] ([797ea8e](https://github.com/ovh/manager/commit/797ea8e2cee6e2b37ab6a6d8b23ece0613dc6b51))





## [1.1.2](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.1.1...@ovh-ux/logs-to-customer@1.1.2) (2025-04-03)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





## [1.1.1](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.1.0...@ovh-ux/logs-to-customer@1.1.1) (2025-03-27)

**Note:** Version bump only for package @ovh-ux/logs-to-customer





# [1.1.0](https://github.com/ovh/manager/compare/@ovh-ux/logs-to-customer@1.0.0...@ovh-ux/logs-to-customer@1.1.0) (2025-03-26)


### Features

* add new logs-to-customer module ([82850cd](https://github.com/ovh/manager/commit/82850cd35cbc4a24fb941e5fbe6466327be207bd)), closes [#MANAGER-16195](https://github.com/ovh/manager/issues/MANAGER-16195)
