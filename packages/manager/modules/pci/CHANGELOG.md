# [0.2.0-alpha.1](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-pci@0.2.0-alpha.0...@ovh-ux/manager-pci@0.2.0-alpha.1) (2019-05-09)


### Bug Fixes

* **i18n:** add missing translations ([40ca6e2](https://github.com/ovh-ux/manager/commit/40ca6e2))
* **i18n:** add missing translations ([0568a65](https://github.com/ovh-ux/manager/commit/0568a65))
* **i18n:** Fix the sentence to delete an instance ([#460](https://github.com/ovh-ux/manager/issues/460)) ([d274504](https://github.com/ovh-ux/manager/commit/d274504))
* **i18n:** reworking async requests to manage translations correctly ([7c50071](https://github.com/ovh-ux/manager/commit/7c50071))
* **pci:** add missing ng-uirouter-breadcrumb peer dependency ([3b3e33b](https://github.com/ovh-ux/manager/commit/3b3e33b)), closes [/github.com/ovh-ux/manager/blob/develop/packages/manager/modules/pci/src/projects/project/project.html#L14](https://github.com//github.com/ovh-ux/manager/blob/develop/packages/manager/modules/pci/src/projects/project/project.html/issues/L14)
* **pci:** restore breadcrumb ([9933722](https://github.com/ovh-ux/manager/commit/9933722))
* **pci.instance.add:** prevent console error ([f0ddc70](https://github.com/ovh-ux/manager/commit/f0ddc70))
* **pci.instance.add:** refresh instances list when instance is created ([dbbb3f6](https://github.com/ovh-ux/manager/commit/dbbb3f6))
* **pci.instance.add:** replace datacente by région ([e279f0a](https://github.com/ovh-ux/manager/commit/e279f0a))
* **pci.instances.add:** add missing translation ([f241718](https://github.com/ovh-ux/manager/commit/f241718))
* **pci.instances.add:** add unavailability reason with redirect to step ([1ad11ac](https://github.com/ovh-ux/manager/commit/1ad11ac))
* **pci.kubernetes:** reload on success operation ([04bd3a6](https://github.com/ovh-ux/manager/commit/04bd3a6))
* **pci.private-networks:** refactor routing ([bb3718c](https://github.com/ovh-ux/manager/commit/bb3718c))
* **pci.private-networks.add:** adapt range display to responsive ([8b1bfcb](https://github.com/ovh-ux/manager/commit/8b1bfcb))
* **pci.project.billing:** add missing translation ([4a551b4](https://github.com/ovh-ux/manager/commit/4a551b4))
* **pci.project.billing:** update active header tab ([feac728](https://github.com/ovh-ux/manager/commit/feac728))
* **pci.project.billing:** update tables display ([c0672b8](https://github.com/ovh-ux/manager/commit/c0672b8))
* **pci.project.instance:** add VNC breadcrumb ([1de0602](https://github.com/ovh-ux/manager/commit/1de0602))
* **pci.project.instance:** unset datacenter when region change ([d0c224a](https://github.com/ovh-ux/manager/commit/d0c224a))
* **pci.project.instance:** update instance active tab ([014ee5b](https://github.com/ovh-ux/manager/commit/014ee5b))
* **pci.project.instance:** update instance status ([2c44367](https://github.com/ovh-ux/manager/commit/2c44367))
* **pci.project.instance:** update monthly billing check on dashboard ([3cad284](https://github.com/ovh-ux/manager/commit/3cad284))
* **pci.project.instance:** update quota link ([24000d4](https://github.com/ovh-ux/manager/commit/24000d4))
* **pci.project.storage:** update block price translation ([ff62baf](https://github.com/ovh-ux/manager/commit/ff62baf))
* **pci.project.storage.snapshot:** allow to define volume size ([7c0c830](https://github.com/ovh-ux/manager/commit/7c0c830))
* **pci.project.users:** update translations loading and breadcrumb ([e80a9c4](https://github.com/ovh-ux/manager/commit/e80a9c4))
* **pci.sidebar:** reverse conditions for features availability ([a6f66b4](https://github.com/ovh-ux/manager/commit/a6f66b4))
* **public-cloud:** set moment locale ([627659d](https://github.com/ovh-ux/manager/commit/627659d))
* **storages.blocks.block.volume.edit:** name of volume is now optional ([b193e34](https://github.com/ovh-ux/manager/commit/b193e34))
* fix pci responsive sidebar ([#456](https://github.com/ovh-ux/manager/issues/456)) ([9704477](https://github.com/ovh-ux/manager/commit/9704477))


### Code Refactoring

* **components.uirouter.layout:** remove ng-ovh prefix ([93244d0](https://github.com/ovh-ux/manager/commit/93244d0))


### Features

* **pci.kubernetes:** remove spinner loading and add breadcrumb ([336f9d1](https://github.com/ovh-ux/manager/commit/336f9d1))
* **pci.onboarding:** redirect onboarding to list ([8c95791](https://github.com/ovh-ux/manager/commit/8c95791))
* **pci.project.users:** add empty page ([f9205d2](https://github.com/ovh-ux/manager/commit/f9205d2))
* **pci.projects.users:** add users module ([603f446](https://github.com/ovh-ux/manager/commit/603f446))
* **project:** add project deletion ([#461](https://github.com/ovh-ux/manager/issues/461)) ([1805f02](https://github.com/ovh-ux/manager/commit/1805f02))
* **us:** configure us side and remove useless links ([d12639a](https://github.com/ovh-ux/manager/commit/d12639a))


### BREAKING CHANGES

* **components.uirouter.layout:** module is now named `ngUiRouterLayout`



# [0.2.0-alpha.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-pci@0.1.0-alpha.0...@ovh-ux/manager-pci@0.2.0-alpha.0) (2019-05-07)


### Bug Fixes

* **billing:** add page title ([d0f68db](https://github.com/ovh-ux/manager/commit/d0f68db))
* **i18n:** add missing translations ([209a8cc](https://github.com/ovh-ux/manager/commit/209a8cc))
* **i18n:** add missing translations ([393654b](https://github.com/ovh-ux/manager/commit/393654b))
* **i18n:** add missing translations ([6e033f5](https://github.com/ovh-ux/manager/commit/6e033f5))
* **i18n:** add missing translations ([20c33e1](https://github.com/ovh-ux/manager/commit/20c33e1))
* **i18n:** avoid translations clipping ([1bf6846](https://github.com/ovh-ux/manager/commit/1bf6846))
* **i18n:** replace lorem ipsum for deleting project ([8f3f29d](https://github.com/ovh-ux/manager/commit/8f3f29d))
* **i18n:** translations are now displayed correctly ([d58be1b](https://github.com/ovh-ux/manager/commit/d58be1b))
* **instances:** add page title ([6841c8e](https://github.com/ovh-ux/manager/commit/6841c8e))
* **instances:** wait translations before displaying breadcrumb ([1bb5a17](https://github.com/ovh-ux/manager/commit/1bb5a17))
* **pci:** add missing ngInject related to breadcrumb component ([99ccaa9](https://github.com/ovh-ux/manager/commit/99ccaa9))
* **pci.instance.backup:** remove extra space in translations file ([540909b](https://github.com/ovh-ux/manager/commit/540909b))
* **pci.project.failover.ips.imports:** add some missing prefixes ([bd0532b](https://github.com/ovh-ux/manager/commit/bd0532b))
* **pci.project.failover.ips.imports:** make columns searchable ([f95559d](https://github.com/ovh-ux/manager/commit/f95559d))
* **pci.project.instances:** add state reload ([b604e58](https://github.com/ovh-ux/manager/commit/b604e58))
* **pci.project.legacy.compute.quota:** update section title ([6c131e9](https://github.com/ovh-ux/manager/commit/6c131e9)), closes [#437](https://github.com/ovh-ux/manager/issues/437)
* **pci.project.legacy.openstack.user:** replace label with oui-status ([#436](https://github.com/ovh-ux/manager/issues/436)) ([6b032d7](https://github.com/ovh-ux/manager/commit/6b032d7))
* **pci.project.private.networks.vrack:** update some translations ([#429](https://github.com/ovh-ux/manager/issues/429)) ([c8e8ecc](https://github.com/ovh-ux/manager/commit/c8e8ecc))
* **pci.project.sidebar:** replace region label by location ([#437](https://github.com/ovh-ux/manager/issues/437)) ([8b82020](https://github.com/ovh-ux/manager/commit/8b82020))
* **pci.project.sidebar:** update translation ([#430](https://github.com/ovh-ux/manager/issues/430)) ([5ce4d18](https://github.com/ovh-ux/manager/commit/5ce4d18))
* **pci.project.sidebar.project.list:** display correctly refresh action ([#428](https://github.com/ovh-ux/manager/issues/428)) ([8b2869d](https://github.com/ovh-ux/manager/commit/8b2869d))
* add action links ([#392](https://github.com/ovh-ux/manager/issues/392)) ([7b3685d](https://github.com/ovh-ux/manager/commit/7b3685d))
* **pci.project.ssh.keys:** add some missing prefixes ([019ef82](https://github.com/ovh-ux/manager/commit/019ef82))
* add missing ngInject annotation ([255295e](https://github.com/ovh-ux/manager/commit/255295e))
* add missing translations ([0d1d8b5](https://github.com/ovh-ux/manager/commit/0d1d8b5))
* clean future states urls ([9740f28](https://github.com/ovh-ux/manager/commit/9740f28))
* disable button to create kube (unavailable) ([e0a2443](https://github.com/ovh-ux/manager/commit/e0a2443))
* fix /projects/new route with lazy loading ([fe48ec2](https://github.com/ovh-ux/manager/commit/fe48ec2))
* fix responsive sidebar menu ([fb3456c](https://github.com/ovh-ux/manager/commit/fb3456c))
* improve style and r&d ([4562cc8](https://github.com/ovh-ux/manager/commit/4562cc8))
* remove dependencies to @ovh-ux/manager-kubernetes ([fd4b5e8](https://github.com/ovh-ux/manager/commit/fd4b5e8))
* remove useless spacing ([b2c9e5a](https://github.com/ovh-ux/manager/commit/b2c9e5a))
* update block storages list ([#396](https://github.com/ovh-ux/manager/issues/396)) ([0137b0a](https://github.com/ovh-ux/manager/commit/0137b0a))
* update containers storages ([c3021e2](https://github.com/ovh-ux/manager/commit/c3021e2))
* update image snapshots translation ([8427078](https://github.com/ovh-ux/manager/commit/8427078))
* update instance backups ([406b4c6](https://github.com/ovh-ux/manager/commit/406b4c6))
* update volume snapshots list ([944bd5a](https://github.com/ovh-ux/manager/commit/944bd5a))
* **pci.project.ssh.keys:** make columns searchable ([476c9fc](https://github.com/ovh-ux/manager/commit/476c9fc))
* **pci.project.storages.container:** add missing one time binding ([801e556](https://github.com/ovh-ux/manager/commit/801e556)), closes [#435](https://github.com/ovh-ux/manager/issues/435) [/github.com/ovh-ux/manager/pull/435#pullrequestreview-233330306](https://github.com//github.com/ovh-ux/manager/pull/435/issues/pullrequestreview-233330306) [#435](https://github.com/ovh-ux/manager/issues/435)
* **pci.storage.block.snapshot:** remove extra space in translations file ([1bc5981](https://github.com/ovh-ux/manager/commit/1bc5981))
* **pci.storage.container:** apply margin between clipboard and tooltip ([#434](https://github.com/ovh-ux/manager/issues/434)) ([bab3485](https://github.com/ovh-ux/manager/commit/bab3485))
* **storages:** improve margin and remove back-button ([d049c71](https://github.com/ovh-ux/manager/commit/d049c71))
* **storages:** update translation ([5a48dd4](https://github.com/ovh-ux/manager/commit/5a48dd4))
* **storages.blocks:** disable add form when submitting ([#357](https://github.com/ovh-ux/manager/issues/357)) ([4affcfb](https://github.com/ovh-ux/manager/commit/4affcfb))
* **vouchers:** add page title ([61e6dc9](https://github.com/ovh-ux/manager/commit/61e6dc9))


### Features

* add block storage onboarding ([58dd349](https://github.com/ovh-ux/manager/commit/58dd349))
* add block storages list ([7f36914](https://github.com/ovh-ux/manager/commit/7f36914))
* add breadcrumb informations ([37a1db0](https://github.com/ovh-ux/manager/commit/37a1db0))
* add empty component ([a7bb474](https://github.com/ovh-ux/manager/commit/a7bb474))
* add instance backups list ([754a403](https://github.com/ovh-ux/manager/commit/754a403))
* add instance creation ([#390](https://github.com/ovh-ux/manager/issues/390)) ([f62edbc](https://github.com/ovh-ux/manager/commit/f62edbc))
* **instances:** add instance dashboard ([26b25f7](https://github.com/ovh-ux/manager/commit/26b25f7))
* **kubernetes:** add kubernetes to pci module ([f5cd48f](https://github.com/ovh-ux/manager/commit/f5cd48f))
* **onboarding:** improve empty page ([07bc763](https://github.com/ovh-ux/manager/commit/07bc763))
* **pci:** add components for instance creation ([db0d0cc](https://github.com/ovh-ux/manager/commit/db0d0cc))
* **pci:** add kubernetes to public-cloud app ([c02a9c3](https://github.com/ovh-ux/manager/commit/c02a9c3))
* **pci:** add private networks ([c5f2af2](https://github.com/ovh-ux/manager/commit/c5f2af2))
* **pci.components.project.images.list:** add dataiku application ([7eca479](https://github.com/ovh-ux/manager/commit/7eca479))
* **pci.project.failover-ips:** add empty page ([313f52b](https://github.com/ovh-ux/manager/commit/313f52b))
* **pci.project.instances:** add empty page ([492902d](https://github.com/ovh-ux/manager/commit/492902d))
* **pci.project.storage.instance-backups:** add empty page ([3766531](https://github.com/ovh-ux/manager/commit/3766531))
* **pci.project.storage.objects:** add empty page ([3103953](https://github.com/ovh-ux/manager/commit/3103953))
* **pci.project.storage.volume-snapshots:** add empty page ([870366d](https://github.com/ovh-ux/manager/commit/870366d))
* **pci.project.storages.cloudarchive:** add empty page ([1f42d23](https://github.com/ovh-ux/manager/commit/1f42d23))
* **pci.projects.new:** manage creation errors ([#411](https://github.com/ovh-ux/manager/issues/411)) ([dd25558](https://github.com/ovh-ux/manager/commit/dd25558))
* **pci.projects.new:** manage polling during project creation ([#418](https://github.com/ovh-ux/manager/issues/418)) ([507bc5b](https://github.com/ovh-ux/manager/commit/507bc5b))
* **project:** user are now able to edit project and define default ([#346](https://github.com/ovh-ux/manager/issues/346)) ([8972203](https://github.com/ovh-ux/manager/commit/8972203))
* **sidebar:** avoid use same state each time ([d96d5da](https://github.com/ovh-ux/manager/commit/d96d5da))
* **ssh:** add new section: ssh keys ([#364](https://github.com/ovh-ux/manager/issues/364)) ([925267b](https://github.com/ovh-ux/manager/commit/925267b))
* **storages:** add object storage tooltip ([#435](https://github.com/ovh-ux/manager/issues/435)) ([5d81f20](https://github.com/ovh-ux/manager/commit/5d81f20))
* add instance dashboard ([25a27d2](https://github.com/ovh-ux/manager/commit/25a27d2))
* add instance edition ([b032c76](https://github.com/ovh-ux/manager/commit/b032c76))
* add instances backup help ([071201b](https://github.com/ovh-ux/manager/commit/071201b))
* add instances list ([dc631ca](https://github.com/ovh-ux/manager/commit/dc631ca))
* **storages.blocks:** update blocks storages ([8621ad1](https://github.com/ovh-ux/manager/commit/8621ad1))
* add IPFO section ([#361](https://github.com/ovh-ux/manager/issues/361)) ([dbe714e](https://github.com/ovh-ux/manager/commit/dbe714e))
* add object & cloud-archives storages ([#365](https://github.com/ovh-ux/manager/issues/365)) ([42c17dd](https://github.com/ovh-ux/manager/commit/42c17dd))
* add picture in image list ([e871634](https://github.com/ovh-ux/manager/commit/e871634))
* add project settings link ([b9784dc](https://github.com/ovh-ux/manager/commit/b9784dc))
* attach private network on instance ([05e15f0](https://github.com/ovh-ux/manager/commit/05e15f0))
* disable projects page ([f4018fe](https://github.com/ovh-ux/manager/commit/f4018fe))
* new user goes now on onboarding ([0639945](https://github.com/ovh-ux/manager/commit/0639945))
* redirect transition's error on error page ([f1e6c7c](https://github.com/ovh-ux/manager/commit/f1e6c7c))
* **storages.volume-snapshots:** add volume-snapshots list ([#359](https://github.com/ovh-ux/manager/issues/359)) ([c8a63fd](https://github.com/ovh-ux/manager/commit/c8a63fd))


### Performance Improvements

* add lazyloading for all states ([6bfd6a8](https://github.com/ovh-ux/manager/commit/6bfd6a8))



# [0.1.0-alpha.0](https://github.com/ovh-ux/manager/compare/@ovh-ux/manager-pci@0.0.0...@ovh-ux/manager-pci@0.1.0-alpha.0) (2019-03-22)


### Bug Fixes

* cloud container takes now all available width ([88c22ce](https://github.com/ovh-ux/manager/commit/88c22ce))


### Features

* **pci:** add @ovh-ux/manager-pci package ([#230](https://github.com/ovh-ux/manager/issues/230)) ([9c36a75](https://github.com/ovh-ux/manager/commit/9c36a75))



