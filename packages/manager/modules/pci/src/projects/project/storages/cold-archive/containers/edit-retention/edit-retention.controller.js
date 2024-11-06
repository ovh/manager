import { COLD_ARCHIVE_TRACKING } from '../../cold-archives.constants';

export default class PciBlockStorageDetailsArchiveController {
  /* @ngInject */
  constructor($translate, PciStoragesColdArchiveService) {
    this.$translate = $translate;
    this.pciStoragesColdArchiveService = PciStoragesColdArchiveService;
  }

  $onInit() {
    this.isLoading = false;

    this.newRententionDate = new Date();

    this.onLockedUntilDaysChange();
  }

  trackArchiveModalPage(action) {
    const hit = `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.EDIT_RETENTION}_${action}`;
    this.trackPage(hit);
  }

  trackArchiveModalClick(action) {
    const hit = `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.EDIT_RETENTION}::${action}`;
    this.trackClick(hit);
  }

  onLockedUntilDaysChange(modelValue) {
    this.disableSubmit = modelValue > 4500;

    this.newRetentionDate = new Date();
    this.newRetentionDate.setDate(this.newRetentionDate.getDate() + modelValue);

    const containerLockedUntil = new Date(this.container.lockedUntil);
    this.hasWarning = this.newRetentionDate < containerLockedUntil;
  }

  archiveContainer() {
    this.trackArchiveModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CONFIRM);
    this.isLoading = true;

    const params = {
      serviceName: this.projectId,
      regionName: this.regions[0],
      archiveName: this.container.name,
      lockedUntilDays: this.lockedUntilDays,
    };

    return this.pciStoragesColdArchiveService
      .startArchiveContainer(params)
      .then(() => {
        this.trackArchiveModalPage(COLD_ARCHIVE_TRACKING.STATUS.SUCCESS);
        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_cold_archive_containers_container_edit_retention_success_message',
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
            'pci_projects_project_storages_cold_archive_containers_container_edit_retention_error_message',
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
