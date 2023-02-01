export default class PciStorageColdArchivesOnboardingController {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
  }

  onAddVolumeBlockStorageClick() {
    // TODO: tracking

    this.goToAddVolumeBlockStorage();
  }
}
