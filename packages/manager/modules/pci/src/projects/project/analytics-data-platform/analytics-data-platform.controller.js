import {
  ANALYTICS_DATA_PLATFORM_STATUS_MAP,
  ANALYTICS_DATA_PLATFORM_STATUS,
} from './analytics-data-platform.constants';

import { getCriteria } from '../project.utils';

export default class {
  /* @ngInject */
  constructor(
    $state,
    CucCloudMessage,
    analyticsDataPlatformService,
    CucRegionService,
  ) {
    this.$state = $state;
    this.cucCloudMessage = CucCloudMessage;
    this.analyticsDataPlatformService = analyticsDataPlatformService;
    this.cucRegionService = CucRegionService;
  }

  $onInit() {
    this.STATUS_CLASS = ANALYTICS_DATA_PLATFORM_STATUS_MAP;
    this.ADP_STATUS = ANALYTICS_DATA_PLATFORM_STATUS;
    this.subscribeToMessages();
    this.criteria = getCriteria('serviceName', this.clusterId);
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  subscribeToMessages() {
    this.cucCloudMessage.unSubscribe(
      'pci.projects.project.analytics-data-platform',
    );
    this.messageHandler = this.cucCloudMessage.subscribe(
      'pci.projects.project.analytics-data-platform',
      { onMessage: () => this.refreshMessage() },
    );
  }

  refresh() {
    this.analyticsDataPlatformService.clearPlatformAllCache();
    this.$state.reload();
  }
}
