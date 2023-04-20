import { COLD_ARCHIVE_TRACKING } from '../../cold-archives.constants';

export default class PciBlockStorageDetailsRestoreController {
  /* @ngInject */
  constructor($translate, PciStoragesColdArchiveService) {
    this.$translate = $translate;
    this.pciStoragesColdArchiveService = PciStoragesColdArchiveService;
  }

  $onInit() {
    this.isLoading = false;
  }

  trackRestoreModalPage(action) {
    const hit = `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.RESTORE}_${action}`;
    this.trackPage(hit);
  }

  trackRestoreModalClick(action) {
    const hit = `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.RESTORE}::${action}`;
    this.trackClick(hit);
  }

  restoreContainer() {
    this.trackRestoreModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CONFIRM);
    this.isLoading = true;
    return this.pciStoragesColdArchiveService
      .restoreArchiveContainer(
        this.projectId,
        this.regions[0],
        this.container.name,
      )
      .then(() => {
        this.trackRestoreModalPage(COLD_ARCHIVE_TRACKING.STATUS.SUCCESS);
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
        this.trackRestoreModalPage(COLD_ARCHIVE_TRACKING.STATUS.ERROR);
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
    this.trackRestoreModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CANCEL);
    return this.goBack();
  }
}
