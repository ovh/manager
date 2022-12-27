import {
  COLD_ARCHIVE_DEFAULT_REGION,
  TERMINATE_INPUT_PATTERN,
} from './delete-container.constants';

import { COLD_ARCHIVE_CONTAINER_STATUS } from '../containers.constants';

export default class ColdArchiveContainersDeleteContainerController {
  /* @ngInject */
  constructor($translate, PciStoragesColdArchiveService) {
    this.$translate = $translate;
    this.pciStoragesColdArchiveService = PciStoragesColdArchiveService;
  }

  $onInit() {
    this.trackPage('containers::container::delete-container');

    this.isLoading = false;
    this.TERMINATE_INPUT_PATTERN = TERMINATE_INPUT_PATTERN;
    this.COLD_ARCHIVE_CONTAINER_STATUS = COLD_ARCHIVE_CONTAINER_STATUS;
  }

  getHeadingContent() {
    return this.$translate.instant(
      'pci_projects_project_storages_containers_container_cold_archive_delete_title',
      {
        containerName: this.container.name,
      },
    );
  }

  deleteContainer() {
    this.trackClick('containers::container::delete-container::confirm');

    this.isLoading = true;
    return this.pciStoragesColdArchiveService
      .emptyArchiveContainer(
        this.projectId,
        COLD_ARCHIVE_DEFAULT_REGION,
        this.container.name,
      )
      .then(() => {
        this.trackPage(
          'containers::container::delete-container::confirm_success',
        );

        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_containers_container_delete_success_message',
            {
              container: this.container?.name,
            },
          ),
        );
      })
      .catch((err) => {
        this.trackPage(
          'containers::container::delete-container::confirm_error',
        );

        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_containers_container_delete_error_delete',
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
    this.trackClick('containers::container::delete-container::cancel');

    return this.goBack();
  }
}
