import defaults from 'lodash/defaults';
import filter from 'lodash/filter';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import reduce from 'lodash/reduce';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $timeout,
    $translate,
    $window,
    coreConfig,
    coreURLBuilder,
    CucCloudMessage,
    CucControllerHelper,
    OvhApiHostingPrivateDatabase,
    VpsService,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$window = $window;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
    this.CucCloudMessage = CucCloudMessage;
    this.CucControllerHelper = CucControllerHelper;
    this.ApiPrivateDb = OvhApiHostingPrivateDatabase.v6();
    this.ApiWhitelist = OvhApiHostingPrivateDatabase.Whitelist().v6();
    this.VpsService = VpsService;
  }

  $onInit() {
    this.serviceName = this.$stateParams.serviceName;

    this.statusFilterOptions = {
      values: reduce(
        [
          'detached',
          'restartPending',
          'startPending',
          'started',
          'stopPending',
          'stopped',
        ],
        (result, key) => ({
          ...result,
          [key]: this.$translate.instant(`vps_database_status_${key}`),
        }),
        {},
      ),
    };

    this.ipv4 = null;
    this.cloudDatabases = [];

    this.cloudDatabaseOrderHref = this.coreURLBuilder.buildURL(
      'web',
      '#/order-cloud-db',
    );

    this.refresh();
  }

  refresh() {
    this.loading = true;
    return this.loadIps()
      .then((ips) => {
        this.ipv4 = ips.find(({ version }) => version === 'v4')?.ipAddress;
      })
      .then(() => this.loadDatabases())
      .then((databases) => {
        this.cloudDatabases = databases;
      })
      .catch(() => {
        throw new Error('Temporary error from the API');
      })
      .finally(() => {
        this.loading = false;
      });
  }

  loadIps() {
    return this.VpsService.getIps(this.serviceName);
  }

  loadDatabases() {
    return this.ApiPrivateDb.query()
      .$promise.then((serviceNames) =>
        this.$q.all(
          map(
            serviceNames,
            (serviceName) => this.ApiPrivateDb.get({ serviceName }).$promise,
          ),
        ),
      )
      .then((databases) => filter(databases, { offer: 'public' }))
      .then((databases) =>
        this.$q.all(
          map(databases, (database) =>
            this.isVpsAuthorized(database.serviceName).then((vpsAuthorized) =>
              defaults({ vpsAuthorized }, database),
            ),
          ),
        ),
      )
      .then((databases) =>
        map(databases, (database) =>
          defaults(
            {
              name: database.displayName || database.serviceName,
            },
            database,
          ),
        ),
      )
      .catch((error) => {
        this.CucCloudMessage.error(
          [
            this.$translate.instant('vps_tab_cloud_database_fetch_error'),
            get(error, 'data.message', ''),
          ].join(' '),
        );
      });
  }

  isVpsAuthorized(serviceName) {
    return this.ApiWhitelist.query({
      serviceName,
      ip: this.ipv4,
      service: true,
    }).$promise.then((whitelist) => !isEmpty(whitelist));
  }

  addAuthorizedIp(database) {
    const { serviceName } = database;
    return this.ApiWhitelist.post(
      { serviceName },
      {
        ip: this.ipv4,
        name: this.$translate.instant(
          'vps_tab_cloud_database_whitelist_ip_name',
          { vps: this.serviceName },
        ),
        service: true,
        sftp: false,
      },
    )
      .$promise.then(() => {
        this.$timeout(() => {
          this.CucCloudMessage.success(
            this.$translate.instant(
              'vps_tab_cloud_database_whitelist_add_success',
            ),
          );
          this.refresh();
        }, 2000);
      })
      .catch((error) => {
        this.CucCloudMessage.error(
          [
            this.$translate.instant(
              'vps_tab_cloud_database_whitelist_add_error',
            ),
            get(error, 'data.message', ''),
          ].join(' '),
        );
      });
  }

  removeAuthorizedIp(database) {
    const { serviceName } = database;
    return this.ApiWhitelist.deleteIp(
      { serviceName },
      { ip: `${this.ipv4}/32` },
    )
      .$promise.then(() => {
        this.$timeout(() => {
          this.CucCloudMessage.success(
            this.$translate.instant(
              'vps_tab_cloud_database_whitelist_remove_success',
            ),
          );
          this.refresh();
        }, 2000);
      })
      .catch((error) => {
        this.CucCloudMessage.error(
          [
            this.$translate.instant(
              'vps_tab_cloud_database_whitelist_remove_error',
            ),
            get(error, 'data.message', ''),
          ].join(' '),
        );
      });
  }

  goToCloudDatabase(database) {
    const { serviceName } = database;
    this.$window.open(
      this.coreURLBuilder.buildURL(
        'web',
        '#/configuration/private_database/:serviceName',
        {
          serviceName,
        },
      ),
    );
  }
}
