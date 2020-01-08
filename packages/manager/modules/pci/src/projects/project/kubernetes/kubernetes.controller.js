export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, OvhApiCloudProjectKube) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;
  }

  $onInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('kubernetes');
    this.messageHandler = this.CucCloudMessage.subscribe('kubernetes', {
      onMessage: () => this.refreshMessages(),
    });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getKubernetes({ id: kubeId }) {
    return this.OvhApiCloudProjectKube.v6().get({
      serviceName: this.projectId,
      kubeId,
    }).$promise;
  }

  getDetailsState(id) {
    return `pci.projects.project.kubernetes.details({ projectId: '${this.projectId}', kubeId: '${id}'})`;
  }
}
