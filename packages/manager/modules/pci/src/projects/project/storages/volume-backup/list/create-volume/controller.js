const VOLUME_SIZE = {
  MIN: 10,
  MAX: 4000,
};

export default class VolumeBackupListCreateVolumeController {
  /* @ngInject */
  constructor($translate, ovhManagerRegionService, VolumeBackupService) {
    this.$translate = $translate;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.volumeBackupService = VolumeBackupService;

    this.VOLUME_SIZE = VOLUME_SIZE;
  }

  $onInit() {
    this.isCreating = false;
    this.createVolumeModel = {
      name: this.volume.name,
      size: this.volume.size || VOLUME_SIZE.MIN,
    };
  }

  buildSuccessMessage() {
    const volumeSuccessMessage = this.$translate.instant(
      'pci_projects_project_storages_volume_backup_list_create_volume_request_success',
      {
        volumeName: `<strong>${this.createVolumeModel.name}</strong>`,
      },
    );
    const linkMessage = this.$translate.instant(
      'pci_projects_project_storages_volume_backup_list_create_volume_request_success_link',
    );

    const volumeListingPageLink = `<a
      href="${this.volumeBlockStorageLink}"
      target="_blank"
      rel="noopener"
    >
      <span>${linkMessage}</span>
      <span
        class="oui-icon oui-icon-external-link"
        aria-hidden="true"
      ></span>
    </a>`;

    return {
      textHtml: `${volumeSuccessMessage} <br/> ${volumeListingPageLink}`,
    };
  }

  onVolumeSizeChange(size) {
    this.getVolumePriceEstimation({
      ...this.volume,
      size,
    }).then((volumePrice) => {
      this.volumePrice = volumePrice;
    });
  }

  onCreateVolumeClick() {
    // TODO: Tracking -- MANAGER-10570

    this.isCreating = true;
    return this.volumeBackupService
      .createVolumeFromVolumeBackup(
        this.projectId,
        this.volumeBackup.region,
        this.volumeBackup.id,
        this.createVolumeModel.name,
      )
      .then(() => {
        return this.goToVolumeBackups(this.buildSuccessMessage());
      })
      .then(() => this.startPolling())
      .catch(({ data }) => {
        return this.goToVolumeBackups(
          {
            textHtml: this.$translate.instant(
              'pci_projects_project_storages_volume_backup_list_create_volume_request_fail',
              {
                message: data.message,
              },
            ),
          },
          'error',
        );
      })
      .finally(() => {
        this.isCreating = false;
      });
  }

  onCreateVolumeCancelClick() {
    // TODO: Tracking -- MANAGER-10570

    return this.goBack();
  }
}
