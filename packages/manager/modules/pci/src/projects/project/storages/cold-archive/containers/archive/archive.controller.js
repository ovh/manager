import { REGION } from '../../cold-archives.constants';

export default class PciBlockStorageDetailsArchiveController {
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
    this.trackPage('containers::container::archive');
  }

  archiveContainer() {
    this.trackClick('containers::container::archive::confirm');
    this.isLoading = true;

    return this.PciStoragesColdArchiveService.startArchiveContainer(
      this.projectId,
      REGION,
      this.containerName,
    )
      .then(() => {
        this.trackPage('containers::container::archive::confirm_success');
        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_containers_container_archive_success_message',
            {
              container: this.container?.name,
            },
          ),
        );
      })
      .catch((err) => {
        this.trackPage('containers::container::archive::confirm_error');
        return this.goBack(err.data.message, 'error');
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  cancel() {
    this.trackClick('containers::container::archive::cancel');
    return this.goBack();
  }
}
