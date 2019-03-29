export default class PciBlockStorageDetailsDeleteController {
  /* @ngInject */
  constructor(
    $translate,
    PciProjectStorageBlockService,
  ) {
    this.$translate = $translate;
    this.PciProjectStorageBlockService = PciProjectStorageBlockService;
  }

  $onInit() {
    this.getStorage();
  }

  getStorage() {
    this.loading = true;
    this.$translate.refresh()
      .then(() => this.PciProjectStorageBlockService.get(this.projectId, this.storageId))
      .then((storage) => {
        this.storage = storage;
        return this.storage;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  deleteStorage() {
    this.close();
  }
}
