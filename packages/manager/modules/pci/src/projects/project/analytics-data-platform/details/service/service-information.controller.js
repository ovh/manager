import {
  ANALYTICS_DATA_PLATFORM_SERVICES,
  ANALYTICS_DATA_PLATFORM_STATUS_MAP,
  ANALYTICS_DATA_PLATFORM_CLUSTER_MANAGE,
} from '../../analytics-data-platform.constants';

export default class {
  /* @ngInject */
  constructor(
    analyticsDataPlatformService,
    CucControllerHelper,
    CucCloudMessage,
    ovhManagerRegionService,
    CucServiceHelper,
  ) {
    this.analyticsDataPlatformService = analyticsDataPlatformService;
    this.cucControllerHelper = CucControllerHelper;
    this.cucServiceHelper = CucServiceHelper;
    this.cucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.ANALYTICS_DATA_PLATFORM_SERVICES = ANALYTICS_DATA_PLATFORM_SERVICES;
    this.ANALYTICS_DATA_PLATFORM_CLUSTER_MANAGE = ANALYTICS_DATA_PLATFORM_CLUSTER_MANAGE;
    this.ANALYTICS_DATA_PLATFORM_STATUS_MAP = ANALYTICS_DATA_PLATFORM_STATUS_MAP;
  }

  $onInit() {
    this.subscribeToMessages();
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  subscribeToMessages() {
    this.cucCloudMessage.unSubscribe(
      'pci.projects.project.analytics-data-platform.details.service',
    );
    this.messageHandler = this.cucCloudMessage.subscribe(
      'pci.projects.project.analytics-data-platform.details.service',
      { onMessage: () => this.refreshMessage() },
    );
  }

  /**
   * get analyticsDataPlatform service urls
   *
   * @param {*} analyticsDataPlatformServiceName analyticsDataPlatform service name like AMBARI
   * @param {*} analyticsDataPlatformClusterServiceName analyticsDataPlatform cluster service name
   * @returns constructed url to manage analyticsDataPlatform cluster services
   */
  getAnalyticsDataPlatformServiceUrl(
    analyticsDataPlatformServiceName,
    analyticsDataPlatformClusterServiceName,
  ) {
    return this.ANALYTICS_DATA_PLATFORM_CLUSTER_MANAGE[
      analyticsDataPlatformServiceName
    ].replace('serviceName', analyticsDataPlatformClusterServiceName);
  }
}
