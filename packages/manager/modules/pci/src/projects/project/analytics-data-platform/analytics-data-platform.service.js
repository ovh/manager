import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';
import { Environment } from '@ovh-ux/manager-config';
import {
  ANALYTICS_DATA_PLATFORM_STATUS,
  ANALYTICS_DATA_PLATFORM_CLOUD_CATALOG_NAME,
  ANALYTICS_DATA_PLATFORM_PUBLIC_CLOUD_STATUS,
} from './analytics-data-platform.constants';

export default class AnalyticsDataPlatformService {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    OvhApiAnalytics,
    OvhApiCloudProject,
    OvhApiMe,
    OvhApiOrder,
    OvhApiOrderCatalogPublic,
    OvhApiVrack,
    Poller,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiAnalyticsPlatforms = OvhApiAnalytics.Platforms().v6();
    this.OvhApiAnalyticsPlatformsNode = OvhApiAnalytics.Platforms()
      .Node()
      .v6();
    this.OvhApiAnalyticsCapabilities = OvhApiAnalytics.Capabilities().v6();
    this.ovhApiCloudProject = OvhApiCloudProject.v6();
    this.ovhApiCloudProjectQuota = OvhApiCloudProject.Quota().v6();
    this.ovhApiSshKey = OvhApiCloudProject.SshKey().v6();
    this.OvhApiRegion = OvhApiCloudProject.Region().v6();
    this.OvhApiFlavors = OvhApiCloudProject.Flavor().v6();
    this.ovhApiCloudProjectUser = OvhApiCloudProject.User().v6();
    this.OvhApiCloudServiceInfos = OvhApiCloudProject.ServiceInfos().v6();
    this.OvhApiOrderCart = OvhApiOrder.Cart().v6();
    this.OvhApiOrderCartProduct = OvhApiOrder.Cart()
      .Product()
      .v6();
    this.OvhApiOrderCatalogPublic = OvhApiOrderCatalogPublic.v6();
    this.OvhApiMeOrder = OvhApiMe.Order().v6();
    this.OvhApiVrack = OvhApiVrack.v6();
    this.Poller = Poller;
    this.CLOUD_CATALOG_NAME = ANALYTICS_DATA_PLATFORM_CLOUD_CATALOG_NAME;
    this.CLOUD_STATUS = ANALYTICS_DATA_PLATFORM_PUBLIC_CLOUD_STATUS;
    this.STATUS = ANALYTICS_DATA_PLATFORM_STATUS;
  }

  /**
   * Assigns a cart to the logged in client
   * @param {*} cartId the cart id to assign
   *
   * @memberof AnalyticsDataPlatformService
   */
  assignCart(cartId) {
    return this.OvhApiOrderCart.assign({
      cartId,
      autoPayWithPreferredPaymentMethod: true,
    }).$promise;
  }

  /**
   * Adds Analytics product to cart
   * @param {*} cartId the cart id to add to
   *
   * @returns the added product
   * @memberof AnalyticsDataPlatformService
   */
  addAnalyticsToCart(cartId) {
    return this.getAnalyticsCartInfo(cartId).then(
      (cartItemInfo) =>
        this.OvhApiOrderCartProduct.post({
          cartId,
          productName: 'analytics',
          duration: get(cartItemInfo, '[0].prices[0].duration'),
          planCode: get(cartItemInfo, '[0].planCode'),
          pricingMode: get(cartItemInfo, '[0].prices[0].pricingMode'),
          quantity: 1,
        }).$promise,
    );
  }

  /**
   * creates a new cart
   * @param {*} cartId the cart id to checkout
   *
   * @returns the cart
   * @memberof AnalyticsDataPlatformService
   */
  checkoutCart(cartId) {
    return this.assignCart(cartId).then(
      () =>
        this.OvhApiOrderCart.checkout({
          cartId,
          autoPayWithPreferredPaymentMethod: true,
        }).$promise,
    );
  }

  /**
   * Creates a cart, adds an Analytics product, checks it out and returns an order
   *
   * @returns the order
   * @memberof AnalyticsDataPlatformService
   */
  createAnalyticsOrder() {
    return this.createCart()
      .then((cart) => this.addAnalyticsToCart(cart.cartId))
      .then((analyticsItem) => this.checkoutCart(analyticsItem.cartId));
  }

  /**
   * creates a new cart
   *
   * @returns the cart
   * @memberof AnalyticsDataPlatformService
   */
  createCart() {
    return this.getAccountDetails().then(
      (accountDetails) =>
        this.OvhApiOrderCart.post({
          ovhSubsidiary: accountDetails.ovhSubsidiary,
        }).$promise,
    );
  }

  /**
   * creates a new user
   * @param {*} projectId the project id for which the user is to be created
   * @param {*} description the description for the user
   *
   * @returns the newly created user
   * @memberof AnalyticsDataPlatformService
   */
  createUser(projectId, description) {
    return this.ovhApiCloudProjectUser
      .save({ serviceName: projectId }, { description })
      .$promise.then((user) =>
        this.Poller.poll(
          `/cloud/project/${projectId}/user/${user.id}`,
          {},
          {
            method: 'get',
            namespace: `analytics-data-platform.user.${user.id}`,
            successRule: (userDetail) =>
              userDetail.status === this.CLOUD_STATUS.OK,
          },
        ).then(() => user),
      );
  }

  /**
   * Generates a user token
   * @param {*} projectId the project id for which the user token is to be generated
   * @param {*} userId the user for which token is to be generated
   * @param {*} password the user's password
   *
   * @returns the token object
   * @memberof AnalyticsDataPlatformService
   */
  generateUserToken(projectId, userId, password) {
    return this.ovhApiCloudProjectUser.token(
      { serviceName: projectId, userId },
      { password },
    ).$promise;
  }

  /**
   * returns the analytics cart item info
   *
   * @returns analytics cart item info
   * @memberof AnalyticsDataPlatformService
   */
  getAnalyticsCartInfo(cartId) {
    return this.OvhApiOrderCartProduct.get({ cartId, productName: 'analytics' })
      .$promise;
  }

  /**
   * returns the account details
   *
   * @returns the account details
   * @memberof AnalyticsDataPlatformService
   */
  getAccountDetails() {
    return this.$q.when(Environment.getUser());
  }

  /**
   * returns the flavors supported by the cloud project in a particular region
   *
   * @param {*} publicCloudServiceName public cloud service name
   * @param {*} region the region for which the flavors are to be retrieved
   * @returns array of flavors
   * @memberof AnalyticsDataPlatformService
   */
  getFlavors(publicCloudServiceName, region) {
    return this.OvhApiFlavors.query({
      serviceName: publicCloudServiceName,
      region,
    }).$promise.then((flavors) => this.transformFlavors(flavors));
  }

  /**
   * Generates a token
   * @param {*} publicCloudId the project id for which the token is to be generated
   * @param {*} userDescription the user description to use for the newly generated user
   *
   * @returns the token string
   * @memberof AnalyticsDataPlatformService
   */
  getNewToken(publicCloudId, userId, password) {
    return this.generateUserToken(
      publicCloudId,
      userId,
      password,
    ).then((token) => get(token, 'X-Auth-Token'));
  }

  /**
   * returns the order details for a specific order
   *
   * @param {*} orderId the order id for which the details are to be retrieved
   * @returns array of order details
   * @memberof AnalyticsDataPlatformService
   */
  getOrderDetails(orderId) {
    return this.OvhApiMeOrder.getDetails({ orderId }).$promise;
  }

  /**
   * fetch quota for the public cloud
   *
   * @returns quota information
   * @memberof AnalyticsDataPlatformService
   */
  getPublicCloudsQuota(publicCloudServiceName) {
    return this.ovhApiCloudProjectQuota.query({
      serviceName: publicCloudServiceName,
    }).$promise;
  }

  /**
   * return given public cloud details
   *
   * @param {*} publicCloudServiceName public cloud service name
   * @returns public cloud object
   * @memberof AnalyticsDataPlatformService
   */
  getPubliCloudDetails(publicCloudServiceName) {
    return this.ovhApiCloudProject.get({ serviceName: publicCloudServiceName })
      .$promise;
  }

  /**
   * returns the service name for an analytics data platform from the order id
   *
   * @param {*} orderId the order id
   * @returns the service name for analytics data platform
   * @memberof AnalyticsDataPlatformService
   */
  getServiceNameFromOrder(orderId) {
    return this.getOrderDetails(orderId)
      .then((orderDetails) =>
        this.Poller.poll(
          `/me/order/${orderId}/details/${get(orderDetails, [0])}`,
          {},
          {
            method: 'get',
            namespace: `analytics-data-platform.order.${orderId}`,
            successRule: (orderDetail) => orderDetail.domain !== '*001',
          },
        ),
      )
      .then((orderDetail) => orderDetail.domain);
  }

  /**
   * fetch all SSH keys associated with a given public cloud
   *
   * @param {*} publicCloudServiceName public cloud service name
   * @returns return array of SSH key objects
   * @memberof AnalyticsDataPlatformService
   */
  getShhKeys(publicCloudServiceName) {
    return this.ovhApiSshKey.query({ serviceName: publicCloudServiceName })
      .$promise;
  }

  /**
   * fetch all vRacks associated with a given public cloud
   *
   * @param {*} publicCloudServiceName public cloud service name
   * @returns return array of vRack objects
   * @memberof AnalyticsDataPlatformService
   */
  getVRacks(publicCloudServiceName) {
    return this.ovhApiCloudProject.vrack({
      serviceName: publicCloudServiceName,
    }).$promise;
  }

  /**
   * get vRack details
   *
   * @param {*} serviceName vRack service name
   * @returns object containing vrack details
   * @memberof AnalyticsDataPlatformService
   */
  getVRack(serviceName) {
    return this.OvhApiVrack.get({ serviceName }).$promise;
  }

  /**
   * fetch Analytics Data Platform capabilities
   *
   * @returns array of Analytics Data Platform capabilities
   * @memberof AnalyticsDataPlatformService
   */
  getAnalyticsDataPlatformCapabilities() {
    return this.OvhApiAnalyticsCapabilities.query().$promise;
  }

  /**
   * fetch public cloud price catalog for logged in user region
   *
   * @param {*} publicCloudPlanCode
   * @returns public cloud price catalog map
   * @memberof AnalyticsDataPlatformService
   */
  getPriceCatalog(publicCloudPlanCode) {
    return this.getAccountDetails().then(({ ovhSubsidiary, currency }) =>
      this.OvhApiOrderCatalogPublic.get({
        productName: this.CLOUD_CATALOG_NAME,
        ovhSubsidiary,
      }).$promise.then((catalog) => {
        const projectPlan = find(catalog.plans, {
          planCode: publicCloudPlanCode,
        });
        if (!projectPlan) {
          throw new Error({
            message: 'Price details not available for public cloud',
          });
        }
        const pricesMap = {};
        forEach(projectPlan.addonFamilies, (family) => {
          forEach(family.addons, (planCode) => {
            const addon = find(catalog.addons, { planCode });
            pricesMap[planCode] = get(addon.pricings, ['length'], 0)
              ? addon.pricings[0]
              : null;
          });
        });
        return {
          currency,
          pricesMap,
        };
      }),
    );
  }

  /**
   * fetch all Analytics Data Platform projects
   *
   * @returns array of Analytics Data Platform ID's
   * @memberof AnalyticsDataPlatformService
   */
  getAnalyticsDataPlatforms(projectId) {
    return this.OvhApiAnalyticsPlatforms.query().$promise.then(
      (platformIds) => {
        const promises = platformIds.map((id) =>
          this.getAnalyticsDataPlatformDetails(id).catch(() => ({
            osProjectId: null,
          })),
        ); // continue this.$q.all if any one fails
        return this.$q
          .all(promises)
          .then((platforms) =>
            platforms.filter(
              (platform) =>
                platform.osProjectId === projectId &&
                platform.status !== 'INITIALIZED',
            ),
          );
      },
    );
  }

  /**
   * fetch details of given Analytics Data Platform project
   *
   * @returns Analytics Data Platform details object
   * @memberof AnalyticsDataPlatformService
   */
  getAnalyticsDataPlatformDetails(serviceName) {
    return this.OvhApiAnalyticsPlatforms.get({ serviceName }).$promise;
  }

  /**
   * fetch activity logs for a given Analytics Data Platform project
   *
   * @returns array of activity logs objects
   * @memberof AnalyticsDataPlatformService
   */
  getAnalyticsDataPlatformActivityLogs(serviceName) {
    return this.OvhApiAnalyticsPlatforms.getActivity({ serviceName }).$promise;
  }

  /**
   * fetch service information of a given cloud project
   *
   * @returns service details object
   * @memberof AnalyticsDataPlatformService
   */
  getCloudProjectServiceInformation(serviceName) {
    return this.OvhApiCloudServiceInfos.get({ serviceName }).$promise;
  }

  /**
   * returns a poller that notifies the status in intervals
   * and resolves when the deployment is complete
   * @param {*} platformId the analytics data platform whose
   * deployment status needs to be polled
   *
   * @returns a promise that resolves when deployment is complete
   * @memberof AnalyticsDataPlatformService
   */
  getDeploymentStatus(platformId) {
    return this.Poller.poll(
      `/analytics/platforms/${platformId}/status`,
      {},
      {
        method: 'get',
        namespace: `analytics-data-platform.deploy.status.${platformId}`,
        successRule: (task) => !this.isDeploymentInProgress(task),
        interval: 60000,
      },
    );
  }

  /**
   * deploy Analytics Data Platform on public cloud
   *
   * @param {*} serviceName the service name of the analytics data platform
   * @param {*} analyticsDataPlatform deployment details object
   * @returns deployed cluster details
   * @memberof AnalyticsDataPlatformService
   */
  deployAnalyticsDataPlatform(serviceName, analyticsDataPlatform) {
    return this.startPlatformDeploy(serviceName, analyticsDataPlatform).then(
      () =>
        this.Poller.poll(
          `/analytics/platforms/${serviceName}`,
          {},
          {
            method: 'get',
            namespace: `analytics-data-platform.${serviceName}`,
            successRule: (platformDetails) =>
              platformDetails.status !== this.STATUS.TO_DEPLOY,
          },
        ),
    );
  }

  /**
   * starts deployment of Analytics Data Platform on public cloud
   *
   * @param {*} serviceName the service name of the analytics data platform
   * @param {*} analyticsDataPlatform deployment details object
   * @returns cluster details in deployment
   * @memberof AnalyticsDataPlatformService
   */
  startPlatformDeploy(serviceName, analyticsDataPlatform) {
    return this.OvhApiAnalyticsPlatforms.deploy(
      { serviceName },
      analyticsDataPlatform,
    ).$promise;
  }

  /**
   * add display name to all flavours
   *
   * @param {*} flavors
   * @returns
   * @memberof AnalyticsDataPlatformService
   */
  transformFlavors(flavors) {
    return map(flavors, (flavor) => {
      set(
        flavor,
        'displayName',
        this.$translate.instant('analytics_data_platform_deploy_flavor', {
          name: flavor.name.toUpperCase(),
          cpuNumber: flavor.vcpus,
          ramCapacity: flavor.ram / 1000,
          diskCapacity: flavor.disk,
        }),
      );
      return flavor;
    });
  }

  /**
   * get cluster node information
   *
   * @param {*} serviceName
   * @returns Cluster information
   */
  getClusterNode(serviceName, nodeId) {
    return this.OvhApiAnalyticsPlatformsNode.get({ serviceName, nodeId })
      .$promise;
  }

  /**
   * get cluster nodes
   *
   * @param {*} serviceName
   * @returns list of all nodes in a cluster
   */
  getClusterNodes(serviceName) {
    return this.OvhApiAnalyticsPlatformsNode.query({ serviceName }).$promise;
  }

  getClusterNodesDetails(serviceName) {
    return this.getClusterNodes(serviceName).then((nodes) =>
      this.$q.all(
        map(nodes, (nodeId) => this.getClusterNode(serviceName, nodeId)),
      ),
    );
  }

  /**
   * get cluster status
   *
   * @param {*} serviceName
   * @returns list of all tasks while deploying and their status and complete percentage
   */
  getStatus(serviceName) {
    return this.OvhApiAnalyticsPlatforms.getStatus({ serviceName }).$promise;
  }

  clearPlatformQueryCache() {
    this.OvhApiAnalyticsPlatforms.resetQueryCache();
  }

  clearPlatformCache() {
    this.OvhApiAnalyticsPlatforms.resetCache();
  }

  clearPlatformNodeQueryCache() {
    this.OvhApiAnalyticsPlatformsNode.resetQueryCache();
  }

  clearPlatformNodeCache() {
    this.OvhApiAnalyticsPlatformsNode.resetCache();
  }

  clearPlatformAllCache() {
    this.clearPlatformQueryCache();
    this.clearPlatformCache();
  }

  clearPlatformNodeAllCache() {
    this.clearPlatformNodeQueryCache();
    this.clearPlatformNodeCache();
  }

  isDeploymentInProgress(cluster) {
    return (
      cluster.status === this.STATUS.IN_PROGRESS ||
      cluster.status === this.STATUS.PENDING ||
      cluster.status === this.STATUS.DEPLOYING ||
      cluster.status === this.STATUS.TO_DEPLOY
    );
  }
}
