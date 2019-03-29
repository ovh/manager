export default class PciBlockStorageDetailsDetachController {
  /* @ngInject */
  constructor(
    PciProjectStorageBlockService,
  ) {
    this.PciProjectStorageBlockService = PciProjectStorageBlockService;
  }

  $onInit() {
    this.getStorage();
  }

  getStorage() {
    this.loading = true;

    this.PciProjectStorageBlockService
      .get(this.projectId, this.storageId)
      .then((storage) => {
        this.storage = storage;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  detachStorage() {
    this.PciProjectStorageBlockService
      .detach(this.projectId, this.storage)
      .then(() => this.close());
  }
}
