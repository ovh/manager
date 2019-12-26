import replace from 'lodash/replace';

import { ANALYTICS_DATA_PLATFORM_CLUSTER_NAME_PATTERN } from '../../analytics-data-platform.constants';

export default class {
  /* @ngInject */
  constructor() {
    this.CLUSTER_NAME_PATTERN = ANALYTICS_DATA_PLATFORM_CLUSTER_NAME_PATTERN;
    this.data = {
      clusterName: '',
      selectedCapability: null,
    };
    this.selectedAdpVersion = null;
  }

  dataChange() {
    if (this.data.selectedCapability) {
      this.selectedAdpVersion = replace(
        this.data.selectedCapability.version,
        ' ',
        '',
      );
    }
    this.onDataChange({ data: this.data });
  }
}
