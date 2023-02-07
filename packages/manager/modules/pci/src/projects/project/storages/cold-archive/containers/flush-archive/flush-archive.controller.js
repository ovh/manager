import { TERMINATE_INPUT_PATTERN } from './flush-archive.constants';
import { COLD_ARCHIVE_TRACKING } from '../../cold-archives.constants';
import { COLD_ARCHIVE_CONTAINER_STATUS } from '../containers.constants';

export default class ColdArchiveContainersFlushArchiveController {
  /* @ngInject */
  constructor($translate, PciStoragesColdArchiveService) {
    this.$translate = $translate;
    this.pciStoragesColdArchiveService = PciStoragesColdArchiveService;
  }

  $onInit() {
    this.isLoading = false;
    this.TERMINATE_INPUT_PATTERN = TERMINATE_INPUT_PATTERN;
    this.COLD_ARCHIVE_CONTAINER_STATUS = COLD_ARCHIVE_CONTAINER_STATUS;
  }

  trackFlushContainerModalPage(action) {
    const hit = `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.FLUSH_CONTAINER}_${action}`;
    this.trackPage(hit);
  }

  trackFlushContainerModalClick(action) {
    const hit = `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.FLUSH_CONTAINER}::${action}`;
    this.trackClick(hit);
  }

  flushArchive() {
    this.trackFlushContainerModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CONFIRM);
    this.isLoading = true;
    return this.pciStoragesColdArchiveService
      .flushArchive(this.projectId, this.regions[0], this.container.name)
      .then(() => {
        this.trackFlushContainerModalPage(COLD_ARCHIVE_TRACKING.STATUS.SUCCESS);

        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_containers_container_cold_archive_flush_success_message',
            {
              container: this.container?.name,
            },
          ),
        );
      })
      .catch((err) => {
        this.trackFlushContainerModalPage(COLD_ARCHIVE_TRACKING.STATUS.ERROR);

        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_containers_container_cold_archive_flush_error_message',
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
    this.trackFlushContainerModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CANCEL);
    return this.goBack();
  }
}
