(() => {
  class CloudProjectBillingCtrl {
    constructor(CucCloudMessage, $stateParams) {
      this.CucCloudMessage = CucCloudMessage;
      this.serviceName = $stateParams.projectId;

      this.messages = [];
    }

    $onInit() {
      this.loadMessage();
    }

    loadMessage() {
      this.CucCloudMessage.unSubscribe('iaas.pci-project.billing');
      this.messageHandler = this.CucCloudMessage.subscribe(
        'iaas.pci-project.billing',
        { onMessage: () => this.refreshMessage() },
      );
    }

    refreshMessage() {
      this.messages = this.messageHandler.getMessages();
    }
  }

  angular
    .module('managerApp')
    .controller('CloudProjectBillingCtrl', CloudProjectBillingCtrl);
})();
