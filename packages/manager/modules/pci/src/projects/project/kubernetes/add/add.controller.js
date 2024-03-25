import find from 'lodash/find';
import get from 'lodash/get';

import Datacenter from '../../../../components/project/regions-list/datacenter.class';
import { NAME_INPUT_CONSTRAINTS } from '../kubernetes.constants';
import { TAGS_BLOB } from '../../../../constants';
import { KUBE_CONTAINER_MESSAGES } from './add.constants';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    $q,
    $anchorScroll,
    CucCloudMessage,
    Kubernetes,
    OvhApiCloudProjectKube,
  ) {
    this.$translate = $translate;
    this.$q = $q;
    this.$anchorScroll = $anchorScroll;
    this.CucCloudMessage = CucCloudMessage;
    this.Kubernetes = Kubernetes;
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;

    this.inputConstraints = NAME_INPUT_CONSTRAINTS;
    this.KUBE_CONTAINER_MESSAGES = KUBE_CONTAINER_MESSAGES;
  }

  $onInit() {
    this.isAdding = false;
    this.cluster = {
      region: null,
      version: null,
      name: null,
      network: {
        private: null,
        gateway: {
          enabled: false, // false -> OVHcloud gateway, true -> vRack gateway
          ip: '',
        },
        subnet: null,
        loadBalancersSubnet: null,
      },
      nodePool: {
        antiAffinity: false,
        flavor: null,
        monthlyBilling: false,
        autoscaling: this.autoscaling,
      },
      proxy: null,
    };

    this.loadMessages();
  }

  get shouldShowSubnetForms() {
    return (
      Boolean(this.cluster.network?.private?.id) &&
      !this.isLoadingPrivateNetworkSubnets &&
      this.privateNetworkSubnets?.length > 0
    );
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
      this.cluster.network.subnet?.id,
      this.cluster.network.loadBalancersSubnet?.id,
      this.cluster.network.gateway,
      options,
      this.cluster.proxy,
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

  setClusterRegion(isRegionEnabled = false) {
    this.cluster.region = new Datacenter({
      name: this.cluster.region.name,
      enabled: isRegionEnabled || this.cluster.region.enabled,
      quota: find(this.quotas, { region: this.cluster.region.name }),
    });
  }

  isValidNetworkConfig() {
    const { private: privateNetwork, subnet } = this.cluster.network;
    return !privateNetwork?.id || Boolean(subnet?.id);
  }

  onRegionSubmit() {
    this.setClusterRegion();

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
