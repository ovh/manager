import get from 'lodash/get';

export default class PciProjectStorageContainersContainerEnableVersioningController {
  /* @ngInject */
  constructor($translate, atInternet, PciProjectStorageContainersService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;
  }

  $onInit() {
    this.trackClick('enable-versioning');
    this.isLoading = false;
  }

  enableVersioning() {
    this.isLoading = true;
    this.trackClick('object::enable-versioning::confirm');

    return this.PciProjectStorageContainersService.updateContainer(
      this.projectId,
      { ...this.container, versioning: { status: 'enabled' } },
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_containers_update_versioning_enable_success_message',
          ),
        ),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_containers_update_versioning_enable_error_message',
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
    this.trackClick('object::enable-versioning::cancel');
    return this.goBack();
  }

  handleDismiss() {
    if (!this.isLoading) {
      this.goBack();
    }
  }

  trackClick(action) {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}${action}`,
      type: 'action',
    });
  }
}
