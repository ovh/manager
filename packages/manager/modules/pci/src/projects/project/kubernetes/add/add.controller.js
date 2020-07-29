import find from 'lodash/find';
import get from 'lodash/get';

import Datacenter from '../../../../components/project/regions-list/datacenter.class';
import { READY_STATUS, DEFAULT_NODE_COUNT } from './add.constants';

export default class {
  /* @ngInject */
  constructor($translate, $q, CucCloudMessage, Kubernetes, OvhApiCloudProjectKube, Poller) {
    this.$translate = $translate;
    this.$q = $q;
    this.CucCloudMessage = CucCloudMessage;
    this.Kubernetes = Kubernetes;
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;
    this.Poller = Poller;
  }

  $onInit() {
    this.isAdding = false;
    this.cluster = {
      region: null,
      version: null,
      name: null,
      nodePool: {
        flavor: null,
        nodeCount: DEFAULT_NODE_COUNT,
        monthlyBilling: false,
      },
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
    return this.Kubernetes
      .createCluster(
        this.projectId,
        this.cluster.name,
        this.cluster.region.name,
        this.cluster.version,
        this.cluster.nodePool.nodeCount,
        this.cluster.nodePool.flavor.name,
      )
      .then((response) => this.checkKubernetesStatus(this.projectId, response.data.id))
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
    this.OvhApiCloudProjectKube.v6().resetQueryCache();
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

  loadFlavors(region) {
    this.loadingFlavors = true;
    return this.Kubernetes.getAvailableFlavors(region, this.projectId)
      .then((flavors) => {
        this.flavors = flavors;
        return this.flavors;
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

  onRegionSubmit() {
    this.cluster.region = new Datacenter({
      name: this.cluster.region.name,
      quota: find(this.quotas, { region: this.cluster.region.name }),
    });
    this.loadFlavors(this.cluster.region.name);
    this.displaySelectedRegion = true;
  }

  onNodePoolFocus() {
    this.displaySelectedFlavor = false;
  }

  onNodePoolSubmit() {
    this.displaySelectedFlavor = true;
  }
}
