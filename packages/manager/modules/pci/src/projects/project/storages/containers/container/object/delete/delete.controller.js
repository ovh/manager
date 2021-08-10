import get from 'lodash/get';

export default class PciBlockStorageContainersContainerObjectDeleteController {
  /* @ngInject */
  constructor($translate, atInternet, PciProjectStorageContainersService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;
  }

  $onInit() {
    this.isLoading = false;
  }

  deleteObject() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}object::delete::confirm`,
      type: 'action',
    });

    this.isLoading = true;
    return this.PciProjectStorageContainersService.deleteObject(
      this.projectId,
      this.container,
      this.object,
      this.container.isHighPerfStorage,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            `pci_projects_project_storages_containers_container_object_delete_${
              this.archive ? 'archive' : 'object'
            }_success_message`,
            {
              object: this.object.name,
            },
          ),
        ),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            `pci_projects_project_storages_containers_container_object_delete_${
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

  cancel() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}object::delete::cancel`,
      type: 'action',
    });
    return this.goBack();
  }
}
