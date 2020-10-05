import set from 'lodash/set';

export default class LogsHomeService {
  /* @ngInject */
  constructor(
    $http,
    LogsHelperService,
    LogsConstants,
    OvhApiDbaas,
    CucServiceHelper,
    SidebarMenu,
  ) {
    this.$http = $http;
    this.DetailsAapiService = OvhApiDbaas.Logs()
      .Details()
      .Aapi();
    this.LogsLexiService = OvhApiDbaas.Logs().v6();
    this.LogsHelperService = LogsHelperService;
    this.LogsConstants = LogsConstants;
    this.CucServiceHelper = CucServiceHelper;
    this.SidebarMenu = SidebarMenu;
  }

  /**
   * Gets the transformed account details object
   *
   * @param {any} serviceName
   * @returns promise which will resolve to the account details object
   * @memberof LogsHomeService
   */
  getAccountDetails(serviceName) {
    return this.DetailsAapiService.me({ serviceName })
      .$promise.then((accountDetails) =>
        this.transformAccountDetails(accountDetails),
      )
      .catch(
        this.CucServiceHelper.errorHandler(
          'logs_home_account_details_get_error',
        ),
      );
  }

  /**
   * Gets the data usage statistics data (number of documents and data received)
   *
   * @param {any} serviceName
   * @returns promise which will resolve with the statistics data
   * @memberof LogsHomeService
   */
  getDataUsage(serviceName, metricName) {
    return this.getAccountDetails(serviceName)
      .then((accountDetails) => {
        const token = btoa(accountDetails.metrics.token);
        const query = {
          start: Math.max(
            moment()
              .subtract(
                this.LogsConstants.DATA_STORAGE.TIME_PERIOD_MONTHS,
                'month',
              )
              .unix() * 1000,
            moment(accountDetails.service.createdAt).unix() * 1000,
          ),
          queries: [
            {
              metric: metricName,
              aggregator: this.LogsConstants.DATA_STORAGE.AGGREGATORS.ZIMSUM,
              downsample: this.LogsConstants.DATA_STORAGE.DOWNSAMPLING_MODE[
                '24H_MAX'
              ],
            },
          ],
        };
        return this.$http({
          method: 'POST',
          url: `${accountDetails.metrics.host}/api/query`,
          headers: {
            Authorization: `Basic ${token}`,
          },
          preventLogout: true,
          data: JSON.stringify(query),
        });
      })
      .then((data) => {
        const timestamps =
          data.data.length > 0 ? Object.keys(data.data[0].dps) : [];
        // eslint-disable-next-line no-param-reassign
        data = data.data.map((dat) =>
          timestamps.map((timestamp) => dat.dps[timestamp]),
        );
        return {
          timestamps: timestamps.map((timestamp) => timestamp * 1000),
          usageData: data,
        };
      })
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
    return this.LogsLexiService.serviceInfos({ serviceName }).$promise.catch(
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
    return this.LogsLexiService.update(
      { serviceName },
      {
        displayName: service.displayName,
      },
    )
      .$promise.then((operation) => {
        this.resetAllCache();
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_home_display_name_update_success',
          {},
        ).then((res) => {
          this.changeMenuTitle(serviceName, service.displayName || serviceName);
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
  getElasticSearchApiUrl(object) {
    const elasticSearchApiUrl = this.constructor.findUrl(
      object.urls,
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
  getGrayLogApiUrl(object) {
    set(
      object,
      'graylogApiUrl',
      this.constructor.findUrl(
        object.urls,
        this.LogsConstants.URLS.GRAYLOG_API,
      ),
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
  getGrayLogUrl(object) {
    set(
      object,
      'graylogWebuiUrl',
      this.constructor.findUrl(
        object.urls,
        this.LogsConstants.URLS.GRAYLOG_WEBUI,
      ),
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
  getPortsAndMessages(accountDetails) {
    const portsAndMessages = {};
    accountDetails.urls.forEach((url) => {
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
    return Object.keys(portsAndMessages).map(
      (portType) => portsAndMessages[portType],
    );
  }

  /**
   * Resets all relevant caches
   *
   * @memberof LogsHomeService
   */
  resetAllCache() {
    this.DetailsAapiService.resetAllCache();
    this.LogsLexiService.resetAllCache();
  }

  /**
   * Returns the transformed account details object
   *
   * @param {any} accountDetails
   * @returns the transformed account detials object
   * @memberof LogsHomeService
   */
  transformAccountDetails(accountDetails) {
    set(
      accountDetails,
      'email',
      accountDetails.service.contact
        ? accountDetails.service.contact.email
        : accountDetails.me.email,
    );
    this.getGrayLogUrl(accountDetails);
    this.getGrayLogApiUrl(accountDetails);
    set(
      accountDetails,
      'graylogApiUrl',
      `${accountDetails.graylogApiUrl}/api-browser`,
    );
    set(
      accountDetails,
      'graylogEntryPoint',
      accountDetails.graylogWebuiUrl
        .replace('https://', '')
        .replace('/api', ''),
    );
    this.getElasticSearchApiUrl(accountDetails);
    if (accountDetails.last_stream) {
      this.getGrayLogUrl(accountDetails.last_stream);
    }
    if (accountDetails.last_dashboard) {
      this.getGrayLogUrl(accountDetails.last_dashboard);
    }
    set(
      accountDetails,
      'portsAndMessages',
      this.getPortsAndMessages(accountDetails),
    );
    return accountDetails;
  }

  /**
   * Returns the transformed option object
   *
   * @param {any} option
   * @returns the transformed option object
   * @memberof LogsHomeService
   */
  static transformOption(option) {
    set(
      option,
      'description',
      `${option.quantity} ${option.type}: ${option.detail}`,
    );
    return option;
  }

  /**
   * Sets the menu's title
   *
   * @param {any} serviceName
   * @param {any} displayName
   * @memberof LogsHomeService
   */
  changeMenuTitle(serviceName, displayName) {
    const menuItem = this.SidebarMenu.getItemById(serviceName);
    if (menuItem) {
      menuItem.title = displayName;
    }
  }
}
