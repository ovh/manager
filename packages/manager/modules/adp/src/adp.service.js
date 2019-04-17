import filter from 'lodash/filter';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import set from 'lodash/set';

export default class ADPService {
  /* @ngInject */
  constructor($q, $translate, CucRegionService, OvhApiAnalytics,
    OvhApiCloudProject, OvhApiMe, OvhApiOrderCatalogFormatted, OvhApiVrack,
    ADP_CAPABILITIES, ADP_CLOUD_CATALOG_NAME, ADP_CLUSTER_MANAGE,
    ADP_CLUSTER_NODES, ADP_GET_ACTIVITIES, ADP_PLATFORMS_GET_DETAILS, ADP_PLATFORMS_GET_DETAILS2,
    ADP_PLATFORMS_GET_LIST, ADP_PUBLIC_CLOUD_STATUS, ADP_CLUSTER_DEPLOY_STATUS, ADP_STATUS) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiAnalyticsPlatforms = OvhApiAnalytics.Platforms().v6();
    this.OvhApiAnalyticsCapabilities = OvhApiAnalytics.Capabilities().v6();
    this.ovhApiCloudProject = OvhApiCloudProject.v6();
    this.ovhApiCloudProjectQuota = OvhApiCloudProject.Quota().v6();
    this.ovhApiSshKey = OvhApiCloudProject.SshKey().v6();
    this.OvhApiRegion = OvhApiCloudProject.Region().v6();
    this.OvhApiFlavors = OvhApiCloudProject.Flavor().v6();
    this.OvhApiCloudServiceInfos = OvhApiCloudProject.ServiceInfos().v6();
    this.OvhApiOrderCatalogFormatted = OvhApiOrderCatalogFormatted.v6();
    this.OvhApiVrack = OvhApiVrack.v6();
    this.OvhApiMe = OvhApiMe;
    this.CucRegionService = CucRegionService;
    this.ADP_STATUS = ADP_STATUS;
    this.ADP_CAPABILITIES = ADP_CAPABILITIES;
    this.ADP_CLOUD_CATALOG_NAME = ADP_CLOUD_CATALOG_NAME;
    this.ADP_CLUSTER_MANAGE = ADP_CLUSTER_MANAGE;
    this.ADP_CLUSTER_NODES = ADP_CLUSTER_NODES;
    this.ADP_GET_ACTIVITIES = ADP_GET_ACTIVITIES;
    this.ADP_PLATFORMS_GET_DETAILS = ADP_PLATFORMS_GET_DETAILS;
    this.ADP_PLATFORMS_GET_DETAILS2 = ADP_PLATFORMS_GET_DETAILS2;
    this.ADP_PLATFORMS_GET_LIST = ADP_PLATFORMS_GET_LIST;
    this.ADP_PUBLIC_CLOUD_STATUS = ADP_PUBLIC_CLOUD_STATUS;
    this.ADP_CLUSTER_DEPLOY_STATUS = ADP_CLUSTER_DEPLOY_STATUS;
  }

  /**
   * returns the account details
   *
   * @returns the account details
   * @memberof ADPService
   */
  getAccountDetails() {
    return this.OvhApiMe.v6().get().$promise;
  }

  /**
   * returns the flavors supported by the cloud project in a particular region
   *
   * @param {*} publicCloudServiceName public cloud service name
   * @param {*} region the region for which the flavors are to be retrieved
   * @returns array of flavors
   * @memberof ADPService
   */
  getFlavors(publicCloudServiceName, region) {
    return this.OvhApiFlavors.query({ serviceName: publicCloudServiceName, region }).$promise
      .then(flavors => this.transformFlavors(flavors));
  }

  /**
   * fetch all active public clouds
   *
   * @returns array of public cloud objects
   * @memberof ADPService
   */
  getPublicClouds() {
    return this.ovhApiCloudProject.query()
      .$promise
      .then((clouds) => {
        // get cloud details
        const cloudPromises = map(clouds, cloud => this.getPubliCloudDetails(cloud));
        return this.$q.all(cloudPromises)
          .then((cloudObjs) => {
            // return active clouds only
            // TODO what to do with suspended clouds
            const activeClouds = filter(
              cloudObjs,
              cloud => isEqual(cloud.status, this.ADP_PUBLIC_CLOUD_STATUS.OK),
            );
            return activeClouds;
          });
      });
  }

  /**
   * fetch quota for the public cloud
   *
   * @returns quota information
   * @memberof ADPService
   */
  getPublicCloudsQuota(publicCloudServiceName) {
    return this.ovhApiCloudProjectQuota.query({ serviceName: publicCloudServiceName }).$promise;
  }

  /**
   * return given public cloud details
   *
   * @param {*} publicCloudServiceName public cloud service name
   * @returns public cloud object
   * @memberof ADPService
   */
  getPubliCloudDetails(publicCloudServiceName) {
    return this.ovhApiCloudProject.get({ serviceName: publicCloudServiceName }).$promise;
  }

  /**
   * fetch all SSH keys associated with a given public cloud
   *
   * @param {*} publicCloudServiceName public cloud service name
   * @returns return array of SSH key objects
   * @memberof ADPService
   */
  getShhKeys(publicCloudServiceName) {
    return this.ovhApiSshKey.query({ serviceName: publicCloudServiceName }).$promise;
  }

  /**
   * fetch all vRacks associated with a given public cloud
   *
   * @param {*} publicCloudServiceName public cloud service name
   * @returns return array of vRack objects
   * @memberof ADPService
   */
  getVRacks(publicCloudServiceName) {
    return this.ovhApiCloudProject.vrack({ serviceName: publicCloudServiceName }).$promise;
  }

  /**
   * get vRack details
   *
   * @param {*} serviceName vRack service name
   * @returns object containing vrack details
   * @memberof ADPService
   */
  getVRack(serviceName) {
    return this.OvhApiVrack.get({ serviceName }).$promise;
  }

  /**
   * fetch ADP capabilities
   *
   * @returns array of ADP capabilities
   * @memberof ADPService
   */
  getAdpCapabilities() {
    const deferred = this.$q.defer();
    deferred.resolve(this.ADP_CAPABILITIES);
    return deferred.promise;
  }

  /**
   * fetch region details for given region codes
   *
   * @param {*} regionCodes region names supported by ADP
   * @returns array of region object details
   * @memberof ADPService
   */
  getRegionDetails(regionCodes) {
    const regionPromises = map(
      regionCodes,
      code => this.CucRegionService.getRegion(code),
    );
    return this.$q.all(regionPromises);
  }

  /**
   * fetch public cloud price catalog for logged in user region
   *
   * @param {*} publicCloudPlanCode
   * @returns public cloud price catalog map
   * @memberof ADPService
   */
  getPriceCatalog(publicCloudPlanCode) {
    return this.getAccountDetails()
      .then(({ ovhSubsidiary, currency }) => this.OvhApiOrderCatalogFormatted
        .get({ catalogName: this.ADP_CLOUD_CATALOG_NAME, ovhSubsidiary })
        .$promise
        .then((catalog) => {
          const projectPlan = find(catalog.plans, { planCode: publicCloudPlanCode });
          if (!projectPlan) {
            throw new Error({ message: 'Price details not available for public cloud' });
          }
          const pricesMap = {};
          forEach(projectPlan.addonsFamily, (family) => {
            forEach(family.addons, (price) => {
              const planCode = get(price, ['plan', 'planCode']);
              const defaultPlan = get(
                price,
                ['plan', 'details', 'pricings', 'default'],
              );
              pricesMap[planCode] = get(defaultPlan, ['length'], 0)
                ? defaultPlan[0]
                : null;
            });
          });
          return {
            currency,
            pricesMap,
          };
        }));
  }

  /**
   * fetch all ADP projects along with details
   *
   * @returns array of ADP with details
   * @memberof ADPService
   */
  getAdpWithDetails() {
    const deferred = this.$q.defer();
    deferred.resolve([this.ADP_PLATFORMS_GET_DETAILS, this.ADP_PLATFORMS_GET_DETAILS2]);
    return deferred.promise;
  }

  /**
   * fetch all ADP projects
   *
   * @returns array of ADP ID's
   * @memberof ADPService
   */
  getAnalyticsDataPlatforms() {
    const deferred = this.$q.defer();
    deferred.resolve(this.ADP_PLATFORMS_GET_LIST);
    return deferred.promise;
  }

  /**
   * fetch details of given ADP project
   *
   * @returns ADP details object
   * @memberof ADPService
   */
  getAdpDetails(serviceName) {
    const deferred = this.$q.defer();
    deferred.resolve(
      this.ADP_PLATFORMS_GET_DETAILS.serviceName === serviceName
        ? this.ADP_PLATFORMS_GET_DETAILS
        : this.ADP_PLATFORMS_GET_DETAILS2,
    );
    return deferred.promise;
  }

  /**
   * fetch activity logs for a given ADP project
   *
   * @returns array of activity logs objects
   * @memberof ADPService
   */
  getAdpActivityLogs() {
    const deferred = this.$q.defer();
    deferred.resolve(this.ADP_GET_ACTIVITIES);
    return deferred.promise;
  }

  /**
   * fetch service information of a given cloud project
   *
   * @returns service details object
   * @memberof ADPService
   */
  getCloudProjectServiceInformation(serviceName) {
    return this.OvhApiCloudServiceInfos.get({
      serviceName,
    }).$promise;
  }

  /**
   * deploy ADP on public cloud
   *
   * @param {*} adp deployment details object
   * @returns deployed cluster details
   * @memberof ADPService
   */
  deployAdp(adp) {
    return this.OvhApiAnalyticsPlatforms.deploy(adp).$promise;
  }

  /**
   * add display name to all flavours
   *
   * @param {*} flavors
   * @returns
   * @memberof ADPService
   */
  transformFlavors(flavors) {
    return map(flavors, (flavor) => {
      set(flavor, 'displayName', this.$translate.instant('adp_deploy_flavor', {
        name: flavor.name.toUpperCase(),
        cpuNumber: flavor.vcpus,
        ramCapacity: flavor.ram / 1000,
        diskCapacity: flavor.disk,
      }));
      return flavor;
    });
  }

  /**
   * get cluster nodes
   *
   * @param {*} serviceName
   * @returns list of all nodes in a cluster
   */
  getClusterNodes() {
    const deferred = this.$q.defer();
    deferred.resolve(this.ADP_CLUSTER_NODES);
    return deferred.promise;
  }

  /**
   * get cluster status
   *
   * @param {*} serviceName
   * @returns list of all tasks while deploying and their status and complete percentage
   */
  getStatus() {
    const deferred = this.$q.defer();
    deferred.resolve(this.ADP_CLUSTER_DEPLOY_STATUS);
    return deferred.promise;
  }

  /**
   * get vrack details
   *
   * @param {*} vrackId
   * @returns details of the vrack
   */
  getVrack(vrackId) {
    return this.OvhApiVrack.get({ serviceName: vrackId }).$promise;
  }

  isDeploymentInProgress(cluster) {
    return cluster.status === this.ADP_STATUS.IN_PROGRESS
      || cluster.status === this.ADP_STATUS.PENDING
      || cluster.status === this.ADP_STATUS.DEPLOYING
      || cluster.status === this.ADP_STATUS.TO_DEPLOY;
  }
}
