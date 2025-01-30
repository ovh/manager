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
    coreConfig,
  ) {
    this.$translate = $translate;
    this.cucCloudMessage = CucCloudMessage;
    this.cucCurrencyService = CucCurrencyService;
    this.volumeBackupService = VolumeBackupService;
    this.coreConfig = coreConfig;
    this.user = coreConfig.getUser();
  }

  $onInit() {
    this.VOLUMES_OPTIONS = VOLUMES_OPTIONS;
    this.VOLUME_OPTION_BACKUP = VOLUME_OPTION_BACKUP;

    this.isCreating = false;
    this.loadMessages();
    this.volumePrices = {};
    this.computeVolumePrices();
    this.snapshotAvailabilityData = null;
    this.loadSnapshotAvailability();
    this.backupAvailabilityData = null;
    this.loadBackupAvailability();
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

  loadSnapshotAvailability() {
    this.volumeBackupService
      .getSnapshotProductAvailability(this.projectId, this.user.ovhSubsidiary)
      .then((data) => {
        this.snapshotAvailabilityData = data;
        this.computeVolumePrices();
      });
  }

  loadBackupAvailability() {
    this.volumeBackupService
      .getBackupProductAvailability(this.projectId, this.user.ovhSubsidiary)
      .then((data) => {
        this.backupAvailabilityData = data;
        this.computeVolumePrices();
      });
  }

  getVolumeAddon(volumeOption) {
    if (this.volumeBackupModel.selected.volume) {
      const addons = this.volumesAddons.filter(({ planCode }) =>
        planCode.startsWith(volumeOption.planCode),
      );

      const availableProductsInRegion =
        (volumeOption.id === 'volume_snapshot'
          ? this.snapshotAvailabilityData
          : this.backupAvailabilityData
        )?.plans.filter(({ regions }) =>
          regions.some(
            (r) => r.name === this.volumeBackupModel.selected.volume.region,
          ),
        ) || [];

      return addons.find(({ planCode }) =>
        availableProductsInRegion.some(({ code }) => planCode === code),
      );
    }
    return this.volumesAddons.find(
      ({ planCode }) => planCode === volumeOption.planCode,
    );
  }

  formatVolumePrice(volumeOption) {
    const volumeAddon = this.getVolumeAddon(volumeOption);
    const price = volumeAddon?.pricings[0]?.price;
    if (typeof price === 'number') {
      const convertPrice = this.cucCurrencyService.convertUcentsToCurrency(
        price * 730,
      );
      const priceCurrency = this.cucCurrencyService.getCurrentCurrency();

      return `${convertPrice}${priceCurrency}`;
    }
    return null;
  }

  computeVolumePrices() {
    this.volumePrices = Object.fromEntries(
      VOLUMES_OPTIONS.map((volumeOption) => [
        volumeOption.id,
        this.formatVolumePrice(volumeOption),
      ]),
    );
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
    this.computeVolumePrices();
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
