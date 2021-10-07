import { CHART_CONFIG } from './constant';

const STORAGE_SIZE_MULTIPLIER = 1024;

export default class AnthosStorageCtrl {
  static mbToTb(size) {
    return parseFloat(
      (size / STORAGE_SIZE_MULTIPLIER / STORAGE_SIZE_MULTIPLIER).toFixed(2),
    );
  }

  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.usageString = `${this.mbToTbString(
      this.storageUsage.totalUsed,
    )} / ${this.mbToTbString(this.storageUsage.totalSize)}`;
    this.initializeChartConfig();
  }

  mbToTbString(size) {
    return `${this.constructor.mbToTb(size)} ${this.$translate.instant(
      'anthos_dashboard_storage_unit_size_TB',
    )}`;
  }

  initializeChartConfig() {
    this.chartConfig = {
      ...CHART_CONFIG,
      labels: [
        this.$translate.instant('anthos_dashboard_storage_system'),
        this.$translate.instant('anthos_dashboard_storage_used'),
        this.$translate.instant('anthos_dashboard_storage_remaining'),
      ],
      data: [
        this.constructor.mbToTb(this.storageUsage.reservedSize),
        this.constructor.mbToTb(this.storageUsage.usedSize),
        this.constructor.mbToTb(
          this.storageUsage.totalSize - this.storageUsage.totalUsed,
        ),
      ],
    };
  }

  onGoToAddStorage() {
    this.trackClick(`${this.storageHitTracking}::add-volume`);

    return this.goToAddStorage();
  }

  onGoToRemoveStorage(storage) {
    this.trackClick(`${this.storageHitTracking}::delete-volume`);

    return this.goToRemoveStorage(storage);
  }
}
