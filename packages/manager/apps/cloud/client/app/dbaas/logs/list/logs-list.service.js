import set from 'lodash/set';

class LogsListService {
  constructor($q, OvhApiDbaas, LogsHelperService, LogsTokensService) {
    this.$q = $q;
    this.LogsListApiService = OvhApiDbaas.Logs().v6();
    this.LogsHelperService = LogsHelperService;
    this.LogsTokensService = LogsTokensService;
  }

  /**
   * returns array of accounts with details
   *
   * @returns promise which will be resolve to array of accounts.
   *          Each account will have all details populated.
   * @memberof LogsListService
   */
  getServices() {
    return this.getServicesDetails().catch((err) =>
      this.LogsHelperService.handleError(
        'logs_accounts_get_accounts_error',
        err,
        {},
      ),
    );
  }

  /**
   * gets details for each account in array
   *
   * @returns promise which will be resolve to an array of account objects
   * @memberof LogsListService
   */
  getServicesDetails() {
    return this.getServicesIds().then((accounts) => {
      const promises = accounts.map((serviceName) =>
        this.getService(serviceName),
      );
      return this.$q.all(promises);
    });
  }

  /**
   * returns array of id's of all accounts
   *
   * @returns promise which will be resolve to array of accounts id's
   * @memberof LogsListService
   */
  getServicesIds() {
    return this.LogsListApiService.query().$promise;
  }

  /**
   * returns details of an account
   *
   * @param {any} accountId
   * @returns promise which will be resolve to account object
   * @memberof LogsListService
   */
  getService(serviceName) {
    return this.LogsListApiService.logDetail({ serviceName })
      .$promise.then((service) => this.transformService(service))
      .catch((err) =>
        this.LogsHelperService.handleError(
          'logs_accounts_get_detail_error',
          err,
          { accountName: serviceName },
        ),
      );
  }

  /**
   * returns default cluster associated with user
   *
   * @param {any} serviceName
   * @returns promise which will be resolve to default cluster
   * @memberof LogsInputsService
   */
  getDefaultCluster(serviceName) {
    return this.LogsTokensService.getDefaultCluster(
      serviceName,
      'logs_accounts_get_entry_point_error',
    );
  }

  transformService(service) {
    set(service, 'name', service.displayName || service.serviceName);
    if (this.LogsHelperService.isAccountDisabled(service)) {
      set(service, 'isDisabled', true);
    } else {
      set(service, 'isDisabled', false);
    }
    set(service, 'cluster', {
      isLoadingCluster: true,
      hostname: '-',
    });
    this.getDefaultCluster(service.serviceName)
      .then((cluster) => {
        set(service, 'cluster.hostname', cluster.hostname);
      })
      .finally(() => {
        set(service, 'cluster.isLoadingCluster', false);
      });
    return service;
  }
}

angular.module('managerApp').service('LogsListService', LogsListService);
