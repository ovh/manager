import set from 'lodash/set';

export default class LogsHomeService {
  /* @ngInject */
  constructor(
    $http,
    $injector,
    LogsHelperService,
    LogsConstants,
    CucServiceHelper,
    LogsDashboardsService,
    LogsStreamsService,
  ) {
    this.$http = $http;
    this.$injector = $injector;
    this.LogsHelperService = LogsHelperService;
    this.LogsConstants = LogsConstants;
    this.CucServiceHelper = CucServiceHelper;
    this.LogsDashboardsService = LogsDashboardsService;
    this.LogsStreamsService = LogsStreamsService;
  }

  /**
   * Gets the transformed account details object
   *
   * @param {any} serviceName
   * @returns promise which will resolve to the account details object
   * @memberof LogsHomeService
   */
  getAccountDetails(serviceName) {
    return this.getService(serviceName)
      .then((service) => this.transformService(service))
      .catch(
        this.CucServiceHelper.errorHandler(
          'logs_home_account_details_get_error',
        ),
      );
  }

  getService(serviceName) {
    return this.$http
      .get(`/dbaas/logs/${serviceName}`)
      .then(({ data }) => data);
  }

  getMetricAccount(serviceName) {
    return this.$http
      .get(`/dbaas/logs/${serviceName}/metrics`)
      .then(({ data }) => data);
  }

  /**
   * Gets the data usage statistics data (number of documents and data received)
   *
   * @param {any} serviceName
   * @returns promise which will resolve with the statistics data
   * @memberof LogsHomeService
   */
  getDataUsage(serviceName) {
    return this.getMetricAccount(serviceName)
      .then((metrics) => {
        const token = btoa(metrics.token);
        return this.$http({
          method: 'GET',
          url: `${metrics.host}/search`,
          headers: {
            Authorization: `Basic ${token}`,
          },
          preventLogout: true,
        });
      })
      .then(({ data }) => data)
      .catch(this.CucServiceHelper.errorHandler('logs_home_data_get_error'));
  }

  /**
   * Gets the service info
   *
   * @param {any} serviceName
   * @returns promise which will resolve to the service info
   * @memberof LogsHomeService
   */
  getServiceInfos(serviceName) {
    return this.$http
      .get(`/dbaas/logs/${serviceName}/serviceInfos`)
      .then(({ data }) => data)
      .catch(
        this.CucServiceHelper.errorHandler('logs_home_service_info_get_error'),
      );
  }

