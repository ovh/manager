export default class VpsDashboardTileConfigurationCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $translate,
    coreConfig,
    VpsService,
    VpsHelperService,
  ) {
    this.nichandle = coreConfig.getUser().nichandle;
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;
    this.VpsService = VpsService;
    this.VpsHelperService = VpsHelperService;
    this.loaders = {
      disk: false,
    };
  }

  $onInit() {
    // @TODO: create a VPS model and manage that logic in it
    // vCore 8 for Elite 16 for Limited Edition
    this.isMaxVcore = this.vps.vcore === 8 || this.vps.vcore === 16;
    this.isMaxRam =
      (this.vps.vcore === 8 && this.vps.ram.value === 32) ||
      this.vps.vcore === 16;
    this.isMaxStorage =
      (this.vps.vcore === 8 && this.stateVps.model.disk === 640) ||
      this.vps.vcore === 16;
    this.isVpsStarter = this.stateVps.model.name.indexOf('starter') >= 0;

    this.doubleMemoryText =
      this.configurationTile.upgrades?.memory.plan && !this.isVpsStarter
        ? this.$translate.instant(
            'vps_dashboard_tile_configuration_memory_double',
            {
              additionalPrice: this.configurationTile.isUpfront
                ? this.configurationTile.upgrades.memory.upfrontDiff.text
                : this.configurationTile.upgrades.memory.diff.text,
              price: this.configurationTile.isUpfront
                ? this.configurationTile.upgrades.memory.upfrontTotal.text
                : this.configurationTile.upgrades.memory.total.text,
            },
          )
        : '';
    this.doubleStorageText =
      this.configurationTile.upgrades?.storage.plan && !this.isVpsStarter
        ? this.$translate.instant(
            'vps_dashboard_tile_configuration_storage_double',
            {
              additionalPrice: this.configurationTile.isUpfront
                ? this.configurationTile.upgrades.storage.upfrontDiff.text
                : this.configurationTile.upgrades.storage.diff.text,
              price: this.configurationTile.isUpfront
                ? this.configurationTile.upgrades.storage.upfrontTotal.text
                : this.configurationTile.upgrades.storage.total.text,
            },
          )
        : '';

    this.isMigrationInProgress =
      this.vpsMigrationTask && this.vpsMigrationTask.state !== 'todo';
    if (!this.vps.isExpired) {
      this.hasAdditionalDiskOption();
    }
  }

  hasAdditionalDiskOption() {
    if (
      !this.tabSummary.additionalDisk ||
      !this.tabSummary.additionalDisk.optionAvailable
    ) {
      this.hasAdditionalDisk = false;
      return this.hasAdditionalDisk;
    }
    return this.loadAdditionalDisks();
  }

  loadAdditionalDisks() {
    this.loaders.disk = true;
    this.hasAdditionalDisk = true;
    this.VpsService.getDisks(this.serviceName)
      .then((data) => {
        const promises = data.map((elem) =>
          this.VpsService.getDiskInfo(this.serviceName, elem),
        );
        return this.$q.all(promises).then((diskInfos) => {
          this.additionalDisks = this.VpsService.showOnlyAdditionalDisk(
            diskInfos,
          );
          this.canOrderDisk = Object.keys(this.additionalDisks).length === 0;
        });
      })
      .catch((error) => {
        this.CucCloudMessage.error(
          error || this.$translate.instant('vps_additional_disk_info_fail'),
        );
        return this.$q.reject(error);
      })
      .finally(() => {
        this.loaders.disk = false;
        this.initActions();
      });
  }

  initActions() {
    this.actions = {
      orderAdditionalDiskOption: {
        text: this.$translate.instant('vps_additional_disk_add_button'),
        callback: () => this.$state.go('vps.detail.additional-disk.order'),
        isAvailable: () =>
          !this.loaders.disk &&
          this.canOrderDisk &&
          !this.isMigrationInProgress,
      },
      terminateAdditionalDiskOption: {
        text: this.$translate.instant('vps_configuration_desactivate_option'),
        isAvailable: () =>
          !this.loaders.disk &&
          !this.canOrderDisk &&
          !this.isMigrationInProgress,
      },
    };
  }

  canTerminateAdditionalDisk() {
    return this.VpsHelperService.canOptionBeterminated(this.serviceInfos);
  }
}
