import get from 'lodash/get';
import { READY_STATUS } from './add.constants';

export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, OvhApiCloudProjectKube, Poller) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;
    this.Poller = Poller;
  }

  $onInit() {
    this.isAdding = false;

    this.cluster = {
      region: null,
      version: null,
      name: null,
    };

    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.kubernetes.add');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.kubernetes.add',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  create() {
    this.isAdding = true;
    return this.OvhApiCloudProjectKube.v6()
      .save(
        {
          serviceName: this.projectId,
        },
        {
          ...this.cluster,
          region: this.cluster.region.name,
        },
      )
      .$promise.then(({ id }) => this.checkKubernetesStatus(this.projectId, id))
      .then(() =>
        this.goBack(this.$translate.instant('kubernetes_add_success')),
      )
      .catch((error) => {
        this.CucCloudMessage.error(
          this.$translate.instant('kubernetes_add_error', {
            message: get(error, 'data.message'),
          }),
        );
      })
      .finally(() => {
        this.isAdding = false;
      });
  }

  checkKubernetesStatus(serviceName, kubeId) {
    this.OvhApiCloudProjectKube.v6().resetCache();
    return this.Poller.poll(
      `/cloud/project/${serviceName}/kube/${kubeId}`,
      {},
      {
        method: 'get',
        retryMaxAttempts: 6,
        successRule: {
          status: READY_STATUS,
        },
      },
    );
  }
}
