import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';

export default class PciBlockStorageDetailsAttachController {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    PciProjectStorageBlockService,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectStorageBlockService = PciProjectStorageBlockService;
  }

  $onInit() {
    this.initLoaders();
  }

  initLoaders() {
    this.loading = true;
    this.PciProjectStorageBlockService
      .get(this.projectId, this.storageId)
      .then((storage) => {
        this.storage = storage;
        return this.PciProjectStorageBlockService
          .getCompatiblesInstances(this.projectId, this.storage);
      })
      .then((instances) => {
        this.instances = instances;
        this.instancesList = map(
          this.instances,
          ({ id, name }) => ({ id, name }),
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  attachStorage({ id }) {
    const instance = find(this.instances, { id });
    this.PciProjectStorageBlockService
      .attachTo(this.projectId, this.storage, instance)
      .then(() => this.CucCloudMessage.success(this.$translate.instant('success_message')))
      .catch(err => this.CucCloudMessage.error(this.$translate.instant('error_message', { message: get(err, 'data.message', '') })))
      .then(this.close());
  }
}
