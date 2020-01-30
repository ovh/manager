import { ANALYTICS_DATA_PLATFORM_STATUS_MAP } from '../../analytics-data-platform.constants';

export default class {
  /* @ngInject */
  constructor($state, analyticsDataPlatformService) {
    this.$state = $state;
    this.analyticsDataPlatformService = analyticsDataPlatformService;
    this.ANALYTICS_DATA_PLATFORM_STATUS_MAP = ANALYTICS_DATA_PLATFORM_STATUS_MAP;
  }

  refresh() {
    this.analyticsDataPlatformService.clearPlatformAllCache();
    this.$state.reload();
  }
}
