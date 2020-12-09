import isUndefined from 'lodash/isUndefined';

import { ANALYTICS_DATA_PLATFORM_INPUT_NUMBER_PATTERN } from '../../analytics-data-platform.constants';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.INPUT_NUMBER_PATTERN = ANALYTICS_DATA_PLATFORM_INPUT_NUMBER_PATTERN;
    this.data = {
      hdfsEffectiveStorage: 0,
      edgeNodeStorage: 0,
    };
  }

  $onInit() {
    this.data.hdfsEffectiveStorage = this.storage.hdfsEffectiveStorage;
    this.data.edgeNodeStorage = this.edgeNodeStorage;
  }

  dataChange() {
    this.onDataChange({ data: this.data });
  }

  getStoragePerNode() {
    return isUndefined(this.data.hdfsEffectiveStorage)
      ? '-'
      : `${
          (this.data.hdfsEffectiveStorage *
            this.selectedCapability.hdfsReplicationFactor) /
          this.nodesConfig.worker.count
        } ${this.$translate.instant('analytics_data_platform_common_unit_gb')}`;
  }

  getTotalStorage() {
    return isUndefined(this.data.hdfsEffectiveStorage)
      ? '-'
      : `${
          this.data.hdfsEffectiveStorage *
          this.selectedCapability.hdfsReplicationFactor
        } ${this.$translate.instant('analytics_data_platform_common_unit_gb')}`;
  }

  getTotalEffectiveStorage() {
    return isUndefined(this.data.edgeNodeStorage)
      ? '-'
      : `${
          this.data.edgeNodeStorage * this.nodesConfig.edge.count
        } ${this.$translate.instant('analytics_data_platform_common_unit_gb')}`;
  }
}
