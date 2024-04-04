import moment from 'moment';

import {
  BACKUP_NAME_PREFIX,
  VOLUME_OPTION_BACKUP,
  VOLUME_OPTION_SNAPSHOT,
  VOLUMES_OPTIONS,
} from './create.constants';
import { VOLUME_BACKUP_TRACKING } from '../volume-backup.constants';

export default class VolumeBackupCreateController {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    CucCurrencyService,
    VolumeBackupService,
  ) {
    this.$translate = $translate;
    this.cucCloudMessage = CucCloudMessage;
    this.cucCurrencyService = CucCurrencyService;
    this.volumeBackupService = VolumeBackupService;
  }

  $onInit() {
    this.VOLUMES_OPTIONS = VOLUMES_OPTIONS;
    this.VOLUME_OPTION_BACKUP = VOLUME_OPTION_BACKUP;

    this.isCreating = false;
    this.loadMessages();
  }

  loadMessages() {
    this.cucCloudMessage.unSubscribe(this.messageContainer);
    this.messageHandler = this.cucCloudMessage.subscribe(
      this.messageContainer,
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getVolumeAddon(volumeOption) {
    return this.volumesAddons.find(
      ({ planCode }) => planCode === volumeOption.planCode,
    );
  }

  formatVolumePrice(volumeOption) {
    const { price } = this.getVolumeAddon(volumeOption).pricings[0];
    const convertPrice = this.cucCurrencyService.convertUcentsToCurrency(price);
    const priceCurrency = this.cucCurrencyService.getCurrentCurrency();

    return `${convertPrice}${priceCurrency}`;
  }

  isVolumeBackupOption() {
    const { volumeOption } = this.volumeBackupModel.selected;

    return volumeOption?.type === VOLUME_OPTION_BACKUP;
  }

  isVolumeSnapshotOption() {
    const { volumeOption } = this.volumeBackupModel.selected;

    return volumeOption?.type === VOLUME_OPTION_SNAPSHOT;
  }

  isSelectedVolumeNeedToDetach() {
    const { volume } = this.volumeBackupModel.selected;

    return volume?.attachedTo.length > 0 && this.isVolumeBackupOption();
  }

  isValidConfiguration() {
    const { volume: selectedVolume } = this.volumeBackupModel.selected;

    return (
      selectedVolume &&
      this.volumeBackupModel.name &&
      (this.isVolumeSnapshotOption() ||
        (this.isVolumeBackupOption() &&
          selectedVolume?.attachedTo.length === 0))
    );
  }

  static buildLink(hrefLink, linkMessage) {
    return `<a
      href="${hrefLink}"
      target="_blank"
      rel="noopener"
    >
      <span>${linkMessage}</span>
      <span
        class="oui-icon oui-icon-external-link"
        aria-hidden="true"
      ></span>
    </a>`;
  }

  buildSuccessSnapshotBackupCucMessage(backupName) {
    return this.buildTaskResponse(
      'success',
      this.$translate.instant(
        'pci_projects_project_storages_volume_backup_create_action_create_option_volume_snapshot_success',
        {
          backupName: `<strong>${backupName}</strong>`,
        },
      ),
    );
  }

  buildSuccessVolumeBackupCucMessage(backupName) {
    return {
      textHtml: this.$translate.instant(
        'pci_projects_project_storages_volume_backup_create_action_create_option_volume_backup_success',
        {
          backupName: `<strong>${backupName}</strong>`,
        },
      ),
    };
  }

  createVolumeSnapshot(trackPrefix) {
    const {
      name,
      selected: { volume },
    } = this.volumeBackupModel;

    return this.volumeBackupService
      .createVolumeSnapshot(this.projectId, volume.id, { name })
      .then(() => {
        this.trackPage(
          `${VOLUME_BACKUP_TRACKING.CREATE.REQUEST_SUCCESS}_${trackPrefix}`,
        );

        return this.goToSnapshots(
          this.buildSuccessSnapshotBackupCucMessage(name),
        );
      })
      .catch(({ data }) => {
        this.trackPage(
          `${VOLUME_BACKUP_TRACKING.CREATE.REQUEST_FAIL}::${trackPrefix}`,
        );

        return this.goToSnapshots(
          this.buildTaskResponse(
            'error',
            this.$translate.instant(
              'pci_projects_project_storages_volume_backup_create_action_create_volume_backup_fail',
              {
                message: data.message,
              },
            ),
          ),
        );
      });
  }

  createVolumeBackup(trackPrefix) {
    const {
      name,
      selected: { volume },
    } = this.volumeBackupModel;

    return this.volumeBackupService
      .createVolumeBackup(this.projectId, volume.region, {
        name,
        volumeId: volume.id,
      })
      .then(() => {
        this.trackPage(
          `${VOLUME_BACKUP_TRACKING.CREATE.REQUEST_SUCCESS}_${trackPrefix}`,
        );

        return this.goToVolumeBackups(
          this.buildSuccessVolumeBackupCucMessage(name, volume.name),
        );
      })
      .catch(({ data }) => {
        this.trackPage(
          `${VOLUME_BACKUP_TRACKING.CREATE.REQUEST_FAIL}_${trackPrefix}`,
        );

        return this.goToVolumeBackups(
          this.$translate.instant(
            'pci_projects_project_storages_volume_backup_create_action_create_volume_backup_fail',
            {
              message: data.message,
            },
          ),
          'error',
        );
      });
  }

  setVolumeBackupName(volume, volumeOption) {
    if (volume && volumeOption) {
      const volumeTypePrefix = BACKUP_NAME_PREFIX[volumeOption.type];
      const timestamp = moment().format();

      this.volumeBackupModel.name = `${volumeTypePrefix}-${volume.name}-${timestamp}`;
    }
  }

  onPriceLinkClick() {
    this.trackClick(VOLUME_BACKUP_TRACKING.CREATE.PRICE_LINK);
  }

  onVolumeChange(volume) {
    this.setVolumeBackupName(
      volume,
      this.volumeBackupModel.selected.volumeOption,
    );
  }

  onVolumeTypeChange(volumeType) {
    this.setVolumeBackupName(
      this.volumeBackupModel.selected.volume,
      volumeType,
    );
  }

  onGoToDetachVolumeFromInstanceButtonClick() {
    const {
      name,
      selected: { volume, volumeOption },
    } = this.volumeBackupModel;

    return this.goToDetachVolume(volume, volumeOption, name);
  }

  onCreateBackupClick() {
    const { type } = this.volumeBackupModel.selected.volumeOption;
    const trackPrefix = BACKUP_NAME_PREFIX[type];
    this.trackClick(
      `${VOLUME_BACKUP_TRACKING.CREATE.CTA_CONFIRM}_${trackPrefix}`,
    );

    const taskPromise = this.isVolumeBackupOption()
      ? this.createVolumeBackup(trackPrefix)
      : this.createVolumeSnapshot(trackPrefix);

    this.isCreating = true;
    return taskPromise.finally(() => {
      this.isCreating = false;
    });
  }
}
