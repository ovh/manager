import { TERMINATE_INPUT_PATTERN } from './delete-container.constants';
import { COLD_ARCHIVE_CONTAINER_STATUS } from '../containers.constants';
import {
  MANAGE_ARCHIVE_DOC_LINK,
  COLD_ARCHIVE_TRACKING,
} from '../../cold-archives.constants';

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

  trackDeleteContainerModalPage(action) {
    const hit = `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.DELETE_CONTAINER}_${action}`;
    this.trackPage(hit);
  }

  trackDeleteContainerModalClick(action) {
    const hit = `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.DELETE_CONTAINER}::${action}`;
    this.trackClick(hit);
  }

  getDocumentationUrl() {
    return MANAGE_ARCHIVE_DOC_LINK[this.coreConfig.getUser()?.ovhSubsidiary];
  }

  deleteContainer() {
    this.trackDeleteContainerModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CONFIRM);
    this.isLoading = true;
    return this.pciStoragesColdArchiveService
      .deleteArchiveContainer(
        this.projectId,
        this.regions[0],
        this.container.name,
      )
      .then(() => {
        this.trackDeleteContainerModalPage(
          COLD_ARCHIVE_TRACKING.STATUS.SUCCESS,
        );
        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_containers_container_cold_archive_delete_success_message',
            {
              containerName: this.container?.name,
            },
          ),
        );
      })
      .catch((err) => {
        this.trackDeleteContainerModalPage(COLD_ARCHIVE_TRACKING.STATUS.ERROR);

        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_containers_container_cold_archive_delete_error_delete',
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
    this.trackDeleteContainerModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CANCEL);
    return this.goBack();
  }
}
