import { TERMINATE_INPUT_PATTERN } from './delete-container.constants';

import { COLD_ARCHIVE_CONTAINER_STATUS } from '../containers.constants';
import { MANAGE_ARCHIVE_DOC_LINK, REGION } from '../../cold-archives.constants';

export default class ColdArchiveContainersDeleteContainerController {
  /* @ngInject */
  constructor($translate, PciStoragesColdArchiveService, coreConfig) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.pciStoragesColdArchiveService = PciStoragesColdArchiveService;
  }

  $onInit() {
    this.isLoading = false;
    this.TERMINATE_INPUT_PATTERN = TERMINATE_INPUT_PATTERN;
    this.COLD_ARCHIVE_CONTAINER_STATUS = COLD_ARCHIVE_CONTAINER_STATUS;
  }

  getDocumentationUrl() {
    return MANAGE_ARCHIVE_DOC_LINK[
      this.coreConfig.getUserLanguage().toUpperCase()
    ];
  }

  deleteContainer() {
    this.isLoading = true;
    return this.pciStoragesColdArchiveService
      .deleteArchiveContainer(this.projectId, REGION, this.container.name)
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
