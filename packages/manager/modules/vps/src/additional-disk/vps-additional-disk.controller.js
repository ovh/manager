import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import map from 'lodash/map';

import { VPS_DISK_STATES } from './vps-additional-disk.constants';

export default class {
  /* @ngInject */
  constructor($q, $translate, CucCloudMessage, VpsService) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.VpsService = VpsService;

    this.loaders = {
      init: false,
      disk: false,
    };
    this.additionalDisks = [];
  }

  $onInit() {
    this.hasAdditionalDiskOption = get(
      this.tabSummary,
      'additionalDisk.optionAvailable',
      false,
    );
    this.hasAdditionalDisk();
  }

  static getDiskStateInfo({ state }) {
    return {
      error: VPS_DISK_STATES.ERROR.includes(state),
      warning: VPS_DISK_STATES.WARNING.includes(state),
      success: VPS_DISK_STATES.SUCCESS.includes(state),
    };
  }

  hasAdditionalDisk() {
    this.loaders.init = true;
    const additionalDiskPromise = this.hasAdditionalDiskOption
      ? this.loadAdditionalDisks()
      : this.$q.when();

    return additionalDiskPromise.finally(() => {
      this.loaders.init = false;
    });
  }

  loadAdditionalDisks() {
    this.loaders.disk = true;
    return this.VpsService.getDisks(this.serviceName)
      .then((data) => {
        const promises = map(data, (elem) =>
          this.VpsService.getDiskInfo(this.serviceName, elem),
        );
        return this.$q.all(promises).then((diskInfos) => {
          this.additionalDisks = this.VpsService.showOnlyAdditionalDisk(
            diskInfos,
          );
        });
      })
      .catch((error) => {
        this.CucCloudMessage.error(
          this.$translate.instant('vps_additional_disk_info_fail'),
        );
        return this.$q.reject(error);
      })
      .finally(() => {
        this.loaders.disk = false;
      });
  }

  canOrder() {
    return this.hasAdditionalDiskOption && isEmpty(this.additionalDisks);
  }
}
