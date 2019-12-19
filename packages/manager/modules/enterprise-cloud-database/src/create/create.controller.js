import each from 'lodash/each';
import find from 'lodash/find';
import flatMap from 'lodash/flatMap';
import get from 'lodash/get';
import head from 'lodash/head';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import last from 'lodash/last';
import map from 'lodash/map';
import set from 'lodash/set';
import sortBy from 'lodash/sortBy';
import split from 'lodash/split';
import toArray from 'lodash/toArray';
import uniqBy from 'lodash/uniqBy';

import { COMMITMENT_PERIODS, PAYMENT_TYPES } from './create.constants';
import { DATABASE_CONSTANTS, GUIDELINK } from '../enterprise-cloud-database.constants';

export default class EnterpriseCloudDatabaseCreateCtrl {
  /* @ngInject */
  constructor($timeout, $translate, $window, CucControllerHelper,
    CucServiceHelper, CucCloudMessage, enterpriseCloudDatabaseService) {
    this.$translate = $translate;
    this.$timeout = $timeout;
    this.$window = $window;
    this.CucControllerHelper = CucControllerHelper;
    this.cucServiceHelper = CucServiceHelper;
    this.cucCloudMessage = CucCloudMessage;
    this.enterpriseCloudDatabaseService = enterpriseCloudDatabaseService;
    this.GUIDELINK = GUIDELINK;
  }

  $onInit() {
    this.loadMessages();
    this.commitmentPeriods = COMMITMENT_PERIODS;
    this.DATABASE_CONSTANTS = DATABASE_CONSTANTS;
    this.paymentTypes = PAYMENT_TYPES;
    this.allowConfigurationModify = true;
    this.orderInProgress = false;
    this.createOrderInProgress = false;
    this.contractsAccepted = false;
    const catalog = get(this, 'catalog');
    const capabilities = get(this, 'capabilities');
    const hostCount = get(this, 'hostCount');
    this.minHostCount = get(head(capabilities), 'minHostCount', 0);
    this.databasePlanMap = {};
    this.populateCapabilityDetails(catalog, capabilities, hostCount);
    this.databases = this.getUniqueDatabases();
    this.populateDefaultValues();
  }

