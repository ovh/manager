import map from 'lodash/map';
import sumBy from 'lodash/sumBy';
import uniq from 'lodash/uniq';
import reduce from 'lodash/reduce';
import set from 'lodash/set';

import {
  ANALYTICS_DATA_PLATFORM_COMPUTE,
  ANALYTICS_DATA_PLATFORM_STATUS_MAP,
} from '../../analytics-data-platform.constants';

export default class {
  /* @ngInject */
  constructor(
    $state,
    $translate,
    analyticsDataPlatformService,
    ovhManagerRegionService,
    CucServiceHelper,
  ) {
    this.$state = $state;
    this.analyticsDataPlatformService = analyticsDataPlatformService;
    this.cucServiceHelper = CucServiceHelper;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.ALL_NODES_OPTION = $translate.instant(
      'analytics_data_platform_service_cluster_option_all',
    );
    this.ANALYTICS_DATA_PLATFORM_STATUS_MAP = ANALYTICS_DATA_PLATFORM_STATUS_MAP;
    this.ANALYTICS_DATA_PLATFORM_COMPUTE = ANALYTICS_DATA_PLATFORM_COMPUTE;
    this.totalCores = 0;
    this.totalRam = 0;
    this.totalStorage = 0;
  }

  $onInit() {
    this.clusterList = this.clusterNodes;
    this.clusterTypeOptions = {
      values: {
        MASTER: 'MASTER',
        SLAVE: 'SLAVE',
        EDGE: 'EDGE',
        UTILITY: 'UTILITY',
        BASTION: 'BASTION',
      },
    };
    const uniqueRegions = uniq(map(this.clusterList, 'osRegion'));
    this.regionOptions = {
      values: reduce(
        uniqueRegions,
        (result, value) => {
          set(result, value, value);
          return result;
        },
        {},
      ),
    };
    this.totalCores = sumBy(this.clusterNodes, 'vcpus');
    this.totalRam = sumBy(this.clusterNodes, 'ram');
    this.totalStorage = sumBy(this.clusterNodes, 'storage');
  }

  refresh() {
    this.analyticsDataPlatformService.clearPlatformNodeAllCache();
    this.$state.reload();
  }
}
