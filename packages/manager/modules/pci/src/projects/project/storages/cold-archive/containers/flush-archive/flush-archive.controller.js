import { TERMINATE_INPUT_PATTERN } from './flush-archive.constants';
import { REGION } from '../../cold-archives.constants';
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

  flushArchive() {
    this.trackClick('containers::container::flush-archive::confirm');

    this.isLoading = true;
    return this.pciStoragesColdArchiveService
      .flushArchive(this.projectId, REGION, this.container.name)
      .then(() => {
        this.trackPage('containers::container::flush-archive::confirm_success');

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
        this.trackPage('containers::container::flush-archive::confirm_error');

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
    this.trackClick('containers::container::flush-archive::cancel');

    return this.goBack();
  }
}
