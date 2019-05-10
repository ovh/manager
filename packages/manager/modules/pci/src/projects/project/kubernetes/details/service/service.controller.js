import { KUBECONFIG_URL, KUBECTL_URL } from './service.constants';
import { STATUS } from '../constants';

export default class KubernetesServiceCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $state,
    $translate,
    CucCloudMessage,
    CucControllerHelper,
    Kubernetes,
  ) {
    this.$scope = $scope;
    this.$state = $state;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucControllerHelper = CucControllerHelper;
    this.Kubernetes = Kubernetes;
  }

  $onInit() {
    this.KUBECONFIG_URL = KUBECONFIG_URL;
    this.KUBECTL_URL = KUBECTL_URL;
    this.STATUS = STATUS;

    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.kubernetes.details.service');
    this.messageHandler = this.CucCloudMessage.subscribe('pci.projects.project.kubernetes.details.service', { onMessage: () => this.refreshMessages() });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  downloadConfigFile() {
    // Set yml extension manually as there is no MIME type yet
    this.CucControllerHelper.constructor.downloadContent({ fileContent: this.kubernetesConfig.content, fileName: `${this.kubernetesConfig.fileName}.yml` });
  }
}