  loadMessages() {
    this.cucCloudMessage.unSubscribe('enterprise-cloud-database.create');
    this.messageHandler = this.cucCloudMessage.subscribe('enterprise-cloud-database.create', { onMessage: () => this.refreshMessages() });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  populateDefaultValues() {
    const defaultDb = head(this.databases);
    const defaultRegions = keys(this.databasePlanMap[defaultDb.originalName]);
    const defaultDatacenter = head(defaultRegions);
    const defaultClusters = this
      .databasePlanMap[defaultDb.originalName][defaultDatacenter].clusters;
    this.clusters = defaultClusters;
    this.clusters = sortBy(this.clusters, (cluster) => cluster.memory.size);
    const defaultCluster = this.getDefaultCluster(this.clusters, defaultDatacenter);
    this.populateAdditionalReplicas(defaultCluster, defaultDatacenter);
    this.enterpriseDb = {
      database: defaultDb,
      datacenter: defaultDatacenter,
      cluster: defaultCluster,
      commitmentPeriod: head(this.commitmentPeriods),
      paymentType: this.paymentTypes[1],
      additionalReplica: head(this.additionalReplicas),
      defaultReplicaCount: this.minHostCount,
    };
    this.populateEnterpriseDatabasePrice();
    this.regions = toArray(defaultRegions);
  }

  getDefaultCluster(clusters, region) {
    return find(clusters, (cluster) => {
      const count = get(cluster, ['hostCount', region, 'hostLeft'], 0);
      return count >= this.minHostCount;
    });
  }

  populateEnterpriseDatabasePrice() {
    if (isEmpty(this.enterpriseDb.cluster)) {
      return;
    }
    this.totalDatabasePrice = {
      price: this.enterpriseDb.cluster.price.price + this.enterpriseDb.additionalReplica.price,
      tax: this.enterpriseDb.cluster.price.tax + this.enterpriseDb.additionalReplica.tax,
    };
  }

  populateCapabilityDetails(catalog, capabilities, hostCount) {
    map(capabilities, (capability) => {
      const plans = get(catalog, 'plans', []);
      const plan = find(plans, (p) => p.planCode === capability.name);
      if (!isEmpty(plan)) {
        // populate supported databases and regions
        this.populateDatabasesAndRegions(capability, plan, get(capability, 'status'), hostCount);
      }
    });
  }

  populateAdditionalReplicas(cluster, region) {
    if (isEmpty(cluster)) {
      return;
    }
    this.additionalReplicas = [
      {
        value: 0,
        price: 0,
        tax: 0,
        label: this.$translate.instant('enterprise_cloud_database_create_additional_replicas_empty'),
      },
    ];
    const addon = get(cluster, 'nodeAddon', {});
    const price = get(addon, 'price', {});
    const minReplicas = get(cluster, 'minHostCount', 0);
    const maxReplicas = get(cluster, 'maxHostCount', 0);
    const availableReplicas = get(cluster, ['hostCount', region, 'hostLeft'], 0) - minReplicas;
    if (availableReplicas <= 0) {
      set(cluster, 'numReplicasAvailable', availableReplicas);
      return;
    }
    let numReplicas = maxReplicas - minReplicas;
    numReplicas = numReplicas <= availableReplicas
      ? numReplicas : availableReplicas;
    set(cluster, 'numReplicasAvailable', numReplicas);
    for (let i = 1; i <= numReplicas; i += 1) {
      this.additionalReplicas[i] = {
        value: i,
        planCode: addon.planCode,
        price: price.price * i,
        tax: price.tax * i,
        label: this.$translate.instant((i === 1
          ? 'enterprise_cloud_database_create_additional_replica'
          : 'enterprise_cloud_database_create_additional_replicas'), {
          replicaCount: i,
        }),
      };
    }
  }

  getUniqueDatabases() {
    const allDatabases = flatMap(this.capabilities, (capability) => capability.databases);
    return uniqBy(allDatabases, 'originalName');
  }

  populateDatabasesAndRegions(capability, plan, status, hostCount) {
    const configurations = get(plan, 'configurations');
    each(configurations, (conf) => {
      if (conf.name === 'dbms') {
        const databases = EnterpriseCloudDatabaseCreateCtrl
          .getUniqueDatabasesAndVersions(get(conf, 'values'), status);
        set(capability, 'databases', databases, []);
      } else if (conf.name === 'region') {
        set(capability, 'regions', get(conf, 'values'), []);
      }
    });
    this.updateDatabasePlanMap(capability, hostCount);
  }

  updateDatabasePlanMap(capability, hostCount) {
    const databases = get(capability, 'databases');
    const regions = get(capability, 'regions');
    each(databases, (db) => {
      const dbName = db.originalName;
      if (!this.databasePlanMap[dbName]) {
        this.databasePlanMap[dbName] = {};
      }
      const dbPlanMap = this.databasePlanMap[dbName];
      each(regions, (region) => {
        if (!dbPlanMap[region]) {
          dbPlanMap[region] = {
            clusters: [],
          };
        }
        const clusters = get(dbPlanMap[region], 'clusters', []);
        if (!includes(clusters, capability.name)) {
          clusters[clusters.length] = capability;
          set(capability, 'hostCount', hostCount[capability.name]);
        }
      });
    });
  }

  onDatabaseSelect(database) {
    const regions = keys(this.databasePlanMap[database.originalName]);
    this.regions = toArray(regions);
  }

  onRegionSelect(region) {
    const databaseName = this.enterpriseDb.database.originalName;
    const regionMap = this.databasePlanMap[databaseName][region];
    this.clusters = regionMap.clusters;
    this.clusters = sortBy(this.clusters, (cluster) => cluster.memory.size);
    this.enterpriseDb.cluster = this.getDefaultCluster(this.clusters, this.enterpriseDb.datacenter);
  }

  onClusterSelect(cluster) {
    this.populateAdditionalReplicas(cluster, this.enterpriseDb.datacenter);
    this.enterpriseDb.additionalReplica = head(this.additionalReplicas);
    this.populateEnterpriseDatabasePrice();
  }

  onAdditionalReplicaChange() {
    this.populateEnterpriseDatabasePrice();
  }

  onCommitmentPeriodSelect() {
    this.populateEnterpriseDatabasePrice();
  }

  createOrder() {
    this.order = null;
    this.createOrderInProgress = true;
    this.contractsAccepted = false;
    this.enterpriseCloudDatabaseService
      .createClusterOrder(this.enterpriseDb)
      .then((order) => {
        this.order = order;
      })
      .catch((error) => {
        this.cucServiceHelper.errorHandler('enterprise_cloud_database_create_order_error')(error);
        this.CucControllerHelper.scrollPageToTop();
      })
      .finally(() => {
        this.createOrderInProgress = false;
      });
  }

  orderDatabaseCluster() {
    if (this.orderInProgress) {
      return;
    }
    this.orderInProgress = true;
    this.enterpriseCloudDatabaseService
      .orderCluster(this.order.cart)
      .then((order) => {
        this.goBackToList(this.$translate.instant('enterprise_cloud_database_create_success', {
          orderURL: this.getOrdersURL(order.orderId),
        }));
      })
      .catch((error) => {
        this.cucServiceHelper.errorHandler('enterprise_cloud_database_create_error')(error);
        this.CucControllerHelper.scrollPageToTop();
      })
      .finally(() => {
        this.orderInProgress = false;
      });
  }

  cancelOrderDatabaseCluster() {
    this.goBackToList();
  }

  onConfigurationFocus() {
    this.allowConfigurationModify = true;
  }

  onConfigurationSubmit() {
    this.allowConfigurationModify = false;
  }

  static getUniqueDatabasesAndVersions(databaseNames, status) {
    const databasesMap = {};
    each(databaseNames, (name) => {
      // separate name and version, postgresql-11
      const splitArray = split(name, '-');
      const dbName = head(splitArray);
      const dbVersion = last(splitArray);
      if (!databasesMap[dbName]) {
        const dbConstants = DATABASE_CONSTANTS[dbName];
        databasesMap[dbName] = {
          originalName: dbName,
          versions: [],
          isAvailable: status === 'available',
          selectedVersion: null,
          iconURL: get(dbConstants, 'iconURL', null),
          displayName: get(dbConstants, 'name', dbName),
        };
      }
      const db = databasesMap[dbName];
      if (!includes(db.versions, dbVersion)) {
        db.versions[db.versions.length] = dbVersion;
      }
    });
    const databasesArray = toArray(databasesMap);
    each(databasesArray, (db) => {
      sortBy(db.versions);
      set(db, 'selectedVersion', head(db.versions));
    });
    return databasesArray;
  }
}
