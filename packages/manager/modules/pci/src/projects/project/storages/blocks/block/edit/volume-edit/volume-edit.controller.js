import angular from 'angular';

import { VOLUME_MAX_SIZE, VOLUME_MIN_SIZE } from '../../../block.constants';

export default class PciProjectStorageVolumeEditController {
  /* @ngInject */
  constructor(
    $timeout,
    $translate,
    ovhManagerRegionService,
    PciProjectStorageBlockService,
  ) {
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.PciProjectStorageBlockService = PciProjectStorageBlockService;
  }

  $onInit() {
    this.size = {
      min: VOLUME_MIN_SIZE,
      max: VOLUME_MAX_SIZE,
    };

    if (angular.isUndefined(this.sizeEditable)) {
      this.sizeEditable = false;
    }

    if (!this.sizeEditable) {
      this.size.min = this.storage.size;
      this.size.max = this.storage.size;
    }

    if (angular.isUndefined(this.displayBootable)) {
      this.displayBootable = false;
    }

    this.loading = true;
    return this.$translate
      .refresh()
      .then(() => this.getAvailableQuota())
      .then(() => this.estimatePrice())
      .finally(() => {
        this.loading = false;
      });
  }

  getAvailableQuota() {
    return this.PciProjectStorageBlockService.getAvailableQuota(
      this.projectId,
      this.storage,
    ).then((availableQuota) => {
      this.size.min = this.storage.size;
      this.size.max = availableQuota;
    });
  }

  estimatePrice() {
    // Wait the next digest because oui-numeric use the viewValue whens calling on-change callback
    return this.$timeout(angular.noop, 0)
      .then(() =>
        this.PciProjectStorageBlockService.getVolumePriceEstimation(
          this.projectId,
          this.storage,
        ),
      )
      .then((estimatedPrice) => {
        this.estimatedPrice = estimatedPrice;
      });
  }

  save() {
    return this.onSubmit(this.storage);
  }
}
