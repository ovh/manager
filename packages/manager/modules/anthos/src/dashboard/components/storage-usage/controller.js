const STORAGE_SIZE_MULTIPLIER = 1024;

export default class AnthosStorageUsageCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  static mbToTb(value) {
    return value / STORAGE_SIZE_MULTIPLIER / STORAGE_SIZE_MULTIPLIER;
  }

  $onInit() {
    this.data = {
      systemPercentage:
        (this.storageUsage.reservedSize / this.storageUsage.totalSize) * 100,
      volumesPercentage:
        (this.storageUsage.usedSize / this.storageUsage.totalSize) * 100,
      usedSpace: this.storageUsage.reservedSize + this.storageUsage.usedSize,
      occupiedPercentage: parseFloat(
        (
          ((this.storageUsage.usedSize + this.storageUsage.reservedSize) /
            this.storageUsage.totalSize) *
          100
        ).toFixed(2),
      ),
    };
  }
}
