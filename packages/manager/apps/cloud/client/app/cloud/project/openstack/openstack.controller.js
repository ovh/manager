(() => {
  class CloudProjectOpenstackCtrl {
    constructor($state, CucCloudMessage, $stateParams) {
      this.$state = $state;
      this.CucCloudMessage = CucCloudMessage;
      this.serviceName = $stateParams.projectId;

      this.messages = [];
    }

    $onInit() {
      this.loadMessages();
    }

    loadMessages() {
      this.CucCloudMessage.unSubscribe('iaas.pci-project.compute.openstack');
      this.messageHandler = this.CucCloudMessage.subscribe(
        'iaas.pci-project.compute.openstack',
        { onMessage: () => this.refreshMessage() },
      );
    }

    refreshMessage() {
      this.messages = this.messageHandler.getMessages();
    }
  }

  angular
    .module('managerApp')
    .controller('CloudProjectOpenstackCtrl', CloudProjectOpenstackCtrl);
})();
