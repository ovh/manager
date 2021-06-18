import { getCriteria } from '../project.utils';

export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, OvhApiCloudProjectKube, Kubernetes) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;
    this.Kubernetes = Kubernetes;
  }

  $onInit() {
    this.loadMessages();
    this.criteria = getCriteria('id', this.clusterId);
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
    return this.OvhApiCloudProjectKube.v6()
      .get({
        serviceName: this.projectId,
        kubeId,
      })
      .$promise.then((kube) => ({
        ...kube,
        privateNetworkName: this.Kubernetes.constructor.getPrivateNetworkName(
          this.privateNetworks,
          kube.privateNetworkId,
        ),
      }));
  }

  getDetailsState(id) {
    return `pci.projects.project.kubernetes.details({ projectId: '${this.projectId}', kubeId: '${id}'})`;
  }
}
