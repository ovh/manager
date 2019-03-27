export default class CloudProjectOpenstackCtrl {
  /* @ngInject */
  constructor(
    $state,
    CucCloudMessage,
    $stateParams,
  ) {
    this.$state = $state;
    this.CucCloudMessage = CucCloudMessage;
    this.serviceName = $stateParams.projectId;

    this.messages = [];
  }

  $onInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.legacy.compute.openstack');
    this.messageHandler = this.CucCloudMessage.subscribe('pci.projects.project.legacy.compute.openstack', { onMessage: () => this.refreshMessage() });
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }
}
