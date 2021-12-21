import find from 'lodash/find';
import get from 'lodash/get';
import some from 'lodash/some';

import Datacenter from '../../../../components/project/regions-list/datacenter.class';
import { READY_STATUS } from './add.constants';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    $q,
    CucCloudMessage,
    Kubernetes,
    OvhApiCloudProjectKube,
    Poller,
    coreURLBuilder,
  ) {
    this.$translate = $translate;
    this.$q = $q;
    this.CucCloudMessage = CucCloudMessage;
    this.Kubernetes = Kubernetes;
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;
    this.Poller = Poller;
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    this.isAdding = false;
    this.defaultPrivateNetwork = {
      id: null,
      name: this.$translate.instant('kubernetes_add_private_network_none'),
    };
    this.cluster = {
      region: null,
      version: null,
      name: null,
      privateNetwork: this.defaultPrivateNetwork,
      nodePool: {
        antiAffinity: false,
        flavor: null,
        monthlyBilling: false,
        autoscaling: this.autoscaling,
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
    this.sendKubeTrack('add::confirm');

    const { nodePool } = this.cluster;
    const { nodes, autoscale } = nodePool.autoscaling;
    const { lowest, desired, highest } = nodes;

    this.isAdding = true;
    const options = {
      flavorName: nodePool.flavor.name,
      antiAffinity: nodePool.antiAffinity,
      monthlyBilled: nodePool.monthlyBilling,
      autoscale: nodePool.autoscaling.autoscale,
      ...(autoscale && { minNodes: lowest.value }),
      desiredNodes: autoscale ? lowest.value : desired.value,
      ...(autoscale && { maxNodes: highest.value }),
    };
    return this.Kubernetes.createCluster(
      this.projectId,
      this.cluster.name,
      this.cluster.region.name,
      this.cluster.version,
      this.cluster.privateNetwork.clusterRegion?.openstackId,
      options,
    )
      .then((response) =>
        this.checkKubernetesStatus(this.projectId, response.data.id),
      )
      .then(() =>
        this.goBack(this.$translate.instant('kubernetes_add_success')),
      )
      .catch((error) => {
        if (get(error, 'data.status') === 412) {
          // If error code is 412
          const errorMessage = get(error, 'data.message');
          const errorId = errorMessage.slice(
            errorMessage.indexOf('[') + 1,
            errorMessage.indexOf(']'),
          );
          const quotaUrl = this.coreURLBuilder.buildURL(
            'public-cloud',
            `#/pci/projects/${this.projectId}/quota`,
          );
          this.CucCloudMessage.error({
            textHtml: `${this.$translate.instant(
              `kubernetes_add_error_${errorId}`,
            )} <a class="oui-link_icon" href="${quotaUrl}">${this.$translate.instant(
              `kubernetes_add_error_quota_link`,
            )} <span class="oui-icon oui-icon-external-link" aria-hidden="true"></span></a>`,
          });
        } else {
          this.CucCloudMessage.error(
            this.$translate.instant('kubernetes_add_error', {
              message: get(error, 'data.message'),
            }),
          );
        }
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

  loadPrivateNetworks() {
    this.availablePrivateNetworks = [
      this.defaultPrivateNetwork,
      ...this.Kubernetes.constructor.getAvailablePrivateNetworks(
        this.privateNetworks,
        this.cluster.region.name,
      ),
    ];
    if (
      !some(this.availablePrivateNetworks, {
        id: this.cluster.privateNetwork?.id,
      })
    ) {
      this.cluster.privateNetwork = this.defaultPrivateNetwork;
    }
  }

  setClusterRegion(isRegionEnabled = false) {
    this.cluster.region = new Datacenter({
      name: this.cluster.region.name,
      enabled: isRegionEnabled || this.cluster.region.enabled,
      quota: find(this.quotas, { region: this.cluster.region.name }),
    });
  }

  onRegionSubmit() {
    this.setClusterRegion();
    this.loadPrivateNetworks();

    if (this.cluster.region.enabled) {
      this.loadFlavors(this.cluster.region.name);
    }

    this.displaySelectedRegion = true;
  }

  onKubeVersionFocus() {
    const { region } = this.cluster;
    const { name, enabled } = region;
    this.displaySelectedRegion = true;

    if (!enabled) {
      this.isAddingNewRegion = true;

      return this.Kubernetes.addRegion(this.projectId, region)
        .then(() => this.loadQuotas())
        .then((quotas) => {
          this.quotas = quotas;
          return this.quotas;
        })
        .then(() => this.setClusterRegion(true))
        .then(() => {
          this.isAddingNewRegion = false;
        })
        .catch(({ data: error }) => {
          this.currentStep = 0;
          this.displaySelectedRegion = false;
          this.CucCloudMessage.error(
            this.$translate.instant('kubernetes_add_region_failed', {
              name,
              message: error.message,
            }),
          );
          return this.$q.reject();
        })
        .then(() => this.loadFlavors(this.cluster.region.name))
        .catch(() => {});
    }

    return undefined;
  }

  onNodePoolFocus() {
    this.displaySelectedFlavor = false;
  }

  onNodePoolSubmit() {
    const { nodes } = this.cluster.nodePool.autoscaling;

    this.displaySelectedFlavor = true;
    if (nodes.desired.value > this.antiAffinityMaxNodes) {
      this.cluster.nodePool.antiAffinity = false;
    }
  }
}
