import get from 'lodash/get';
import { REGION } from '../../cold-archives.constants';

export default class PciBlockStorageDetailsDeleteController {
  /* @ngInject */
  constructor(
    $translate,
    atInternet,
    CucCloudMessage,
    PciStoragesColdArchiveService,
  ) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.CucCloudMessage = CucCloudMessage;
    this.PciStoragesColdArchiveService = PciStoragesColdArchiveService;
  }

  $onInit() {
    this.isLoading = false;
    this.trackPage('containers::container::delete');
  }

  deleteContainer() {
    this.trackClick('containers::container::delete::confirm');
    this.isLoading = true;

    return this.PciStoragesColdArchiveService.removeArchiveContainer(
      this.projectId,
      REGION,
      this.containerName,
    )
      .then(() => {
        this.trackPage('containers::container::delete::confirm_success');
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
        this.trackPage('containers::container::delete::confirm_error');
        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_containers_container_delete_error_delete',
            {
              message: get(err, 'data.message', null),
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
