import get from 'lodash/get';

export default class PciBlockStorageContainersContainerObjectAddController {
  /* @ngInject */
  constructor($translate, PciProjectStorageContainersService) {
    this.$translate = $translate;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;
  }

  $onInit() {
    this.isLoading = false;

    this.prefix = '/';
    this.files = [];
  }

  addObjects() {
    this.isLoading = true;
    let addPromise = null;

    if (this.container.isHighPerfStorage) {
      addPromise = this.addHighPerfObjects(
        this.projectId,
        this.container.region,
        this.container.name,
        this.files,
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

  addHighPerfObjects(serviceName, regionName, containerName, files) {
    return this.PciProjectStorageContainersService.addHighPerfObjects(
      serviceName,
      regionName,
      containerName,
      files,
    );
  }
}
