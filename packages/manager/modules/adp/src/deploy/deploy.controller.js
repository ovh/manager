import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import has from 'lodash/has';
import groupBy from 'lodash/groupBy';
import head from 'lodash/head';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import set from 'lodash/set';
import sortBy from 'lodash/sortBy';
import sumBy from 'lodash/sumBy';
import times from 'lodash/times';
import values from 'lodash/values';

import errorModel from '../quota-error-model/quota-error-model.html';
import errorModelController from '../quota-error-model/quota-error-model.controller';

export default class {
  /* @ngInject */
  constructor($translate, ADP_FLAVOR_TYPES, ADP_NODE_NAMES, ADP_NODE_TYPES,
    adpService, CucControllerHelper, CucCloudMessage, CucServiceHelper) {
    this.$translate = $translate;
    this.ADP_FLAVOR_TYPES = ADP_FLAVOR_TYPES;
    this.ADP_NODE_NAMES = ADP_NODE_NAMES;
    this.ADP_NODE_TYPES = ADP_NODE_TYPES;
    this.adpService = adpService;
    this.cucControllerHelper = CucControllerHelper;
    this.cucCloudMessage = CucCloudMessage;
    this.cucServiceHelper = CucServiceHelper;

    this.selectedPublicCloud = null;
    this.selectedRegion = null;
    this.selectedCapability = null;
    this.selectedSshKey = null;
    this.nodesConfig = null;
    this.adpFlavours = null;
    this.minimumNodesRequired = 0;
    this.adp = {
      os_project_id: null,
      admin_mail: null,
      cluster_name: null,
      cluster_type: null,
      edge_node_storage: 0,
      hdfs_effective_storage: 0,
      master_password: null,
      nodes: [],
      ssh_public_key: null,
      os_region: null,
      cluster_id: null,
      hdfs_replication_factor: 0,
      master_node_storage: 0,
      os_project_name: null,
      os_token: null,
    };
    this.storage = {
      initialized: false,
      cluster_storage: 0,
      edge_node_storage: 0,
      min_cluster_storage: 0,
      max_cluster_storage: 0,
      min_edge_node_storage: 0,
      max_edge_node_storage: 0,
      clstr_strg_per_node: 0,
      edge_storage_per_node: 0,
    };
    this.price = {
      hourlyPrice: 0,
      monthlyPrice: 0,
    };
  }

  /**
   * calculates ADP price
   * ADP price is calculated by adding 20% of cloud price to cloud price
   * @static
   * @param {float} publicCloudPrice public cloud price
   * @returns ADP price
   */
  static getAdpPrice(publicCloudPrice) {
    return publicCloudPrice + (publicCloudPrice * 20) / 100;
  }