  /**
   * Updates the current display name information
   *
   * @param {any} serviceName
   * @param {service} service
   * @returns promise which will resolve or reject once the operation is complete
   * @memberof LogsHomeService
   */
  updateDisplayName(serviceName, service) {
    return this.$http
      .put(`/dbaas/logs/${serviceName}`, {
        displayName: service.displayName,
      })
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_home_display_name_update_success',
          {},
        ).then((res) => {
          if (this.$injector.has('shellClient')) {
            const shellClient = this.$injector.get('shellClient');
            shellClient.ux.updateMenuSidebarItemLabel(
              serviceName,
              service.displayName || serviceName,
            );
          }
          return res;
        });
      })
      .catch((err) =>
        this.LogsHelperService.handleError(
          'logs_home_display_name_update_error',
          err,
          {},
        ),
      );
  }

  /**
   * Finds and returns a url from a list of urls based on it's type
   *
   * @param {any} urls the list of urls
   * @param {string} type the type of url that has to be retrieved
   * @returns the found url
   * @memberof LogsHomeService
   */
  static findUrl(urls, type) {
    return urls.reduce(
      (foundUrl, url) => (url.type === type ? url.address : foundUrl),
      '',
    );
  }

  /**
   * Gets the Elasticsearch url from the object
   *
   * @param {any} object the object with urls
   * @returns the Elasticsearch url
   * @memberof LogsHomeService
   */
  getElasticSearchApiUrl(object, urls) {
    const elasticSearchApiUrl = this.constructor.findUrl(
      urls,
      this.LogsConstants.URLS.ELASTICSEARCH_API,
    );
    set(
      object,
      'elasticSearchApiUrl',
      `${elasticSearchApiUrl}/_cluster/health?pretty=true`,
    );
    return object;
  }

  /**
   * Gets the Graylog API url from the object
   *
   * @param {any} object the object with urls
   * @returns the Graylog API url
   * @memberof LogsHomeService
   */
  getGrayLogApiUrl(object, urls) {
    const graylogApiUrl = this.constructor.findUrl(
      urls,
      this.LogsConstants.URLS.GRAYLOG_API,
    );
    set(
      object,
      'graylogApiUrl',
      `${graylogApiUrl}/api-browser/global/index.html`,
    );
    return object;
  }

  getGrayLogEntryPoint(object, urls) {
    const graylogWebuiUrl = this.constructor.findUrl(
      urls,
      this.LogsConstants.URLS.GRAYLOG_WEBUI,
    );
    set(
      object,
      'graylogEntryPoint',
      graylogWebuiUrl.replace('https://', '').replace('/api', ''),
    );
    return object;
  }

  /**
   * Gets the Graylog url from the object
   *
   * @param {any} object the object with urls
   * @returns the Graylog url
   * @memberof LogsHomeService
   */
  getGrayLogUrl(object, urls) {
    set(
      object,
      'graylogWebuiUrl',
      this.constructor.findUrl(urls, this.LogsConstants.URLS.GRAYLOG_WEBUI),
    );
    return object;
  }

  /**
   * Builds and returns the ports and messages information from the account details object
   *
   * @param {any} accountDetails
   * @returns the ports and messages information
   * @memberof LogsHomeService
   */
  getPortsAndMessages(service, urls) {
    const portsAndMessages = {};
    urls.forEach((url) => {
      const urlInfo = this.LogsConstants.URL_TYPES[url.type];
      if (urlInfo) {
        portsAndMessages[urlInfo.PORT] = portsAndMessages[urlInfo.PORT] || {
          name: this.LogsConstants.PORT_TYPES[urlInfo.PORT],
        };
        // eslint-disable-next-line prefer-destructuring
        portsAndMessages[urlInfo.PORT][urlInfo.MESSAGE] = url.address.split(
          ':',
        )[1];
      }
    });
    set(
      service,
      'portsAndMessages',
      Object.keys(portsAndMessages).map(
        (portType) => portsAndMessages[portType],
      ),
    );
    return service;
  }

  getLastUpdatedStream(service) {
    this.LogsStreamsService.getLastUpdatedStream(service.serviceName).then(
      (stream) => {
        if (stream) {
          this.$http
            .get(
              `/dbaas/logs/${service.serviceName}/output/graylog/stream/${stream.streamId}/url`,
            )
            .then(({ data: urls }) => {
              set(service, 'last_stream', stream);
              this.getGrayLogUrl(service.last_stream, urls);
            });
        }
      },
    );
  }

  getLastUpdatedDashboard(service) {
    this.LogsDashboardsService.getLastUpdatedDashboard(
      service.serviceName,
    ).then((dashboard) => {
      if (dashboard) {
        this.$http
          .get(
            `/dbaas/logs/${service.serviceName}/output/graylog/dashboard/${dashboard.dashboardId}/url`,
          )
          .then(({ data: urls }) => {
            set(service, 'last_dashboard', dashboard);
            this.getGrayLogUrl(service.last_dashboard, urls);
          });
      }
    });
  }

  transformService(service) {
    this.getLastUpdatedStream(service);
    this.getLastUpdatedDashboard(service);
    this.$http
      .get(`/dbaas/logs/${service.serviceName}/url`)
      .then(({ data: urls }) => {
        this.getGrayLogUrl(service, urls);
        this.getGrayLogApiUrl(service, urls);
        this.getGrayLogEntryPoint(service, urls);
        this.getElasticSearchApiUrl(service, urls);
        this.getPortsAndMessages(service, urls);
      });

    return service;
  }

  /**
   * Sets the menu's title
   *
   * @param {any} serviceName
   * @param {any} displayName
   * @memberof LogsHomeService
   */
  changeMenuTitle(serviceName, displayName) {
    if (this.$injector.has('shellClient')) {
      const shellClient = this.$injector.get('shellClient');
      shellClient.ux.updateMenuSidebarItemLabel(serviceName, displayName);
    }
  }
}
