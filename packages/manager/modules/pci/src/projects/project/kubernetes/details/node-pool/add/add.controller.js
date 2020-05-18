import get from 'lodash/get';
import { DEFAULT_NODE_COUNT } from '../../../add/add.constants';

import { NODE_POOL_NAME_REGEX } from './add.constants';

export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, Kubernetes, OvhApiCloudProjectKube) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.Kubernetes = Kubernetes;
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;
  }

  $onInit() {
    this.NODE_POOL_NAME_REGEX = NODE_POOL_NAME_REGEX;
    this.isAdding = false;
    this.nodePool = {
      name: null,
      flavor: null,
      nodeCount: DEFAULT_NODE_COUNT,
      monthlyBilling: false,
    };
    this.loadMessages();
    this.loadFlavors(this.region.name);
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'pci.projects.project.kubernetes.details.nodepools.add',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.kubernetes.details.nodepools.add',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  create() {
    this.isAdding = true;
    return this.Kubernetes
      .createNodePool(
        this.projectId,
        this.kubeId,
        this.nodePool.nodeCount,
        this.nodePool.flavor.name,
        this.nodePool.name,
      )
      .then(() =>
        this.goBack(
          this.$translate.instant('kube_add_node_pool_success', {
            nodePoolName: this.nodePool.name,
          }),
          'success',
        ),
      )
      .catch((error) => {
        this.CucCloudMessage.error(
          this.$translate.instant('kube_add_node_pool_error', {
            nodePoolName: this.nodePool.name,
            message: get(error, 'data.message', error.message),
          }),
        );
      })
      .finally(() => {
        this.isAdding = false;
      });
  }

  loadFlavors(region) {
    this.loadingFlavors = true;
    this.Kubernetes.getAvailableFlavors(region, this.projectId)
      .then((flavors) => {
        this.flavors = flavors;
      })
      .catch((error) => {
        this.CucCloudMessage.error(
          this.$translate.instant('kube_common_flavor_load_error', {
            message: get(error, 'data.message'),
          }),
        );
      })
      .finally(() => {
        this.loadingFlavors = false;
      });
  }
}
