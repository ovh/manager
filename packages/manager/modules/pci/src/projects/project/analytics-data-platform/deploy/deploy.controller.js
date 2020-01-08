import cloneDeep from 'lodash/cloneDeep';
import ceil from 'lodash/ceil';
import find from 'lodash/find';
import floor from 'lodash/floor';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import has from 'lodash/has';
import head from 'lodash/head';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import round from 'lodash/round';
import set from 'lodash/set';
import some from 'lodash/some';
import sumBy from 'lodash/sumBy';
import times from 'lodash/times';
import values from 'lodash/values';

import {
  ANALYTICS_DATA_PLATFORM_COMPUTE,
  ANALYTICS_DATA_PLATFORM_FLAVOR_TYPES,
  ANALYTICS_DATA_PLATFORM_NODE_NAMES,
  ANALYTICS_DATA_PLATFORM_NODE_TYPES,
} from '../analytics-data-platform.constants';

export default class {
  /* @ngInject */
  constructor(
    $state,
    $translate,
    analyticsDataPlatformService,
    CucControllerHelper,
    CucCloudMessage,
    CucCurrencyService,
    CucServiceHelper,
  ) {
    this.$state = $state;
    this.$translate = $translate;
    this.ANALYTICS_DATA_PLATFORM_COMPUTE = ANALYTICS_DATA_PLATFORM_COMPUTE;
    this.ANALYTICS_DATA_PLATFORM_FLAVOR_TYPES = ANALYTICS_DATA_PLATFORM_FLAVOR_TYPES;
    this.ANALYTICS_DATA_PLATFORM_NODE_NAMES = ANALYTICS_DATA_PLATFORM_NODE_NAMES;
    this.ANALYTICS_DATA_PLATFORM_NODE_TYPES = ANALYTICS_DATA_PLATFORM_NODE_TYPES;
    this.analyticsDataPlatformService = analyticsDataPlatformService;
    this.cucControllerHelper = CucControllerHelper;
    this.cucCloudMessage = CucCloudMessage;
    this.cucCurrencyService = CucCurrencyService;
    this.cucServiceHelper = CucServiceHelper;

    this.displaySelectedRegion = true;
    this.selectedRegion = null;
    this.selectedCapability = null;
    this.selectedSshKey = null;
    this.nodesConfig = null;
    this.minimumNodesRequired = 0;
    this.maximumNodesRequired = 0;
    // analyticsDataPlatform request payload
    this.analyticsDataPlatform = {
      osProjectId: null,
      clusterName: null,
      clusterType: null,
      edgeNodeStorage: 0,
      hdfsEffectiveStorage: 0,
      masterPassword: null,
      nodes: [],
      sshPublicKey: null,
      osRegion: null,
      hdfsReplicationFactor: 0,
      masterNodeStorage: 0,
      osProjectName: null,
      osToken: null,
    };
    this.storage = {
      initialized: false,
      min_cluster_storage: 0,
      max_cluster_storage: 0,
      min_edge_node_storage: 0,
      max_edge_node_storage: 0,
      hdfsEffectiveStorage: 0,
    };
    this.price = {
      hourlyPrice: 0,
      monthlyPrice: 0,
    };
  }

  /**
   * calculates Analytics Data Platform price
   * Analytics Data Platform price is calculated by adding 20% of cloud price to cloud price
   * @static
   * @param {float} publicCloudPrice public cloud price
   * @returns Analytics Data Platform price
   */
  static getAnalyticsDataPlatformPrice(publicCloudPrice) {
    return publicCloudPrice + (publicCloudPrice * 20) / 100;
  }

