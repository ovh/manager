import { COLD_ARCHIVE_DEFAULT_REGION } from './delete-archive.constants';

export default class ColdArchiveContainersDeleteArchiveController {
  /* @ngInject */
  constructor($translate, PciStoragesColdArchiveService) {
    this.$translate = $translate;
    this.pciStoragesColdArchiveService = PciStoragesColdArchiveService;
  }

  $onInit() {
    this.trackPage('containers::container::delete-archive');

    this.isLoading = false;
  }

  deleteContainer() {
    this.trackClick('containers::container::delete-archive::confirm');

    this.isLoading = true;
    return this.pciStoragesColdArchiveService
      .removeArchiveContainer(
        this.projectId,
        COLD_ARCHIVE_DEFAULT_REGION,
        this.containerName,
      )
      .then(() => {
        this.trackPage(
          'containers::container::delete-archive::confirm_success',
        );

        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_containers_container_cold_archive_delete_archive_success_message',
            {
              container: this.container?.name,
            },
          ),
        );
      })
      .catch((err) => {
        this.trackPage('containers::container::delete-archive::confirm_error');

        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_containers_container_cold_archive_delete_archive_error_delete',
            {
              message: err.data?.message || err?.message || err.data,
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
    this.trackClick('containers::container::delete-cancel::cancel');

    return this.goBack();
  }
}
