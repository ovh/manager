import compact from 'lodash/compact';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import head from 'lodash/head';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import set from 'lodash/set';
import toUpper from 'lodash/toUpper';

import {
  ERROR_STATUS,
  PROCESSING_STATUS,
  OFFERS,
  STATUS,
  SUCCESS_STATUS,
} from './enterprise-cloud-database.constants';

export default class EnterpriseCloudDatabaseService {
  /* @ngInject */
  constructor($q, $translate, OvhApiCloudDBEnterprise, OvhApiMe, OvhApiOrder) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiCloudDBEnterpriseCluster = OvhApiCloudDBEnterprise.v6();
    this.OvhApiCloudDBEnterpriseBackup = OvhApiCloudDBEnterprise.Backup().v6();
    this.OvhApiCloudDBEnterpriseEndpoint = OvhApiCloudDBEnterprise.Endpoint().v6();
    this.OvhApiCloudDBEnterpriseHost = OvhApiCloudDBEnterprise.Host().v6();
    this.OvhApiCloudDBEnterpriseLogs = OvhApiCloudDBEnterprise.Logs().v6();
    this.OvhApiCloudDBEnterpriseOffers = OvhApiCloudDBEnterprise.Offers().v6();
    this.OvhApiCloudDBEnterpriseMaintenance = OvhApiCloudDBEnterprise.Maintenance().v6();
    this.OvhApiCloudDBEnterpriseRegion = OvhApiCloudDBEnterprise.Region().v6();
    this.OvhApiCloudDBEnterpriseRestore = OvhApiCloudDBEnterprise.Restore().v6();
    this.OvhApiCloudDBEnterpriseRule = OvhApiCloudDBEnterprise.SecurityGroup()
      .Rule()
      .v6();
    this.OvhApiCloudDBEnterpriseSecurityGroup = OvhApiCloudDBEnterprise.SecurityGroup().v6();
    this.OvhApiCloudDBEnterpriseServiceInfos = OvhApiCloudDBEnterprise.ServiceInfos().v6();
    this.OvhApiCloudDBEnterpriseUser = OvhApiCloudDBEnterprise.User().v6();
    this.OvhApiCloudDBEnterpriseWindow = OvhApiCloudDBEnterprise.MaintenanceWindow().v6();
    this.OvhApiOrderEnterpriseCloudDB = OvhApiOrder.Catalog().Public().v6();
    this.OvhApiOrderCart = OvhApiOrder.Cart().v6();
    this.OvhApiOrderCartProduct = OvhApiOrder.Cart().Product().v6();
    this.OvhApiOrderCartConfig = OvhApiOrder.Cart().Item().Configuration().v6();
    this.OvhApiOrderCartServiceOption = OvhApiOrder.CartServiceOption()
      .EnterpriseCloudDatabases()
      .v6();
    this.OvhApiMeOrder = OvhApiMe.Order().v6();
    this.OvhApiMe = OvhApiMe;
  }

  getMe() {
    return this.OvhApiMe.v6().get().$promise;
  }

  createMaintenanceWindow(clusterId, windowData) {
    return this.OvhApiCloudDBEnterpriseWindow.create({ clusterId }, windowData)
      .$promise;
  }

  createRule(clusterId, securityGroupId, source) {
    return this.OvhApiCloudDBEnterpriseRule.create(
      { clusterId, securityGroupId },
      { source },
    ).$promise;
  }

  createSecurityGroup(clusterId, name) {
    return this.OvhApiCloudDBEnterpriseSecurityGroup.create(
      { clusterId },
      { clusterId, name },
    ).$promise;
  }

  deleteRule(clusterId, securityGroupId, ruleId) {
    return this.OvhApiCloudDBEnterpriseRule.delete({
      clusterId,
      securityGroupId,
      ruleId,
    }).$promise;
  }

  deleteSecurityGroup(clusterId, securityGroupId) {
    return this.OvhApiCloudDBEnterpriseSecurityGroup.delete({
      clusterId,
      securityGroupId,
    }).$promise;
  }

  getOffers() {
    return this.OvhApiCloudDBEnterpriseOffers.query().$promise.then((offers) =>
      this.$q.all(
        map(offers, (offer) =>
          this.getOfferDetails(offer).then((offerDetails) => {
            set(
              offerDetails,
              'displayName',
              get(OFFERS, offerDetails.name, offerDetails.name),
            );
            return offerDetails;
          }),
        ),
      ),
    );
  }

  getOfferDetails(offerName) {
    return this.OvhApiCloudDBEnterpriseOffers.get({ name: offerName }).$promise;
  }

  getCatalog(ovhSubsidiary) {
    return this.OvhApiOrderEnterpriseCloudDB.get({
      productName: 'enterpriseCloudDatabases',
      ovhSubsidiary,
    }).$promise;
  }

  getClusterDetails(clusterId) {
    return this.OvhApiCloudDBEnterpriseCluster.get({ clusterId }).$promise.then(
      (response) => {
        delete response.$promise;
        return response;
      },
    );
  }

  getClusters() {
    return this.OvhApiCloudDBEnterpriseCluster.query().$promise;
  }

  resetClusterListCache() {
    this.OvhApiCloudDBEnterpriseCluster.resetQueryCache();
    this.OvhApiCloudDBEnterpriseCluster.resetCache();
  }

  getEndpointDetails(clusterId, endpointId) {
    return this.OvhApiCloudDBEnterpriseEndpoint.get({ clusterId, endpointId })
      .$promise;
  }

  getEndpoints(clusterId) {
    return this.OvhApiCloudDBEnterpriseEndpoint.query({ clusterId }).$promise;
  }

  getEndpointsWithDetails(clusterId) {
    return this.getEndpoints(clusterId).then((endpoints) =>
      this.$q.all(
        map(endpoints, (endpointId) =>
          this.getEndpointDetails(clusterId, endpointId),
        ),
      ),
    );
  }

  getHostsWithDetails(clusterId) {
    return this.getHosts(clusterId)
      .then((hosts) =>
        this.$q.all(
          map(hosts, (hostId) => this.getHostDetails(clusterId, hostId)),
        ),
      )
      .then((hosts) => compact(hosts));
  }

  getHostDetails(clusterId, hostId) {
    return this.OvhApiCloudDBEnterpriseHost.get({ clusterId, hostId }).$promise;
  }

  getHosts(clusterId) {
    return this.OvhApiCloudDBEnterpriseHost.query({ clusterId }).$promise;
  }

  getMaintenanceWindow(clusterId) {
    return this.OvhApiCloudDBEnterpriseWindow.get({
      clusterId,
    }).$promise.catch((error) =>
      error.status === 404 ? null : this.$q.reject(error),
    );
  }

  getRegionDetails(name) {
    return this.OvhApiCloudDBEnterpriseRegion.get({
      name,
    }).$promise.then((regionInfo) =>
      set(
        regionInfo,
        'maintenanceDuration',
        get(regionInfo, 'maintenanceDuration', 1) * 60,
      ),
    );
  }

  getRuleDetails(clusterId, securityGroupId, ruleId) {
    return this.OvhApiCloudDBEnterpriseRule.get({
      clusterId,
      securityGroupId,
      ruleId,
    }).$promise;
  }

  getRulesList(clusterId, securityGroupId) {
    return this.getRules(clusterId, securityGroupId).then((rules) =>
      this.$q.all(
        map(rules, (ruleId) =>
          this.getRuleDetails(clusterId, securityGroupId, ruleId),
        ),
      ),
    );
  }

  getRules(clusterId, securityGroupId) {
    return this.OvhApiCloudDBEnterpriseRule.query({
      clusterId,
      securityGroupId,
    }).$promise;
  }

  getSecurityGroupDetails(clusterId, securityGroupId) {
    return this.OvhApiCloudDBEnterpriseSecurityGroup.get({
      clusterId,
      securityGroupId,
    }).$promise;
  }

  getSecurityGroupList(clusterId) {
    return this.getSecurityGroups(clusterId).then((securityGroups) =>
      this.$q.all(
        map(securityGroups, (securityGroupId) =>
          this.getSecurityGroupDetails(clusterId, securityGroupId),
        ),
      ),
    );
  }

  getSecurityGroups(clusterId) {
    return this.OvhApiCloudDBEnterpriseSecurityGroup.query({ clusterId })
      .$promise;
  }

  getServiceInfo(clusterId) {
    return this.OvhApiCloudDBEnterpriseServiceInfos.get({ clusterId }).$promise;
  }

  getUser(clusterId) {
    return this.OvhApiCloudDBEnterpriseUser.get({
      clusterId,
    }).$promise.catch((error) =>
      error.status === 404 ? null : this.$q.reject(error),
    );
  }

  setClusterDetails(clusterId, clusterDetails) {
    return this.OvhApiCloudDBEnterpriseCluster.update(
      { clusterId },
      clusterDetails,
    ).$promise;
  }

  setUserPassword(clusterId, password) {
    return this.OvhApiCloudDBEnterpriseUser.create({ clusterId }, { password })
      .$promise;
  }

  updateMaintenanceWindow(clusterId, windowData) {
    return this.OvhApiCloudDBEnterpriseWindow.update({ clusterId }, windowData)
      .$promise;
  }

  getRestores(clusterId) {
    return this.OvhApiCloudDBEnterpriseRestore.query({ clusterId }).$promise;
  }

  getRestoreDetails(clusterId, restoreId) {
    return this.OvhApiCloudDBEnterpriseRestore.get({
      clusterId,
      restoreId,
    }).$promise.then((response) => {
      delete response.$promise;
      return response;
    });
  }

  getRestoreList(clusterId) {
    return this.getRestores(clusterId).then((restores) =>
      this.$q.all(
        map(restores, (restoreId) =>
          this.getRestoreDetails(clusterId, restoreId),
        ),
      ),
    );
  }

  resetRestoredInstancesCache() {
    this.OvhApiCloudDBEnterpriseRestore.resetQueryCache();
    this.OvhApiCloudDBEnterpriseRestore.resetCache();
  }

  createRestore(clusterId, backupId, timestamp) {
    const payLoad = backupId ? { backupId } : { timestamp };
    return this.OvhApiCloudDBEnterpriseRestore.create({ clusterId }, payLoad)
      .$promise;
  }

  deleteRestoredInstance(clusterId, restoredInstanceId) {
    return this.OvhApiCloudDBEnterpriseRestore.delete({
      clusterId,
      restoreId: restoredInstanceId,
    }).$promise;
  }

  createBackup(clusterId, name) {
    return this.OvhApiCloudDBEnterpriseBackup.create(
      { clusterId },
      { clusterId, name },
    ).$promise;
  }

  getBackups(clusterId) {
    return this.OvhApiCloudDBEnterpriseBackup.query({ clusterId }).$promise;
  }

  getBackupDetails(clusterId, backupId) {
    return this.OvhApiCloudDBEnterpriseBackup.get({ clusterId, backupId })
      .$promise;
  }

  deleteBackupInstance(clusterId, backupInstanceId) {
    return this.OvhApiCloudDBEnterpriseBackup.delete({
      clusterId,
      backupId: backupInstanceId,
    }).$promise;
  }

  resetBackupsCache() {
    this.OvhApiCloudDBEnterpriseBackup.resetQueryCache();
    this.OvhApiCloudDBEnterpriseBackup.resetCache();
  }

  getLogs(clusterId) {
    return this.OvhApiCloudDBEnterpriseLogs.query({
      clusterId,
    }).$promise.then((ids) => map(ids, (id) => ({ id })));
  }

  getLogDetails(clusterId, logsId) {
    return this.OvhApiCloudDBEnterpriseLogs.get({ clusterId, logsId }).$promise;
  }

  grantAccessToLdpAccount(clusterId, log) {
    return this.OvhApiCloudDBEnterpriseLogs.grantAccess({ clusterId }, log)
      .$promise;
  }

  revokeAccessToLdpAccount(clusterId, logsId) {
    return this.OvhApiCloudDBEnterpriseLogs.revokeAccess({ clusterId, logsId })
      .$promise;
  }

  resetHostsCache() {
    this.OvhApiCloudDBEnterpriseHost.resetQueryCache();
    this.OvhApiCloudDBEnterpriseHost.resetCache();
  }

  resetLogsCache() {
    this.OvhApiCloudDBEnterpriseLogs.resetQueryCache();
    this.OvhApiCloudDBEnterpriseLogs.resetCache();
  }

  resetSecurityGroupDetailsCache() {
    this.OvhApiCloudDBEnterpriseSecurityGroup.resetCache();
  }

  scaleCluster(clusterId, count) {
    return this.OvhApiCloudDBEnterpriseCluster.scale({ clusterId }, { count })
      .$promise;
  }

  updateSecurityGroup(clusterId, securityGroupId, name) {
    return this.OvhApiCloudDBEnterpriseSecurityGroup.update(
      { clusterId, securityGroupId },
      { name },
    ).$promise;
  }

  getRegions(offerName) {
    return this.OvhApiCloudDBEnterpriseOffers.getRegions({
      name: offerName,
    }).$promise.then((regions) => {
      const regionObj = { offerName, regions };
      return regionObj;
    });
  }

  getAllHostCount(offers) {
    const mapObj = {};
    return this.$q
      .all(
        map(offers, (offer) => {
          if (isEmpty(mapObj[offer.offerName])) {
            mapObj[offer.offerName] = {};
          }
          return this.$q.all(
            map(offer.regions, (region) =>
              this.getHostCount(offer.offerName, region).then((count) => {
                mapObj[offer.offerName][count.regionName] = {
                  hostLeft: count.hostLeft,
                };
                return mapObj;
              }),
            ),
          );
        }),
      )
      .then(() => mapObj);
  }

  getHostCount(offerName, regionName) {
    return this.OvhApiCloudDBEnterpriseOffers.getAvailableHostCount({
      name: offerName,
      regionName,
    }).$promise;
  }

  createCart() {
    return this.getMe().then(
      (me) =>
        this.OvhApiOrderCart.post({ ovhSubsidiary: me.ovhSubsidiary }).$promise,
    );
  }

  addToCart(cartId, cluster) {
    return this.OvhApiOrderCartProduct.post({
      cartId,
      productName: 'enterpriseCloudDatabases',
      duration: get(cluster, 'commitmentPeriod.duration'),
      planCode: get(cluster, 'cluster.name'),
      pricingMode: get(cluster, 'paymentType.mode'),
      quantity: 1,
    }).$promise;
  }

  addConfig(cart, cluster) {
    return this.$q
      .all(
        this.OvhApiOrderCartConfig.post(
          {
            cartId: cart.cartId,
            itemId: cart.itemId,
          },
          {
            label: 'dbms',
            value: `${get(cluster, 'database.originalName')}-${get(
              cluster,
              'database.selectedVersion',
            )}`,
          },
        ).$promise,
        this.OvhApiOrderCartConfig.post(
          {
            cartId: cart.cartId,
            itemId: cart.itemId,
          },
          {
            label: 'region',
            value: get(cluster, 'datacenter'),
            quantity: 1,
          },
        ).$promise,
      )
      .then(() => cart);
  }

  addOptions(cart, cluster) {
    const replica = get(cluster, 'additionalReplica');
    if (replica && replica.value > 0) {
      return this.OvhApiOrderCartProduct.postOptions({
        cartId: cart.cartId,
        productName: 'enterpriseCloudDatabases',
        duration: get(cluster, 'commitmentPeriod.duration'),
        planCode: replica.planCode,
        pricingMode: get(cluster, 'paymentType.mode'),
        quantity: replica.value,
        itemId: cart.itemId,
      }).$promise.then(() => cart);
    }
    return this.$q.resolve(cart);
  }

  assignCart(cart) {
    return this.OvhApiOrderCart.assign({
      cartId: cart.cartId,
      autoPayWithPreferredPaymentMethod: true,
    }).$promise.then(() => cart);
  }

  checkoutCart(cart) {
    return this.OvhApiOrderCart.checkout({
      cartId: cart.cartId,
      autoPayWithPreferredPaymentMethod: true,
    }).$promise;
  }

  getCheckoutInfo(cart) {
    return this.OvhApiOrderCart.getCheckout({ cartId: cart.cartId }).$promise;
  }

  getOrderableAddon(clusterId) {
    return this.OvhApiOrderCartServiceOption.getAdditionalOffers({
      serviceName: clusterId,
    }).$promise.then((addons) => head(addons));
  }

  orderAddon(addon, cart, clusterId, quantity) {
    return this.OvhApiOrderCartServiceOption.orderOptions(
      { serviceName: clusterId },
      {
        cartId: cart.cartId,
        duration: get(addon, 'prices[0].duration'),
        planCode: addon.planCode,
        pricingMode: get(addon, 'prices[0].pricingMode'),
        quantity,
      },
    ).$promise.then(() => cart);
  }

  orderAddons(clusterId, quantity) {
    return this.createCart()
      .then((cart) => this.assignCart(cart))
      .then((cart) =>
        this.getOrderableAddon(clusterId).then((addon) => [addon, cart]),
      )
      .then(([addon, cart]) =>
        this.orderAddon(addon, cart, clusterId, quantity),
      )
      .then((cart) => this.checkoutCart({ cartId: cart.cartId }));
  }

  createClusterOrder(cluster) {
    return this.createCart()
      .then((cart) => this.addToCart(cart.cartId, cluster))
      .then((cart) => this.addConfig(cart, cluster))
      .then((cart) => this.addOptions(cart, cluster))
      .then((cart) => this.assignCart(cart))
      .then((cart) =>
        this.getCheckoutInfo({ cartId: cart.cartId }).then((order) => ({
          ...order,
          cart,
        })),
      );
  }

  orderCluster(cart) {
    return this.checkoutCart({ cartId: cart.cartId });
  }

  static getCapabilities(catalog, offers) {
    const capabilities = offers;
    const plans = get(catalog, 'plans', []);
    map(capabilities, (capability) => {
      const plan = find(plans, (p) => p.planCode === capability.name);
      if (!isEmpty(plan)) {
        // populate cpu, memory, storage
        EnterpriseCloudDatabaseService.populateComputation(capability, plan);
        // populate storage details
        EnterpriseCloudDatabaseService.populateStorage(capability, plan);
        // populate pricing
        EnterpriseCloudDatabaseService.populatePricing(capability, plan);
        // populate node details
        EnterpriseCloudDatabaseService.populateNodeDetails(
          capability,
          catalog,
          plan,
        );
        // populate node details
        EnterpriseCloudDatabaseService.populateAddons(
          capability,
          catalog,
          plan,
        );
      }
    });
    return capabilities;
  }

  static populatePricing(capability, plan) {
    const priceDetails = head(plan.pricings);
    const price = get(priceDetails, 'price', 0);
    const tax = get(priceDetails, 'tax', 0);
    set(capability, 'pricings', priceDetails);
    const priceObj = {
      price,
      tax,
      total: price + tax,
    };
    set(capability, 'price', priceObj);
  }

  static populateComputation(capability, plan) {
    set(capability, 'cpu', get(plan, 'blobs.technical.cpu'));
    set(capability, 'memory', get(plan, 'blobs.technical.memory'));
  }

  static populateAddons(capability, catalog, plan) {
    const planAddons = filter(get(plan, 'addonFamilies', []), { name: 'node' });
    const nodeAddonName = head(get(head(planAddons), 'addons'));
    let nodeAddon = filter(get(catalog, 'addons'), { planCode: nodeAddonName });
    nodeAddon = head(nodeAddon);
    const price = get(head(nodeAddon.pricings), 'price', 0);
    const tax = get(head(nodeAddon.pricings), 'tax', 0);
    nodeAddon.price = {
      price,
      tax,
      total: price + tax,
    };
    set(capability, 'nodeAddon', nodeAddon);
  }

  static populateStorage(capability, plan) {
    const storages = get(plan, 'blobs.technical.storage');
    const size = get(head(storages.disks), 'capacity', 0);
    const count = get(head(storages.disks), 'number', 0);
    const raid = get(storages, 'raid');
    const storage = {
      size,
      count,
      raid,
      usableSize:
        get(raid, 'level', 0) === 10 ? (size * count) / 2 : size * count,
      type: toUpper(get(head(storages.disks), 'technology', null)),
    };
    set(capability, 'storage', storage);
  }

  static populateNodeDetails(capability, catalog, plan) {
    const nodePlan = get(
      find(plan.addonFamilies, { name: 'node' }),
      'addons[0]',
    );
    set(capability, 'node', find(catalog.addons, { planCode: nodePlan }));
  }

  static getStatusGroup(status) {
    if (includes(PROCESSING_STATUS, status)) {
      return STATUS.WARNING;
    }
    if (includes(ERROR_STATUS, status)) {
      return STATUS.ERROR;
    }
    if (includes(SUCCESS_STATUS, status)) {
      return STATUS.SUCCESS;
    }
    return status;
  }

  static isProcessing(status) {
    return PROCESSING_STATUS.includes(status);
  }

  static isError(status) {
    return ERROR_STATUS.includes(status);
  }

  static isCreated(status) {
    return SUCCESS_STATUS.includes(status);
  }
}
