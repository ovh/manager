class IpLoadBalancerDetailCtrl {
  constructor(
    $stateParams,
    CucCloudMessage,
    CucCloudNavigation,
    IpLoadBalancerConfigurationService,
  ) {
    this.$stateParams = $stateParams;
    this.CucCloudMessage = CucCloudMessage;
    this.CucCloudNavigation = CucCloudNavigation;
    this.IpLoadBalancerConfigurationService = IpLoadBalancerConfigurationService;
    this.messages = [];

    this.serviceName = $stateParams.serviceName;
  }

  $onInit() {
    this.CucCloudNavigation.init({
      state: 'network.iplb.detail',
      stateParams: {
        serviceName: this.serviceName,
      },
    });

    this.CucCloudMessage.unSubscribe('network.iplb.detail');
    this.messageHandler = this.CucCloudMessage.subscribe('network.iplb.detail', { onMessage: () => this.refreshMessage() });
    this.checkPendingChanges();
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  checkPendingChanges() {
    this.IpLoadBalancerConfigurationService.getPendingChanges(
      this.serviceName,
    )
      .then(changes => _.chain(changes).map('number').sum().value() > 0)
      .then((hasChanges) => {
        if (hasChanges) {
          this.IpLoadBalancerConfigurationService.showRefreshWarning();
        }
      });
  }
}

angular.module('managerApp').controller('IpLoadBalancerDetailCtrl', IpLoadBalancerDetailCtrl);
