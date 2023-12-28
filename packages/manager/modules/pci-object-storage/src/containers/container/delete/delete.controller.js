import get from 'lodash/get';

export default class PciBlockStorageDetailsDeleteController {
  /* @ngInject */
  constructor(
    $translate,
    atInternet,
    CucCloudMessage,
    PciProjectStorageContainersService,
  ) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;
  }

  $onInit() {
    this.isLoading = false;
  }

  deleteStorage() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}delete::confirm`,
      type: 'action',
    });

    this.isLoading = true;
    return this.PciProjectStorageContainersService.deleteContainer(
      this.projectId,
      this.container,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_containers_container_delete_success_message',
            {
              container: this.container.name,
            },
          ),
        ),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_containers_container_delete_error_delete',
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
      name: `${this.trackingPrefix}delete::cancel`,
      type: 'action',
    });
    return this.goBack();
  }
}