  $onInit() {
    this.cluster = {};
    this.cucCloudMessage.unSubscribe('adp.deploy');
    this.messageHandler = this.cucCloudMessage.subscribe('adp.deploy', { onMessage: () => this.refreshMessage() });
    this.initLoaders();
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  /**
   * load pre required data to show the UI
   *
   */
  initLoaders() {
    // load ADP capabilities
    this.fetchAdpCapabilities();
    // load public cloud projects
    this.fetchPublicClouds();
  }

  /**
   * set selected public cloud
   *
   * @param {*} publicCloud selected public cloud
   */
  setPublicCloud() {
    if (!isEmpty(this.selectedPublicCloud)) {
      const publicCloudServiceName = get(this.selectedPublicCloud, 'project_id');
      // load SSH keys
      this.selectedSshKey = null;
      this.nodesConfig = null;
      this.fetchSshKeys(publicCloudServiceName);
      // load vRack
      this.fetchVRack(publicCloudServiceName);
    }
  }

  /**
   * check if field is required to show on the UI
   *
   * @param {*} fieldName
   * @returns true if the field needs to show on the UI, false otherwise
   */
  isFieldRequired(fieldName) {
    const fieldValue = get(this.selectedCapability, `requirements.${fieldName}`);
    return !isEqual(fieldValue, false);
  }

  /**
   * fetch ADP versions and there capabilities
   *
   * @returns array of capability object
   */
  fetchAdpCapabilities() {
    this.capabilities = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.adpService.getAdpCapabilities()
        .catch(error => this.cucServiceHelper.errorHandler('adp_get_capabilities_error')(error)),
    });
    return this.capabilities.load();
  }

  /**
   * fetch all active public clouds
   *
   * @returns array of public cloud objects
   */
  fetchPublicClouds() {
    this.publicClouds = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.adpService.getPublicClouds()
        .then(publicClouds => sortBy(publicClouds, 'description'))
        .catch(error => this.cucServiceHelper.errorHandler('adp_get_clouds_error')(error)),
    });
    return this.publicClouds.load();
  }

  /**
   * fetch SSH keys for a given public cloud
   *
   * @param {*} publicCloudServiceName public cloud service name
   * @returns array of SSH key objects
   */
  fetchSshKeys(publicCloudServiceName) {
    this.sshKeys = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.adpService.getShhKeys(publicCloudServiceName),
      // .catch(error => this.cucServiceHelper.errorHandler('adp_get_ssh_keys_error')(error)),
    });
    return this.sshKeys.load();
  }

  /**
   * fetch vRack for a given public cloud
   *
   * @param {*} publicCloudServiceName public cloud service name
   * @returns the vRack object
   */
  fetchVRack(publicCloudServiceName) {
    this.vRack = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.adpService.getVRacks(publicCloudServiceName),
      // .catch(error => this.cucServiceHelper.errorHandler('adp_get_vracks_error')(error)),
    });
    return this.vRack.load();
  }

  /** #####################################################################
      GENERAL INFORMATION
   * ##################################################################### */

  /**
   * Calculates the minimum nodes required by
   * summing up the min instances for each node type
   *
   * @returns the minimum number of nodes required
   */
  onCapabilitySelect() {
    this.minimumNodesRequired = get(this.selectedCapability, ['bastion_node', 'instance_min'], 0)
      + get(this.selectedCapability, ['edge_node', 'instance_min'], 0)
      + get(this.selectedCapability, ['master_node', 'instance_min'], 0)
      + get(this.selectedCapability, ['worker_node', 'instance_min'], 0)
      + get(this.selectedCapability, ['utility_node', 'instance_min'], 0);
  }

  /**
   * Checks if General Configurations are complete
   *
   * @returns a boolean indicating the state of general configuration step
   */
  isGeneralConfigComplete() {
    return !isEmpty(this.selectedPublicCloud);
  }

  /**
   * Saves the required data before the step is finalized
   */
  submitGeneralInformation() {
    // this.initRegions();
    this.adp.os_project_id = this.selectedPublicCloud.project_id;
    this.adp.cluster_type = this.selectedCapability.version;
    this.adp.hdfs_replication_factor = this.selectedCapability.hdfs_replication_factor;
    this.adp.os_project_name = this.selectedPublicCloud.description;
  }

  /**
   * Checks if the master password and the confirm password matches
   *
   * @returns a boolean indicating whether the passwords match
   */
  checkPasswordMatch() {
    return this.masterPasswordConfirm === this.adp.master_password;
  }

  /** #####################################################################
      SECURITY INFORMATION
   * ##################################################################### */

  /**
   * Saves the required data before the step is finalized
   */
  submitSecurityInformation() {
    this.adp.ssh_public_key = this.selectedSshKey.id;
  }

  /**
   * Checks if General Configurations are complete
   *
   * @returns a boolean indicating the state of general configuration step
   */
  isSecurityConfigComplete() {
    return has(this.vRack, 'data.id') && has(this.selectedSshKey, 'id');
  }

  /** #####################################################################
      REGIONS AND DATACENTER
   * ##################################################################### */

  /**
   * fetch all ADP supported regions
   *
   * @param {*} publicCloudServiceName public cloud service name
   * @returns array of vRack objects
   */
  fetchRegionDetails(regionCodes) {
    this.regions = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.adpService.getRegionDetails(
        regionCodes,
      )
        .catch(error => this.cucServiceHelper.errorHandler('adp_get_regions_error')(error)),
    });
    return this.regions.load();
  }

  /**
   * fetch region details and group by them datacenter and continent
   *
   */
  initRegionsAndDatacenters() {
    // fetch regions
    this.fetchRegionDetails(get(this.selectedCapability, 'available_region'));
    this.initRegionsByDatacenter();
    this.initRegionsByContinent();
  }

  /**
   * group regions by datacenter
   *
   */
  initRegionsByDatacenter() {
    this.regionsByDatacenter = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.regions
        .promise
        .then((regions) => {
          const regionsByDatacenter = groupBy(regions, 'macroRegion.code');
          const groupedRegions = map(regionsByDatacenter, (microRegions) => {
            const region = cloneDeep(microRegions[0]);
            region.dataCenters = microRegions;
            delete region.microRegion;
            delete region.disabled;
            return region;
          });
          return groupedRegions;
        }),
    });
    return this.regionsByDatacenter.load();
  }

  /**
   * group regions by continent
   *
   */
  initRegionsByContinent() {
    this.regionsByContinent = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.regionsByDatacenter
        .promise
        .then(regions => groupBy(regions, 'continent')),
    });
    return this.regionsByContinent.load();
  }

  /**
   * submit regions form
   *
   */
  submitRegionAndDatacenter() {
    this.adp.os_region = this.selectedRegion.microRegion.code;
  }

  /** #####################################################################
      NODES
   * ##################################################################### */

  /**
   * fetch the flavors for a given public cloud
   *
   * @param {*} publicCloudServiceName public cloud service name
   * @param {*} region the region for which the flavors are to be retrieved
   * @returns array of flavor objects
   */
  fetchFlavors(publicCloudServiceName, region) {
    this.supportedFlavors = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.adpService.getFlavors(publicCloudServiceName, region)
        .catch(error => this.cucServiceHelper.errorHandler('adp_get_flavors_error')(error)),
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
      loaderFunction: () => this.adpService.getPublicCloudsQuota(publicCloudServiceName)
        .then(quotas => find(quotas, { region }))
        .catch(error => this.cucServiceHelper.errorHandler('adp_get_quota_error')(error)),
    });
    return this.quota.load();
  }

  /**
   * checks if the node instances quota for the cloud project
   * has been exceeded based on the current nodes settings
   *
   * @returns boolean indicating whether the quota has been exceeded
   */
  isNodesQuotaExceeded() {
    if (this.quota && !this.quota.loading) {
      const nodes = values(this.nodesConfig);
      return reduce(nodes,
        (instancesCount, nodeConfig) => instancesCount + nodeConfig.count, 0)
        > this.quota.data.instance.maxInstances;
    }
    return true;
  }

  /**
   * returns the flavor family for the given instance type
   *
   * @param {*} instanceType the instance type
   * @returns the flavor family (string)
   */
  static getFlavorFamily(instanceType) {
    return instanceType.flavorFamily;
  }

  /**
   * Initializes the nodes configuration structure
  */
  initNodes() {
    this.storage.initialized = false;
    if (isEmpty(this.nodesConfig)) {
      this.fetchFlavors(this.adp.os_project_id, this.adp.os_region)
        .then((flavors) => {
          this.nodesConfig = this.getNodesConfiguration(this.selectedCapability, flavors);
        });
    }
    this.fetchQuota(this.adp.os_project_id, this.adp.os_region);
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
    forEach(this.ADP_NODE_NAMES, (nodeType) => {
      const nodeConfig = cloneDeep(get(capability, `${nodeType}_node`));
      nodeConfig.type = nodeType;
      nodeConfig.count = nodeConfig.instance_min;
      nodeConfig.countText = this.$translate.instant('adp_deploy_nodes', { node_count: nodeConfig.count });
      nodeConfig.instance_type = map(
        nodeConfig.instance_type,
        (instanceType) => {
          const flavor = find(flavors, { name: instanceType });
          const flavorId = find(this.ADP_FLAVOR_TYPES,
            flavorType => includes(flavorType.types, flavor.type)).id;
          flavor.flavorFamily = this.$translate.instant(`adp_deploy_flavor_family_${flavorId}`);
          return flavor;
        },
      );
      nodeConfig.selectedFlavor = (nodeConfig.instance_type.length > 1)
        ? undefined
        : head(nodeConfig.instance_type);
      set(nodesConfig, nodeType, nodeConfig);
    });
    return nodesConfig;
  }

  /**
   * Creates the node structure that is required to be submitted
   */
  submitNodesInformation() {
    if (!this.validateClusterSize()) {
      return false;
    }
    const nodes = values(this.nodesConfig);
    this.adp.nodes = [];
    map(nodes, (nodeConfig) => {
      times(nodeConfig.count, () => {
        this.adp.nodes.push({
          node_flavor: nodeConfig.selectedFlavor.name,
          node_type: this.ADP_NODE_TYPES[nodeConfig.type.toUpperCase()],
        });
      });
    });
    return true;
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
    const quota = this.quota.data;
    // RAM
    const totalRamRequired = sumBy(nodes, node => get(node, ['selectedFlavor', 'ram'], 0));
    const pciUsedRam = get(quota, ['instance', 'usedRAM'], 0);
    const pciTotalRam = get(quota, ['instance', 'maxRam'], 0);
    const pciAvailableRam = pciTotalRam - pciUsedRam;
    const isRamValid = pciAvailableRam - totalRamRequired >= 0;

    // Instances
    const totalInstancesRequired = sumBy(nodes, node => get(node, 'count', 0));
    const pciUsedInstances = get(quota, ['instance', 'usedInstances'], 0);
    const pciTotalInstances = get(quota, ['instance', 'maxInstances'], 0);
    const pciAvailableInstances = pciTotalInstances - pciUsedInstances;
    const isInstancesValid = pciAvailableInstances - totalInstancesRequired >= 0;

    // CPU
    const totalCpuRequired = sumBy(nodes, node => get(node, ['selectedFlavor', 'vcpus'], 0));
    const pciUsedCpu = get(quota, ['instance', 'usedCores'], 0);
    const pciTotalCpu = get(quota, ['instance', 'maxCores'], 0);
    const pciAvailableCpu = pciTotalCpu - pciUsedCpu;
    const isCpuValid = pciAvailableCpu - totalCpuRequired >= 0;

    const isClusterValid = isRamValid && isInstancesValid && isCpuValid;
    if (!isClusterValid) {
      const currentlyUsed = pciUsedRam / 1000;
      const requiredForCluster = totalRamRequired / 1000;
      const quotas = [
        {
          computeName: 'ram',
          currentlyUsed,
          requiredForCluster,
          maxLimit: pciTotalRam / 1000,
          required: currentlyUsed + requiredForCluster,
          unit: 'gb',
        },
        {
          computeName: 'cpu',
          currentlyUsed: pciUsedCpu,
          requiredForCluster: totalCpuRequired,
          maxLimit: pciTotalCpu,
          required: pciUsedCpu + totalCpuRequired,
        },
        {
          computeName: 'nodes',
          currentlyUsed: pciUsedInstances,
          requiredForCluster: totalInstancesRequired,
          maxLimit: pciTotalInstances,
          required: pciUsedInstances + totalInstancesRequired,
        },
      ];
      this.showQuotaInsufficientErrorModel(
        this.selectedPublicCloud.description,
        this.selectedPublicCloud.project_id,
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
   * @param {*} publicCloudId
   * @param {*} quotas
   */
  showQuotaInsufficientErrorModel(publicCloudName, publicCloudId, quotas) {
    this.cucControllerHelper.modal.showModal({
      modalConfig: {
        template: errorModel,
        controller: errorModelController,
        controllerAs: '$ctrl',
        windowClass: 'modal-dialog-centered',
        size: 'lg',
        backdrop: true,
        resolve: {
          publicCloudName: () => publicCloudName,
          publicCloudId: () => publicCloudId,
          quotas: () => quotas,
        },
      },
    });
  }

  /** #####################################################################
      STORAGE
   * ##################################################################### */

  initStorage() {
    this.storage.initialized = true;
    this.storage.hdfsEffectiveStorage = this.nodesConfig.worker.raw_storage_min_gb;
    this.adp.edge_node_storage = this.nodesConfig.edge.raw_storage_min_gb;
    this.storage.min_cluster_storage = this.nodesConfig.worker.raw_storage_min_gb;
    this.storage.max_cluster_storage = this.nodesConfig.worker.raw_storage_max_gb;
    this.storage.min_edge_node_storage = this.nodesConfig.edge.raw_storage_min_gb;
    this.storage.max_edge_node_storage = this.nodesConfig.edge.raw_storage_max_gb;
  }

  submitStorageInformation() {
    this.adp.hdfs_effective_storage = this.storage.hdfsEffectiveStorage
      * this.selectedCapability.hdfs_replication_factor;
  }

  calculateEdgenodeStorage() {
    this.adp.edge_node_storage = this.storage.edge_nodes_count * this.storage.edge_node_storage;
    this.storage.edge_storage_per_node = this.adp.edge_node_storage / this.storage.edge_nodes_count;
  }

  calculateClusterStorage() {
    const replicationFactor = this.selectedCapability.hdfs_replication_factor;
    this.adp.hdfs_effective_storage = this.storage.cluster_storage * replicationFactor;
    this.storage.clstr_strg_per_node = this.adp.hdfs_effective_storage / this.storage.wkr_nodes_cnt;
  }

  /** #####################################################################
      REVIEW AND SUBMIT
   * ##################################################################### */

  initReview() {
    this.getPriceCatalog(this.selectedPublicCloud.planCode)
      .then(() => {
        this.price.hourlyPrice = this.getHourlyTotalPrice(this.priceCatalog.data);
        this.price.monthlyPrice = this.getMonthlyTotalPrice(this.priceCatalog.data);
      });
  }

  /**
   * load OVH price catalog for a given cloud plan code
   *
   * @param {*} planCode
   * @returns price catalog for public cloud
   */
  getPriceCatalog(planCode) {
    this.priceCatalog = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.adpService.getPriceCatalog(planCode)
        .catch(error => this.cucServiceHelper.errorHandler('adp_get_price_catalog_error')(error)),
    });
    return this.priceCatalog.load();
  }

  /**
   * calculate hourly total price based on price catalog and nodes configuration
   *
   * @param {*} catalog
   * @returns hourly ADP price
   */
  getHourlyTotalPrice(catalog) {
    const nodes = values(this.nodesConfig);
    const price = sumBy(nodes, (node) => {
      const flavourConsumption = get(node, ['selectedFlavor', 'planCodes', 'hourly']);
      return get(catalog, [flavourConsumption, 'price', 'value'], 0) * get(node, 'count', 0);
    });
    return this.constructor.getAdpPrice(price);
  }

  /**
   * calculate monthly total price based on price catalog and nodes configuration
   *
   * @param {*} catalog
   * @returns monthly ADP price
   */
  getMonthlyTotalPrice(catalog) {
    const nodes = values(this.nodesConfig);
    const price = sumBy(nodes, (node) => {
      const flavourMonthly = get(node, ['selectedFlavor', 'planCodes', 'monthly']);
      return get(catalog, [flavourMonthly, 'price', 'value'], 0) * get(node, 'count', 0);
    });
    return this.constructor.getAdpPrice(price);
  }

  /**
   *
   *
   */
  deployCluster() {
    // TODO - pending, API is not yet available to integrate
    console.log('adp', this.adp);
  }
}
