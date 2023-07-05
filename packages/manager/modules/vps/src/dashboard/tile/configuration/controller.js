export default class VpsDashboardTileConfigurationCtrl {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.nichandle = coreConfig.getUser().nichandle;
    this.$translate = $translate;
  }

  $onInit() {
    // @TODO: create a VPS model and manage that logic in it
    this.isMaxEliteVcore = this.vps.vcore === 8;
    this.isMaxEliteRam = this.isMaxEliteVcore && this.vps.ram.value === 32;
    this.isMaxEliteStorage =
      this.isMaxEliteVcore && this.stateVps.model.disk === 640;
    this.isVpsStarter = this.stateVps.model.name.indexOf('starter') >= 0;

    this.doubleMemoryText =
      this.configurationTile.upgrades.memory.plan && !this.isVpsStarter
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
      this.configurationTile.upgrades.storage.plan && !this.isVpsStarter
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
  }
}
