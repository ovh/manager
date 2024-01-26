import find from 'lodash/find';
import get from 'lodash/get';
import some from 'lodash/some';

import Datacenter from '../../../../components/project/regions-list/datacenter.class';
import { NAME_INPUT_CONSTRAINTS } from '../kubernetes.constants';
import { TAGS_BLOB } from '../../../../constants';
import {
  KUBE_CONTAINER_MESSAGES,
  KUBE_PRIVATE_NETWORKS_SUBNET_DOC,
} from './add.constants';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    $q,
    $anchorScroll,
    CucCloudMessage,
    Kubernetes,
    OvhApiCloudProjectKube,
    coreConfig,
  ) {
    this.$translate = $translate;
    this.$q = $q;
    this.$anchorScroll = $anchorScroll;
    this.CucCloudMessage = CucCloudMessage;
    this.Kubernetes = Kubernetes;
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;

    this.inputConstraints = NAME_INPUT_CONSTRAINTS;
    this.KUBE_CONTAINER_MESSAGES = KUBE_CONTAINER_MESSAGES;
    this.addPrivateNetworksSubnetLink =
      KUBE_PRIVATE_NETWORKS_SUBNET_DOC[coreConfig.getUser().ovhSubsidiary] ??
      KUBE_PRIVATE_NETWORKS_SUBNET_DOC.DEFAULT;
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
      network: {
        private: this.defaultPrivateNetwork,
        gateway: {
          enabled: false, // false -> OVHcloud gateway, true -> vRack gateway
          ip: '',
        },
      },
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

  IsComingSoonPricingBannerDisplayed() {
    return this.cluster.nodePool?.flavor?.tagsBlob?.includes(
      TAGS_BLOB.COMING_SOON,
    );
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
      this.cluster.network.private?.clusterRegion?.openstackId,
      this.cluster.network.private?.subnet?.id,
      this.cluster.network.gateway,
      options,
    )
      .then(() =>
        this.goBack(this.$translate.instant('kubernetes_add_success')),
      )
      .catch((error) => {
        const errorId = this.getKubeApiErrorId(error);
        let errorMessage = this.$translate.instant('kubernetes_add_error', {
          message: error.data?.message,
        });
        if (errorId) {
          const translateMessage = this.$translate.instant(
            `kubernetes_add_error_${errorId}`,
          );
          errorMessage = {
            textHtml: `${translateMessage} <a class="oui-link_icon" href="${this.getQuotaBuildUrl()}">${this.$translate.instant(
              'kubernetes_add_error_quota_link',
            )} <span class="oui-icon oui-icon-external-link" aria-hidden="true"></span></a>`,
          };
        }
        this.CucCloudMessage.error(errorMessage);

        this.$anchorScroll(KUBE_CONTAINER_MESSAGES);
      })
      .finally(() => {
        this.isAdding = false;
      });
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
        id: this.cluster.network.private?.id,
      })
    ) {
      this.cluster.privateNetwork = this.defaultPrivateNetwork;
    }
  }

  loadPrivateNetworkSubnets() {
    this.privateNetworkSubnets = null;
    this.privateNetworkSubnetsError = null;

    if (this.cluster.network.private) {
      this.cluster.network.private.subnet = null;
    }

    if (!this.cluster.network.private?.id) {
      return null;
    }

    this.isLoadingPrivateNetworkSubnets = true;

    return this.Kubernetes.getPrivateNetworkSubnets(
      this.projectId,
      this.cluster.network.private.id,
    )
      .then((subnets) => {
        if (!subnets.length) {
          return;
        }
        this.privateNetworkSubnets = subnets;
        const [firstSubnet] = subnets;
        this.cluster.network.private.subnet = firstSubnet;
        this.onPrivateNetworkSubnetChanged(firstSubnet);
      })
      .catch((error) => {
        this.privateNetworkSubnetsError = {
          type: 'error',
          message: this.$translate.instant(
            'kubernetes_add_private_network_subnet_error_default',
            { error: error.data?.message || error.message },
          ),
        };
      })
      .finally(() => {
        this.isLoadingPrivateNetworkSubnets = false;
      });
  }

  onPrivateNetworkSubnetChanged({ gatewayIp } = {}) {
    this.privateNetworkSubnetsError = !gatewayIp
      ? {
          type: 'warning',
          message: this.$translate.instant(
            'kubernetes_add_private_network_subnet_error_no_gateway_ip',
          ),
        }
      : null;
  }

  setClusterRegion(isRegionEnabled = false) {
    this.cluster.region = new Datacenter({
      name: this.cluster.region.name,
      enabled: isRegionEnabled || this.cluster.region.enabled,
      quota: find(this.quotas, { region: this.cluster.region.name }),
    });
  }

  isValidNetworkConfig() {
    return (
      !this.cluster.network.private?.id ||
      Boolean(this.cluster.network.private?.subnet?.id)
    );
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
    this.displaySelectedVersion = false;

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

  isBillingWarningMessageDisplayed() {
    return (
      this.cluster.nodePool.monthlyBilling &&
      this.cluster.nodePool.autoscaling.autoscale
    );
  }

  onNodePoolSubmit() {
    const { nodes } = this.cluster.nodePool.autoscaling;

    this.displaySelectedFlavor = true;
    if (nodes.desired.value > this.antiAffinityMaxNodes) {
      this.cluster.nodePool.antiAffinity = false;
    }
  }
}