  $onInit() {
    this.analyticsDataPlatform.osProjectId = this.projectId;
    this.cluster = {};
    this.cucCloudMessage.unSubscribe(
      'pci.projects.project.analytics-data-platform.deploy',
    );
    this.messageHandler = this.cucCloudMessage.subscribe(
      'pci.projects.project.analytics-data-platform.deploy',
      { onMessage: () => this.refreshMessage() },
    );
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  /** #####################################################################
      GENERAL INFORMATION
   * ##################################################################### */

  onGeneralInformationChange({ clusterName, selectedCapability }) {
    this.analyticsDataPlatform.clusterName = clusterName;
    this.selectedCapability = selectedCapability;
    this.onCapabilitySelect();
  }

  /**
   * Calculates the minimum nodes required by
   * summing up the min instances for each node type
   *
   * @returns the minimum number of nodes required
   */
  onCapabilitySelect() {
    this.resetRegionConfiguration();
    this.resetNodesConfiguration();
    this.resetStorageConfiguration();
    this.minimumNodesRequired =
      get(this.selectedCapability, ['bastionNode', 'instanceMin'], 0) +
      get(this.selectedCapability, ['edgeNode', 'instanceMin'], 0) +
      get(this.selectedCapability, ['masterNode', 'instanceMin'], 0) +
      get(this.selectedCapability, ['workerNode', 'instanceMin'], 0) +
      get(this.selectedCapability, ['utilityNode', 'instanceMin'], 0);
    this.maximumNodesRequired =
      get(this.selectedCapability, ['bastionNode', 'instanceMax'], 0) +
      get(this.selectedCapability, ['edgeNode', 'instanceMax'], 0) +
      get(this.selectedCapability, ['masterNode', 'instanceMax'], 0) +
      get(this.selectedCapability, ['workerNode', 'instanceMax'], 0) +
      get(this.selectedCapability, ['utilityNode', 'instanceMax'], 0);
    this.analyticsDataPlatform.masterNodeStorage = get(
      this.selectedCapability,
      ['masterNode', 'rawStorageMinGb'],
      100,
    );
  }

  /**
   * Saves the required data before the step is finalized
   */
  submitGeneralInformation() {
    if (this.selectedCapability) {
      set(
        this.analyticsDataPlatform,
        'clusterType',
        this.selectedCapability.version,
      );
      set(
        this.analyticsDataPlatform,
        'hdfsReplicationFactor',
        this.selectedCapability.hdfsReplicationFactor,
      );
      set(
        this.analyticsDataPlatform,
        'osProjectName',
        this.publicCloud.description,
      );
    }
  }

  /** #####################################################################
      SECURITY INFORMATION
   * ##################################################################### */

  onSecurityInformationChange({ masterPassword, selectedSshKey }) {
    this.analyticsDataPlatform.masterPassword = masterPassword;
    this.selectedSshKey = selectedSshKey;
  }

  /**
   * Saves the required data before the step is finalized
   */
  submitSecurityInformation() {
    if (this.selectedSshKey) {
      this.analyticsDataPlatform.sshPublicKey = this.selectedSshKey.publicKey;
    }
  }

  /**
   * Checks if General Configurations are complete
   *
   * @returns a boolean indicating the state of general configuration step
   */
  isSecurityConfigComplete() {
    return has(this.vRack, 'id') && has(this.selectedSshKey, 'publicKey');
  }

  /** #####################################################################
      REGIONS AND DATACENTER
   * ##################################################################### */

  resetRegionConfiguration() {
    this.selectedRegion = null;
  }

  onRegionsInformationChange({ selectedRegion }) {
    this.selectedRegion = selectedRegion;
    this.resetQuota();
  }

  /**
   * fetch region details and group by them datacenter and continent
   *
   */
  initRegions() {
    // fetch regions
    this.displaySelectedRegion = false;
    this.regions = map(
      get(this.selectedCapability, 'availableRegion'),
      (region) => ({
        name: region,
        hasEnoughQuota: () => true,
      }),
    );
  }

  /**
   * submit regions form
   *
   */
  submitRegionAndDatacenter() {
    if (this.selectedRegion) {
      this.analyticsDataPlatform.osRegion = this.selectedRegion.name;
      this.displaySelectedRegion = true;
    }
  }

  /** #####################################################################
      NODES
   * ##################################################################### */

  resetNodesConfiguration() {
    this.nodesConfig = null;
  }

  resetQuota() {
    this.quota = null;
  }

  /**
   * fetch the flavors for a given public cloud
   *
   * @param {*} publicCloudServiceName public cloud service name
   * @param {*} region the region for which the flavors are to be retrieved
   * @returns array of flavor objects
   */
  fetchFlavors(publicCloudServiceName, region) {
    this.supportedFlavors = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.analyticsDataPlatformService
          .getFlavors(publicCloudServiceName, region)
          .catch((error) =>
            this.cucServiceHelper.errorHandler(
              'analytics_data_platform_get_flavors_error',
            )(error),
          ),
    });
    return this.supportedFlavors.load();
  }

  /**
   * fetch the quota for a given public cloud
   *
   * @param {*} publicCloudServiceName public cloud service name
   * @param {*} region region for which quota has to be fetched
   * @returns quota information
   */
  fetchQuota(publicCloudServiceName, region) {
    this.quota = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.analyticsDataPlatformService
          .getPublicCloudsQuota(publicCloudServiceName)
          .then((quotas) => find(quotas, { region }))
          .catch((error) =>
            this.cucServiceHelper.errorHandler(
              'analytics_data_platform_get_quota_error',
            )(error),
          ),
    });
    return this.quota.load();
  }

  /**
   * Initializes the nodes configuration structure
   */
  initNodes() {
    this.storage.initialized = false;
    if (isEmpty(this.nodesConfig)) {
      this.fetchFlavors(
        this.analyticsDataPlatform.osProjectId,
        this.analyticsDataPlatform.osRegion,
      ).then((flavors) => {
        this.nodesConfig = this.getNodesConfiguration(
          this.selectedCapability,
          flavors,
        );
      });
    }
    if (isEmpty(this.quota)) {
      this.fetchQuota(
        this.analyticsDataPlatform.osProjectId,
        this.analyticsDataPlatform.osRegion,
      );
    }
  }

  /**
   * populate nodesConfig map
   *
   * @param {*} capability
   * @param {*} flavors
   * @returns map of all nodes configuration
   */
  getNodesConfiguration(capability, flavors) {
    const nodesConfig = {};
    forEach(this.ANALYTICS_DATA_PLATFORM_NODE_NAMES, (nodeType) => {
      const nodeConfig = cloneDeep(get(capability, `${nodeType}Node`));
      nodeConfig.type = nodeType;
      nodeConfig.count = nodeConfig.instanceMin;
      nodeConfig.countText = this.$translate.instant(
        'analytics_data_platform_deploy_nodes',
        { node_count: nodeConfig.count },
      );
      nodeConfig.instanceType = map(nodeConfig.instanceType, (instanceType) => {
        const flavor = find(flavors, { name: instanceType });
        if (!flavor) {
          return undefined;
        }
        const flavorId = find(
          this.ANALYTICS_DATA_PLATFORM_FLAVOR_TYPES,
          (flavorType) => includes(flavorType.types, flavor.type),
        ).id;
        flavor.flavorFamily = this.$translate.instant(
          `analytics_data_platform_deploy_flavor_family_${flavorId}`,
        );
        return flavor;
      }).filter((instanceType) => !!instanceType);
      if (nodeConfig.instanceType.length === 1) {
        nodeConfig.selectedFlavor = head(nodeConfig.instanceType);
        const isValid =
          nodeConfig.selectedFlavor.disk >= nodeConfig.rawStorageMinGb;
        set(nodeConfig, 'isValid', isValid);
      } else {
        nodeConfig.selectedFlavor = null;
        set(nodeConfig, 'isValid', true);
      }
      set(nodesConfig, nodeType, nodeConfig);
    });
    return nodesConfig;
  }

  /**
   * Creates the node structure that is required to be submitted
   */
  submitNodesInformation(form) {
    if (!this.validateClusterSize()) {
      set(form, '$valid', false);
      return;
    }
    const nodes = values(this.nodesConfig).filter(
      (nodeConfig) =>
        nodeConfig.type !==
        this.ANALYTICS_DATA_PLATFORM_NODE_TYPES.BASTION.toLowerCase(),
    );
    this.analyticsDataPlatform.nodes = [];
    map(nodes, (nodeConfig) => {
      times(nodeConfig.count, () => {
        this.analyticsDataPlatform.nodes.push({
          nodeFlavor: nodeConfig.selectedFlavor.name,
          nodeType: this.ANALYTICS_DATA_PLATFORM_NODE_TYPES[
            nodeConfig.type.toUpperCase()
          ],
        });
      });
    });
  }

  /**
   * compares nodes configuration with cloud available quota.
   * shows error model with details if configuration exceeds available quota.
   *
   * @returns true if configuration is withon available quota, false otherwose
   */
  validateClusterSize() {
    const nodes = values(this.nodesConfig);
    if (isEmpty(this.quota) || isEmpty(nodes)) {
      return false;
    }
    // validate storage
    const isStorageInValid = some(nodes, (node) => !node.isValid);
    if (isStorageInValid) {
      return false;
    }
    const quota = this.quota.data;
    // RAM
    const totalRamRequired = sumBy(
      nodes,
      (node) => get(node, ['selectedFlavor', 'ram'], 0) * get(node, 'count', 0),
    );
    const pciUsedRam = get(quota, ['instance', 'usedRAM'], 0);
    const pciTotalRam = get(quota, ['instance', 'maxRam'], 0);
    const pciAvailableRam = pciTotalRam - pciUsedRam;
    const isRamValid = pciAvailableRam - totalRamRequired >= 0;

    // Instances
    const totalInstancesRequired = sumBy(nodes, (node) =>
      get(node, 'count', 0),
    );
    const pciUsedInstances = get(quota, ['instance', 'usedInstances'], 0);
    const pciTotalInstances = get(quota, ['instance', 'maxInstances'], 0);
    const pciAvailableInstances = pciTotalInstances - pciUsedInstances;
    const isInstancesValid =
      pciAvailableInstances - totalInstancesRequired >= 0;

    // CPU
    const totalCpuRequired = sumBy(
      nodes,
      (node) =>
        get(node, ['selectedFlavor', 'vcpus'], 0) * get(node, 'count', 0),
    );
    const pciUsedCpu = get(quota, ['instance', 'usedCores'], 0);
    const pciTotalCpu = get(quota, ['instance', 'maxCores'], 0);
    const pciAvailableCpu = pciTotalCpu - pciUsedCpu;
    const isCpuValid = pciAvailableCpu - totalCpuRequired >= 0;

    // Storage
    const totalStorageRequired = sumBy(
      nodes,
      (node) =>
        get(node, ['selectedFlavor', 'disk'], 0) * get(node, 'count', 0),
    );
    const pciStorageUsed = get(quota, ['volume', 'usedGigabytes'], 0);
    const pciMaxStorage = get(quota, ['volume', 'maxGigabytes'], 0);
    const pciAvailableStorage = pciMaxStorage - pciStorageUsed;
    const isStorageValid = pciAvailableStorage - totalStorageRequired >= 0;

    const isClusterValid =
      isRamValid && isInstancesValid && isCpuValid && isStorageValid;
    if (!isClusterValid) {
      const currentlyUsed = pciUsedRam / 1000;
      const requiredForCluster = totalRamRequired / 1000;
      const quotas = [
        {
          computeName: this.ANALYTICS_DATA_PLATFORM_COMPUTE.RAM,
          currentlyUsed,
          requiredForCluster,
          maxLimit: pciTotalRam / 1000,
          required: currentlyUsed + requiredForCluster,
          unit: true,
        },
        {
          computeName: this.ANALYTICS_DATA_PLATFORM_COMPUTE.CORS,
          currentlyUsed: pciUsedCpu,
          requiredForCluster: totalCpuRequired,
          maxLimit: pciTotalCpu,
          required: pciUsedCpu + totalCpuRequired,
        },
        {
          computeName: this.$translate.instant(
            'analytics_data_platform_deploy_quota_virtual_nodes',
          ),
          currentlyUsed: pciUsedInstances,
          requiredForCluster: totalInstancesRequired,
          maxLimit: pciTotalInstances,
          required: pciUsedInstances + totalInstancesRequired,
        },
        {
          computeName: this.$translate.instant(
            'analytics_data_platform_common_storage',
          ),
          currentlyUsed: pciStorageUsed,
          requiredForCluster: totalStorageRequired,
          maxLimit: pciMaxStorage,
          required: pciStorageUsed + totalStorageRequired,
          unit: true,
        },
      ];
      this.showQuotaInsufficientErrorModel(
        this.publicCloud.description,
        quotas,
      );
      return false;
    }
    return true;
  }

  /**
   * show error model with details about current configuration and available quota
   *
   * @param {*} publicCloudName
   * @param {*} quotas
   */
  showQuotaInsufficientErrorModel(publicCloudName, quotas) {
    this.$state.go(
      'pci.projects.project.analytics-data-platform.deploy.insufficient-quota',
      {
        publicCloudName,
        quotas,
      },
    );
  }

  /** #####################################################################
      STORAGE
   * ##################################################################### */

  onStorageInformationChange({ edgeNodeStorage, hdfsEffectiveStorage }) {
    this.analyticsDataPlatform.edgeNodeStorage = edgeNodeStorage;
    this.storage.hdfsEffectiveStorage = hdfsEffectiveStorage;
  }

  resetStorageConfiguration() {
    this.analyticsDataPlatform.edgeNodeStorage = 0;
    this.storage.hdfsEffectiveStorage = 0;
  }

  initStorage() {
    this.storage.initialized = true;
    // calculate min and max storage for cluster and edge node storage
    this.storage.min_cluster_storage = ceil(
      (this.nodesConfig.worker.rawStorageMinGb *
        this.nodesConfig.worker.count) /
        this.analyticsDataPlatform.hdfsReplicationFactor,
    );
    this.storage.max_cluster_storage = floor(
      (this.nodesConfig.worker.rawStorageMaxGb *
        this.nodesConfig.worker.count) /
        this.analyticsDataPlatform.hdfsReplicationFactor,
    );
    this.storage.min_edge_node_storage = this.nodesConfig.edge.rawStorageMinGb;
    this.storage.max_edge_node_storage = this.nodesConfig.edge.rawStorageMaxGb;
  }

  submitStorageInformation() {
    this.analyticsDataPlatform.hdfsEffectiveStorage = this.storage.hdfsEffectiveStorage;
  }

  /** #####################################################################
      REVIEW AND SUBMIT
   * ##################################################################### */

  initReview() {
    const priceMap = this.priceCatalog.pricesMap;
    const computePrice = this.getComputePrice(priceMap);
    const storagePrice = this.getStoragePrice(
      priceMap,
      this.analyticsDataPlatform.hdfsEffectiveStorage *
        this.analyticsDataPlatform.hdfsReplicationFactor +
        this.analyticsDataPlatform.edgeNodeStorage *
          this.nodesConfig.edge.count,
    );
    // add 20% on compute price
    const totalHourlyPrice =
      this.constructor.getAnalyticsDataPlatformPrice(computePrice.hourlyPrice) +
      storagePrice.hourlyPrice;
    const totalMonthlyPrice =
      this.constructor.getAnalyticsDataPlatformPrice(
        computePrice.monthlyPrice,
      ) + storagePrice.monthlyPrice;
    this.price.hourlyPrice = round(totalHourlyPrice, 2);
    this.price.monthlyPrice = round(totalMonthlyPrice, 2);
  }

  /**
   * calculate total hourly and monthly price for computation selected in nodes configuration
   *
   * @param {*} catalog cloud price catalog
   * @returns object of hourlyPrice and monthlyPrice
   */
  getComputePrice(catalog) {
    const nodes = values(this.nodesConfig);
    const monthlyPrice = sumBy(nodes, (node) => {
      const flavourMonthly = get(node, [
        'selectedFlavor',
        'planCodes',
        'monthly',
      ]);
      return (
        this.cucCurrencyService.convertUcentsToCurrency(
          get(catalog, [flavourMonthly, 'price'], 0),
        ) * get(node, 'count', 0)
      );
    });
    const hourlyPrice = sumBy(nodes, (node) => {
      const flavourConsumption = get(node, [
        'selectedFlavor',
        'planCodes',
        'hourly',
      ]);
      return (
        this.cucCurrencyService.convertUcentsToCurrency(
          get(catalog, [flavourConsumption, 'price'], 0),
        ) * get(node, 'count', 0)
      );
    });
    return {
      hourlyPrice,
      monthlyPrice,
    };
  }

  /**
   * calculate total hourly and monthly price for storage selected in storage configuration
   *
   * @param {*} catalog cloud price catalog
   * @returns object of hourlyPrice and monthlyPrice
   */
  getStoragePrice(catalog, size, type = 'high-speed') {
    const storagePriceCatalog = get(catalog, `volume.${type}.consumption`);
    const hourlyPrice =
      size *
      this.cucCurrencyService.convertUcentsToCurrency(
        get(storagePriceCatalog, 'price', 0),
      );
    const monthlyPrice = hourlyPrice * 24 * 30;
    return {
      hourlyPrice,
      monthlyPrice,
    };
  }

  /**
   * deploys the cluster with the given settings
   */
  deployCluster() {
    if (!this.hasDefaultPaymentMethod) {
      return;
    }
    this.deploy = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.analyticsDataPlatformService
          .createUser(this.projectId, 'analytics-data-platform')
          .then((user) =>
            this.analyticsDataPlatformService
              .createAnalyticsOrder()
              .then((order) =>
                this.analyticsDataPlatformService.getServiceNameFromOrder(
                  order.orderId,
                ),
              )
              .then((serviceName) =>
                this.analyticsDataPlatformService
                  .getNewToken(this.projectId, user.id, user.password)
                  .then((osToken) =>
                    set(this.analyticsDataPlatform, 'osToken', osToken),
                  )
                  .then((analyticsDataPlatform) =>
                    this.analyticsDataPlatformService.deployAnalyticsDataPlatform(
                      serviceName,
                      analyticsDataPlatform,
                    ),
                  )
                  .then(() => {
                    this.analyticsDataPlatformService.clearPlatformAllCache();
                    return this.manageCluster(serviceName);
                  }),
              ),
          )
          .catch((error) =>
            this.cucServiceHelper.errorHandler(
              'analytics_data_platform_deploy_error',
            )(error),
          ),
    });
    this.deploy.load();
  }
}
