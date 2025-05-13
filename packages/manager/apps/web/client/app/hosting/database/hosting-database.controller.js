import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';

import {
  FREE_HOSTING_OFFER,
  BANNER_GUIDE_LINK,
  STARTER_OFFERS,
} from './hosting-database.constants';
import { DATABASES_TRACKING } from '../hosting.constants';

angular.module('App').controller(
  'HostingTabDatabasesCtrl',
  class HostingTabDatabasesCtrl {
    /* @ngInject */
    constructor(
      $q,
      $scope,
      $state,
      $stateParams,
      $timeout,
      $translate,
      atInternet,
      Alerter,
      coreConfig,
      Hosting,
      HostingDatabase,
      HostingDatabaseOrderPublicService,
      WucConverterService,
    ) {
      this.$q = $q;
      this.$scope = $scope;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$timeout = $timeout;
      this.$translate = $translate;
      this.atInternet = atInternet;
      this.alerter = Alerter;
      this.hostingService = Hosting;
      this.hostingDatabaseService = HostingDatabase;
      this.HostingDatabaseOrderPublicService = HostingDatabaseOrderPublicService;
      this.WucConverterService = WucConverterService;
      this.bannerGuideLink =
        BANNER_GUIDE_LINK[coreConfig.getUser().ovhSubsidiary] ||
        BANNER_GUIDE_LINK.DEFAULT;
    }

    $onInit() {
      this.hosting = this.$scope.hosting;
      this.hostingProxy = this.$scope.hostingProxy;
      this.canCreateDatabase =
        this.hosting.databaseMax - this.hosting.databaseCount > 0;
      this.databases = {
        details: [],
      };
      this.hasResult = false;
      this.loading = {
        databases: false,
        init: true,
        orderCapabilities: true,
      };
      this.search = {
        value: null,
      };

      this.$scope.$on('hosting.databases.backup.restore', () =>
        this.reloadCurrentPage(),
      );

      this.$scope.$on(
        `${this.hostingService.events.tabDatabasesCreation}.done`,
        () => {
          this.alerter.success(
            this.$translate.instant(
              'hosting_tab_DATABASES_configuration_create_bdd_added',
            ),
            this.$scope.alerts.main,
          );
          this.reloadCurrentPage();
        },
      );

      this.$scope.$on(
        `${this.hostingService.events.tabDatabasesCreation}.error`,
        (err) => {
          this.alerter.alertFromSWS(
            this.$translate.instant('hosting_tab_databases_get_error'),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
          this.reloadCurrentPage();
        },
      );

      this.$scope.$on(this.hostingService.events.tabDatabasesRefresh, () => {
        this.reloadCurrentPage();
      });

      return this.loadDatabases()
        .then(() => this.loadOrderPublicCapabilities())
        .finally(() => {
          this.loading.init = false;
          this.loading.databases = false;
          this.loading.orderCapabilities = false;
        });
    }

    loadOrderPublicCapabilities() {
      this.loading.orderCapabilities = true;

      return this.HostingDatabaseOrderPublicService.getCharacteristicsOfAvailableProducts(
        this.hosting.serviceName,
      )
        .then((characteristics) => {
          this.canOrderPublic = !isEmpty(characteristics);
        })
        .finally(() => {
          this.loading.orderCapabilities = true;
        });
    }

    static formatVersion(version) {
      return (version || '').replace(/_/gi, '.');
    }

    static formatStatus(type, isDeprecated) {
      return `hosting_tab_DATABASES_table_header_status_${type}_${isDeprecated}`;
    }

    checkQuota(database) {
      const deferred = this.$q.defer();
      this.$scope.setAction('database/quota/hosting-database-quota', {
        database: database.name,
        deferred,
      });
      return deferred.promise
        .then((task) => {
          // eslint-disable-next-line no-param-reassign
          database.quotaCalculating = true;
          return this.hostingService.pollDatabaseQuotaTask(
            this.$stateParams.productId,
            task.id,
          );
        })
        .then(() => {
          // eslint-disable-next-line no-param-reassign
          database.quotaCalculating = false;
          this.reloadCurrentPage();
        });
    }

    emptySearch() {
      this.search.value = '';
      this.goSearch();
    }

    goSearch() {
      this.loadDatabases();
    }

    convertBytesSize(nb, unit, decimalWanted = 0) {
      const res = filesize(this.WucConverterService.convertToOctet(nb, unit), {
        output: 'object',
        round: decimalWanted,
        base: -1,
      });
      const resUnit = this.$translate.instant(`unit_size_${res.symbol}`);
      return `${res.value} ${resUnit}`;
    }

    getQuotaUsageString(quotaUsed, quotaSize) {
      return `${this.convertBytesSize(
        quotaUsed.value,
        quotaUsed.unit,
        2,
      )} / ${this.convertBytesSize(quotaSize.value, quotaSize.unit)}`;
    }

    getPhpMyAdminUrl(element) {
      let PHPMYADMIN_BASE_URL = 'https://phpmyadmin.ovh.net/index.php';
      const queryString = `pma_username=${element.user}&pma_servername=${element.name}`;

      if (this.hostingProxy.datacenter !== 'p19') {
        PHPMYADMIN_BASE_URL = `https://phpmyadmin.${this.hostingProxy.cluster}.hosting.ovh.net/index.php`;
      }
      return `${PHPMYADMIN_BASE_URL}?${queryString}`;
    }

    loadDatabases() {
      this.loading.databases = true;
      this.databases.ids = null;

      return this.hostingDatabaseService
        .getDatabaseIds(this.$stateParams.productId, this.search.value)
        .then((ids) => {
          this.databases.ids = ids;
        })
        .catch((err) => {
          this.alerter.alertFromSWS(
            this.$translate.instant('hosting_tab_databases_get_error'),
            err,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          if (!isEmpty(this.databases.ids)) {
            this.hasResult = true;
          }
        });
    }

    reloadCurrentPage() {
      if (!this.loading.databases) {
        this.loadDatabases();
      }
    }

    restoreDump(database) {
      this.$scope.bdd = database;
      this.$state.go('app.hosting.dashboard.database.dashboard.dump', {
        name: database.name,
      });
    }

    transformItem(id) {
      return this.$q
        .all({
          database: this.hostingDatabaseService.getDatabase(
            this.$stateParams.productId,
            id,
          ),
          dumps: this.hostingDatabaseService.getDumpIds(
            this.$stateParams.productId,
            id,
          ),
        })
        .then(({ database, dumps }) => {
          set(
            database,
            'quotaUsed.asText',
            this.getQuotaUsageString(database.quotaUsed, database.quotaSize),
          );
          set(
            database,
            'quotaUsed.cappedAsText',
            this.convertBytesSize(
              database.quotaUsed.value,
              database.quotaUsed.unit,
              2,
            ),
          );
          set(database, 'dumpsCount', dumps.length || 0);
          set(database, 'dumps', dumps);
          return database;
        });
    }

    onTransformItemDone() {
      this.loading.init = false;
      this.loading.databases = false;
    }

    isFreeHosting() {
      return FREE_HOSTING_OFFER.includes(this.hosting.offer);
    }

    isStarterOffer() {
      return STARTER_OFFERS.includes(this.hosting.offer);
    }

    trackClick(hit) {
      this.atInternet.trackClick({
        name: hit,
        type: 'action',
      });
    }

    onActionsMenuClick() {
      this.trackClick(DATABASES_TRACKING.SELECT_LIST_ACTION);
    }

    onCreateDatabaseClick() {
      this.trackClick(DATABASES_TRACKING.SELECT_LIST_ACTION_CREATE_DB);

      this.$scope.setAction('database/add/hosting-database-add');
    }

    onCopyDatabaseClick(element) {
      this.$scope.setAction('database/copy/hosting-database-copy', {
        currentDatabaseName: element.name,
        serviceName: this.hosting.serviceName,
      });
    }

    onOrderDatabaseClick() {
      this.trackClick(DATABASES_TRACKING.SELECT_LIST_ACTION_ORDER_DB);
    }

    onActivateWebCloudDatabaseClick() {
      this.trackClick(DATABASES_TRACKING.SELECT_LIST_ACTION_CREATE_DB);
    }

    onOrderWebCloudDatabaseClick() {
      this.trackClick(DATABASES_TRACKING.SELECT_LIST_ACTION_ORDER_WEB_CLOUD_DB);
    }

    onCreateDatabaseBtnClick() {
      this.trackClick(DATABASES_TRACKING.GO_TO_CREATE_DATABASE);

      this.$scope.setAction('database/add/hosting-database-add');
    }

    onDatabaseChangeOfferClick() {
      this.trackClick(DATABASES_TRACKING.GO_TO_CHANGE_DATABASE);
    }
  },
);
