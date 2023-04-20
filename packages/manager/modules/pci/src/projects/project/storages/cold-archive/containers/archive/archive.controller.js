import { COLD_ARCHIVE_TRACKING } from '../../cold-archives.constants';

export default class PciBlockStorageDetailsArchiveController {
  /* @ngInject */
  constructor($translate, PciStoragesColdArchiveService) {
    this.$translate = $translate;
    this.pciStoragesColdArchiveService = PciStoragesColdArchiveService;
  }

  $onInit() {
    this.isLoading = false;
  }

  trackArchiveModalPage(action) {
    const hit = `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ARCHIVE}_${action}`;
    this.trackPage(hit);
  }

  trackArchiveModalClick(action) {
    const hit = `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ARCHIVE}::${action}`;
    this.trackClick(hit);
  }

  archiveContainer() {
    this.trackArchiveModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CONFIRM);
    this.isLoading = true;
    return this.pciStoragesColdArchiveService
      .startArchiveContainer(
        this.projectId,
        this.regions[0],
        this.container.name,
      )
      .then(() => {
        this.trackArchiveModalPage(COLD_ARCHIVE_TRACKING.STATUS.SUCCESS);
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
        this.trackArchiveModalPage(COLD_ARCHIVE_TRACKING.STATUS.ERROR);

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
    this.trackArchiveModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CANCEL);
    return this.goBack();
  }
}
