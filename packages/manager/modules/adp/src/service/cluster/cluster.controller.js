import find from 'lodash/find';
import filter from 'lodash/filter';
import map from 'lodash/map';
import sumBy from 'lodash/sumBy';
import uniq from 'lodash/uniq';

export default class {
  /* @ngInject */
  constructor($stateParams, $translate, adpService, CucControllerHelper, CucServiceHelper,
    ADP_COMPUTE, ADP_NODE_FILTERS, ADP_STATUS_MAP) {
    this.adpService = adpService;
    this.cucControllerHelper = CucControllerHelper;
    this.cucServiceHelper = CucServiceHelper;
    this.serviceName = $stateParams.serviceName;
    this.totalCores = 0;
    this.totalRam = 0;
    this.totalStorage = 0;
    this.ALL_NODES_OPTION = $translate.instant('adp_service_cluster_option_all');

    this.nodeFilters = ADP_NODE_FILTERS;
    this.regions = [];
    this.nodeTypeList = [];
    this.ADP_STATUS_MAP = ADP_STATUS_MAP;
    this.ADP_COMPUTE = ADP_COMPUTE;
    this.filterBy = null;
    this.selectedRegion = null;
    this.selectedRole = null;
  }

  selectFilter() {
    this.selectedNodeType = null;
    this.selectedRegion = null;
    this.resetTable();
  }

  $onInit() {
    this.populateList();
  }

  populateList() {
    this.fetchAdpDetails()
      .then((platform) => {
        this.flavorPromise = this.fetchFlavors(platform.project_id, platform.os_region);
      });
    this.getClusterNodes()
      .then(({ nodes }) => {
        this.clusterList = nodes;
        this.totalStorage = sumBy(nodes, 'storage');
        this.nodeTypeList = uniq(map(this.clusterList, 'node_type'));
        this.regions = (uniq(map(this.clusterList, 'region')));
        this.nodeTypeList.unshift(this.ALL_NODES_OPTION);
        this.regions.unshift(this.ALL_NODES_OPTION);
      })
      .then(() => this.fetchPublicCloudDetails());
  }

  /**
   * fetch all cluster nodes
   *
   * @returns array of cluster nodes
   */
  getClusterNodes() {
    this.clusterNodes = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.adpService.getClusterNodes(this.serviceName)
        .catch(error => this.cucServiceHelper.errorHandler('adp_get_nodes_error')(error)),
    });
    return this.clusterNodes.load();
  }

  /**
   * Loads flavor details like ram, cores and storage
   */
  loadRowWithFlavorDetails(row) {
    return this.flavorPromise.then((flavors) => {
      const flavor = find(flavors, { name: row.flavor_type });
      this.totalCores += flavor.vcpus;
      this.totalRam += flavor.ram;
      delete flavor.region;
      return flavor;
    });
  }

  /**
   * fetch all details of the platform
   *
   * @returns object which contains details of platform
   */
  fetchAdpDetails() {
    this.platformDetails = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.adpService.getAdpDetails(
        this.serviceName,
      )
        .catch(error => this.cucServiceHelper.errorHandler('adp_get_cluster_info_error')(error)),
    });
    return this.platformDetails.load();
  }

  /**
   * fetch details of the public cloud associated
   *
   * @returns object of details of public cloud
   */
  fetchPublicCloudDetails() {
    this.publicCloudDetails = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.adpService.getPubliCloudDetails(
        this.platformDetails.data.project_id,
      )
        .catch(error => this.cucServiceHelper.errorHandler('adp_get_cluster_info_error')(error)),
    });
    return this.publicCloudDetails.load();
  }

  /**
   * fetch all flavors for respective public cloud and region
   *
   * @returns array of flavors along with their details
   */
  fetchFlavors(publicCloudServiceName, region) {
    this.flavors = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.adpService.getFlavors(publicCloudServiceName, region)
        .catch(error => this.cucServiceHelper.errorHandler('adp_get_flavors_error')(error)),
    });
    return this.flavors.load();
  }

  /**
   * Filter list of datagrid with node type selected
   */
  nodeTypeFilter() {
    if (this.selectedNodeType === this.ALL_NODES_OPTION) {
      this.resetTable();
    } else {
      this.filterClusters();
    }
  }

  /**
   * Filter list of datagrid with region selected
   */
  regionFilter() {
    if (this.selectedRegion === this.ALL_NODES_OPTION) {
      this.resetTable();
    } else {
      this.filterClusters(true);
    }
  }

  filterClusters(region) {
    if (region) {
      this.clusterList = filter(this.clusterNodes.data.nodes, { region: this.selectedRegion });
    } else {
      this.clusterList = filter(this.clusterNodes.data.nodes, { node_type: this.selectedNodeType });
    }
  }

  resetTable() {
    this.clusterList = this.clusterNodes.data.nodes;
  }

  refresh() {
    this.filterBy = null;
    this.totalCores = 0;
    this.totalRam = 0;
    this.totalStorage = 0;
    this.populateList();
  }
}
