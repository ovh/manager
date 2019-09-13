export default class {
  /* @ngInject */
  constructor($filter, $scope, $stateParams, CucCloudMessage, CucCloudNavigation, VpsTaskService) {
    this.$filter = $filter;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.CucCloudMessage = CucCloudMessage;
    this.CucCloudNavigation = CucCloudNavigation;
    this.serviceName = $stateParams.serviceName;
    this.VpsTaskService = VpsTaskService;

    this.messages = [];
  }

  $onInit() {
    this.loadMessage();
    this.CucCloudNavigation.init({
      state: 'iaas.vps.detail',
      stateParams: {
        serviceName: this.serviceName,
      },
    });
    this.VpsTaskService.initPoller(this.serviceName, 'iaas.vps.detail');
    this.$scope.$on('$destroy', () => this.VpsTaskService.stopTaskPolling());
  }

  loadMessage() {
    this.CucCloudMessage.unSubscribe('iaas.vps.detail');
    this.messageHandler = this.CucCloudMessage.subscribe('iaas.vps.detail', { onMessage: () => this.refreshMessage() });
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }
}
