import get from 'lodash/get';
import {
  STORAGE_PRICES_LINK,
  OBJECT_CONTAINER_STORAGE_CLASS,
} from '../../../containers.constants';

export default class PciBlockStorageContainersContainerObjectAddController {
  /* @ngInject */
  constructor(
    $translate,
    atInternet,
    coreConfig,
    PciProjectStorageContainersService,
  ) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.STORAGE_PRICES_LINK = STORAGE_PRICES_LINK;
    this.OBJECT_CONTAINER_STORAGE_CLASS = OBJECT_CONTAINER_STORAGE_CLASS;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;
  }

  $onInit() {
    this.trackClick('add');
    this.isLoading = false;
    this.priceLink = this.STORAGE_PRICES_LINK[
      this.coreConfig.getUser().ovhSubsidiary
    ];
    this.storageClass = OBJECT_CONTAINER_STORAGE_CLASS.STANDARD;
    this.prefix = '/';
    this.files = [];
  }

  addObjects() {
    this.isLoading = true;
    let addPromise = null;
    this.trackClick('object::add::confirm');
    if (this.container.s3StorageType) {
      addPromise = this.addHighPerfObjects(
        this.projectId,
        this.container.region,
        this.container.name,
        this.prefix,
        this.files,
        this.container.s3StorageType,
        this.storageClass,
      );
    } else {
      addPromise = this.PciProjectStorageContainersService.addObjects(
        this.projectId,
        this.container,
        this.prefix,
        this.files,
      );
    }
    return addPromise
      .then(() =>
        this.goBack(
          this.$translate.instant(
            `pci_projects_project_storages_containers_container_object_add_${
              this.archive ? 'archive' : 'object'
            }_success_message`,
          ),
        ),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            `pci_projects_project_storages_containers_container_object_add_${
              this.archive ? 'archive' : 'object'
            }_error_delete`,
            {
              message: get(err, 'data.message', null),
            },
          ),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }

  addHighPerfObjects(
    serviceName,
    regionName,
    containerName,
    prefix,
    files,
    s3StorageType,
    storageClass,
  ) {
    return this.PciProjectStorageContainersService.addHighPerfObjects(
      serviceName,
      regionName,
      containerName,
      prefix,
      files,
      s3StorageType,
      storageClass,
    );
  }

  cancel() {
    this.trackClick('object::add::cancel');
    return this.goBack();
  }

  trackClick(action) {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}${action}`,
      type: 'action',
    });
  }
}
