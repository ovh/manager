import { REGION } from '../../cold-archives.constants';

export default class PciBlockStorageDetailsRestoreController {
  /* @ngInject */
  constructor(
    $translate,
    atInternet,
    CucCloudMessage,
    PciStoragesColdArchiveService,
  ) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.CucCloudMessage = CucCloudMessage;
    this.PciStoragesColdArchiveService = PciStoragesColdArchiveService;
  }

  $onInit() {
    this.isLoading = false;
    this.trackPage('containers::container::restore');
  }

  restoreContainer() {
    this.trackClick('containers::container::restore::confirm');
    this.isLoading = true;

    return this.PciStoragesColdArchiveService.restoreArchiveContainer(
      this.projectId,
      REGION,
      this.containerName,
    )
      .then(() => {
        this.trackPage('containers::container::restore::confirm_success');
        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_containers_container_restore_success_message',
            {
              container: this.container?.name,
            },
          ),
        );
      })
      .catch((err) => {
        this.trackPage('containers::container::restore::confirm_error');
        return this.goBack(err.data.message, 'error');
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  cancel() {
    this.trackClick('containers::container::restore::cancel');
    return this.goBack();
  }
}
