import { COLD_ARCHIVE_DEFAULT_REGION } from './archive.constants';

export default class PciBlockStorageDetailsArchiveController {
  /* @ngInject */
  constructor($translate, PciStoragesColdArchiveService) {
    this.$translate = $translate;
    this.pciStoragesColdArchiveService = PciStoragesColdArchiveService;
  }

  $onInit() {
    this.trackPage('containers::container::archive');

    this.isLoading = false;
  }

  archiveContainer() {
    this.trackClick('containers::container::archive::confirm');

    this.isLoading = true;
    return this.pciStoragesColdArchiveService
      .startArchiveContainer(
        this.projectId,
        COLD_ARCHIVE_DEFAULT_REGION,
        this.container.name,
      )
      .then(() => {
        this.trackPage('containers::container::archive::confirm_success');

        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_cold_archive_containers_container_archive_success_message',
            {
              containerName: this.container.name,
            },
          ),
        );
      })
      .catch((err) => {
        this.trackPage('containers::container::archive::confirm_error');

        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_cold_archive_containers_container_archive_error_message',
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
    this.trackClick('containers::container::archive::cancel');

    return this.goBack();
  }
}
