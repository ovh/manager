import get from 'lodash/get';

import {
  CONFIG_FILENAME,
  KUBECONFIG_URL,
  KUBECTL_URL,
  VERSIONS_GUIDE_URL,
} from './service.constants';
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
    this.CONFIG_FILENAME = CONFIG_FILENAME;
    this.KUBECONFIG_URL = KUBECONFIG_URL;
    this.KUBECTL_URL = KUBECTL_URL;
    this.VERSIONS_GUIDE_URL = VERSIONS_GUIDE_URL;
    this.STATUS = STATUS;
    this.loadingKubeConfig = false;
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'pci.projects.project.kubernetes.details.service',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.kubernetes.details.service',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  downloadConfigFile() {
    this.loadingKubeConfig = true;
    return this.getKubeConfig()
      .then((config) => {
        // Set yml extension manually as there is no MIME type yet
        this.CucControllerHelper.constructor.downloadContent({
          fileContent: config.content,
          fileName: `${config.fileName}.yml`,
        });
      })
      .catch((error) =>
        this.CucCloudMessage.error(
          `${this.$translate.instant('kube_service_file_error')} : ${get(
            error,
            'data.message',
          )}`,
        ),
      )
      .finally(() => {
        this.loadingKubeConfig = false;
      });
  }
}
