import { COLD_ARCHIVE_DEFAULT_REGION } from './restore.constants';

export default class PciBlockStorageDetailsRestoreController {
  /* @ngInject */
  constructor($translate, PciStoragesColdArchiveService) {
    this.$translate = $translate;
    this.pciStoragesColdArchiveService = PciStoragesColdArchiveService;
  }

  $onInit() {
    this.trackPage('containers::container::restore');

    this.isLoading = false;
  }

  restoreContainer() {
    this.trackClick('containers::container::restore::confirm');

    this.isLoading = true;
    return this.pciStoragesColdArchiveService
      .restoreArchiveContainer(
        this.projectId,
        COLD_ARCHIVE_DEFAULT_REGION,
        this.containerName,
      )
      .then(() => {
        this.trackPage('containers::container::restore::confirm_success');

        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_cold_archive_containers_container_restore_success_message',
            {
              containerName: this.container?.name,
            },
          ),
        );
      })
      .catch((err) => {
        this.trackPage('containers::container::restore::confirm_error');

        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_cold_archive_containers_container_restore_error_message',
            {
              containerName: this.container.name,
              message: err?.message || err.data?.message,
            },
          ),
          'error',
        );
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
