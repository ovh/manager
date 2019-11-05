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
      state: 'vps.detail',
      stateParams: {
        serviceName: this.serviceName,
      },
    });
    this.VpsTaskService.initPoller(this.serviceName, 'vps.detail');
    this.$scope.$on('$destroy', () => this.VpsTaskService.stopTaskPolling());
  }

  loadMessage() {
    this.CucCloudMessage.unSubscribe('vps.detail');
    this.messageHandler = this.CucCloudMessage.subscribe('vps.detail', { onMessage: () => this.refreshMessage() });
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }
}
