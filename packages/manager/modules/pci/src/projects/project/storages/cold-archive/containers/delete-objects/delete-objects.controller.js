import get from 'lodash/get';
import { COLD_ARCHIVE_DEFAULT_REGION } from './delete-objects.constants';

export default class ColdArchiveContainersDeleteObjectsController {
  /* @ngInject */
  constructor($translate, PciStoragesColdArchiveService) {
    this.$translate = $translate;
    this.pciStoragesColdArchiveService = PciStoragesColdArchiveService;
  }

  $onInit() {
    this.trackPage('containers::container::delete');

    this.isLoading = false;
  }

  getHeadingContent() {
    return this.$translate.instant(
      'pci_projects_project_storages_cold_archive_containers_container_delete_objects_title',
      {
        containerName: this.container.name,
      },
    );
  }

  onDeleteContainerObjectsClick() {
    this.trackClick('containers::container::delete-objects::confirm');

    this.isLoading = true;
    return this.pciStoragesColdArchiveService
      .deleteArchiveContainerObjects(
        this.projectId,
        COLD_ARCHIVE_DEFAULT_REGION,
        this.containerName,
        this.container.objects,
      )
      .then(() => {
        this.trackPage(
          'containers::container::delete-objects::confirm_success',
        );

        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_cold_archive_containers_container_delete_objects_success_message',
            {
              containerName: this.container?.name,
            },
          ),
        );
      })
      .catch((err) => {
        this.trackPage('containers::container::delete::confirm_error');

        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_cold_archive_containers_container_delete_objects_error_delete',
            {
              containerName: this.container?.name,
              message: err?.data?.message || err?.message || err.data,
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
    this.trackClick('containers::container::delete::cancel');

    return this.goBack();
  }
}
