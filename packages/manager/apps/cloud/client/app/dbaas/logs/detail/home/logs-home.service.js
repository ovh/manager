import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';

class LogsHomeService {
  constructor($http, $q, $translate, LogsHelperService, LogsConstants, LogsOptionsService,
    OvhApiDbaas, CucServiceHelper, SidebarMenu) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.AccountingAapiService = OvhApiDbaas.Logs().Accounting().Aapi();
    this.ContactsApiLexiService = OvhApiDbaas.Logs().Contacts().v6();
    this.DetailsAapiService = OvhApiDbaas.Logs().Details().Aapi();
    this.InputsApiAapiService = OvhApiDbaas.Logs().Input().Aapi();
    this.InputsApiLexiService = OvhApiDbaas.Logs().Input().v6();
    this.LogsLexiService = OvhApiDbaas.Logs().v6();
    this.LogsHelperService = LogsHelperService;
    this.LogsConstants = LogsConstants;
    this.LogsOptionsService = LogsOptionsService;
    this.OperationApiService = OvhApiDbaas.Logs().Operation().v6();
    this.CucServiceHelper = CucServiceHelper;
    this.SidebarMenu = SidebarMenu;
  }

  /**
   * Gets the transformed account object
   *
   * @param {any} serviceName
   * @returns promise which will resolve to the account object
   * @memberof LogsHomeService
   */
  getAccount(serviceName) {
    return this.AccountingAapiService.me({ serviceName }).$promise
      .then((account) => this.transformAccount(account))
      .catch(this.CucServiceHelper.errorHandler('logs_home_account_get_error'));
  }

  /**
   * Gets the transformed account details object
   *
   * @param {any} serviceName
   * @returns promise which will resolve to the account details object
   * @memberof LogsHomeService
   */
  getAccountDetails(serviceName) {
    return this.DetailsAapiService.me({ serviceName }).$promise
      .then((accountDetails) => this.transformAccountDetails(accountDetails))
      .catch(this.CucServiceHelper.errorHandler('logs_home_account_details_get_error'));
  }

  /**
   * Gets the current offer object
   *
   * @param {any} serviceName
   * @returns promise which will resolve to the current offer object
   * @memberof LogsHomeService
   */
  getCurrentOffer(serviceName) {
    return this.LogsOfferService
      .getOffer(serviceName)
      .then((offer) => this.transformOffer(offer));
  }

  /**
   * Gets the data usage statistics data (number of documents and data received)
   *
   * @param {any} serviceName
   * @returns promise which will resolve with the statistics data
   * @memberof LogsHomeService
   */
  getDataUsage(serviceName) {
    return this.getAccountDetails(serviceName)
      .then((accountDetails) => {
        this.createdAt = accountDetails.service.createdAt;
        return this.getAccount(serviceName);
      })
      .then((account) => {
        const token = btoa(account.metrics.token);
        const query = {
          start: Math.max(moment().subtract(this.LogsConstants.DATA_STORAGE.TIME_PERIOD_MONTHS, 'month').unix() * 1000, moment(this.createdAt).unix() * 1000),
          queries: [{
            metric: this.LogsConstants.DATA_STORAGE.METRICS.SUM,
            aggregator: this.LogsConstants.DATA_STORAGE.AGGREGATORS.ZIMSUM,
            downsample: this.LogsConstants.DATA_STORAGE.DOWNSAMPLING_MODE['24H_MAX'],
          },
          {
            metric: this.LogsConstants.DATA_STORAGE.METRICS.COUNT,
            aggregator: this.LogsConstants.DATA_STORAGE.AGGREGATORS.ZIMSUM,
            downsample: this.LogsConstants.DATA_STORAGE.DOWNSAMPLING_MODE['24H_MAX'],
          }],
        };
        return this.$http({
          method: 'POST',
          url: `${account.metrics.host}/api/query`,
          headers: {
            Authorization: `Basic ${token}`,
          },
          preventLogout: true,
          data: JSON.stringify(query),
        });
      })
      .then((data) => {
        const timestamps = data.data.length > 0 ? Object.keys(data.data[0].dps) : [];
        data = data.data.map(dat => timestamps.map(timestamp => dat.dps[timestamp])); // eslint-disable-line
        return {
          timestamps: timestamps.map((timestamp) => timestamp * 1000),
          usageData: data,
        };
      })
      .catch(this.CucServiceHelper.errorHandler('logs_home_data_get_error'));
  }

  /**
   * Gets the cold storage data volume
   *
   * @param {any} serviceName
   * @returns promise which will resolve with the data volume
   * @memberof LogsHomeService
   */
  getColdstorage(serviceName) {
    return this.getAccount(serviceName)
      .then((account) => {
        const token = btoa(account.metrics.token);
        return this.$http({
          method: 'GET',
          url: `${account.metrics.host}/api/query/last`,
          params: { timeseries: this.LogsConstants.DATA_STORAGE.METRICS.COLD_STORAGE_TOTAL },
          headers: {
            Authorization: `Basic ${token}`,
          },
          preventLogout: true,
        }).then((data) => ({
          coldStorage: data.data.length > 0
            ? Math.floor(data.data[0].value)
            : undefined,
        }));
      });
  }

  /**
   * Gets the currently subscribed options
   *
   * @param {any} serviceName
   * @returns promise which will resolve to the array of subscribed options
   * @memberof LogsHomeService
   */
  getOptions(serviceName) {
    return this.LogsOptionsService.getSubscribedOptionsMap(serviceName)
      .then((options) => {
        options.forEach((option) => this.constructor.transformOption(option));
        return options;
      });
  }

  /**
   * Gets the service info
   *
   * @param {any} serviceName
   * @returns promise which will resolve to the service info
   * @memberof LogsHomeService
   */
  getServiceInfos(serviceName) {
    return this.LogsLexiService.serviceInfos({ serviceName }).$promise
      .catch(this.CucServiceHelper.errorHandler('logs_home_service_info_get_error'));
  }

  /**
   * Converts the number to a more readable formhttps://sharepoint.corp.ovh.com/my/personal/gio-94fbba0f2de44122/_layouts/15/WopiFrame.aspx?sourcedoc={935AFCC0-72B9-4B54-AAC4-135A9AE8415D}&file=UX%20Projects%20-%20W12-13.pptx&action=default
   *
   * @param {any} number
   * @returns the number in more readable form
   * @memberof LogsHomeService
   */
  /* eslint-disable no-restricted-properties */
  static humanizeNumber(number) {
    if (number < 1000) {
      return Math.round(number * 100) / 100;
    }
    const si = ['K', 'M', 'G', 'T', 'P', 'H'];
    const exp = Math.floor(Math.log(number) / Math.log(1000));
    let result = number / Math.pow(1000, exp);
    result = result % 1 > (1 / Math.pow(1000, exp - 1))
      ? Math.round(result.toFixed(2) * 100) / 100
      : result.toFixed(0);
    const unit = si[exp - 1];
    return `${result} ${unit}`;
  }
  /* eslint-enable no-restricted-properties */

  /**
   * Updates the current display name information
   *
   * @param {any} serviceName
   * @param {service} service
   * @returns promise which will resolve or reject once the operation is complete
   * @memberof LogsHomeService
   */
  updateDisplayName(serviceName, service) {
    return this.LogsLexiService.update({ serviceName },
      {
        displayName: service.displayName,
        isCapped: service.isCapped,
      })
      .$promise.then((operation) => {
        this.resetAllCache();
        return this.LogsHelperService.handleOperation(serviceName, operation.data || operation, 'logs_home_display_name_update_success', { })
          .then((res) => {
            this.changeMenuTitle(serviceName, service.displayName || serviceName);
            return res;
          });
      })
      .catch((err) => this.LogsHelperService.handleError('logs_home_display_name_update_error', err, { }));
  }

  /**
   * Updates the current capped plan settings
   *
   * @param {any} serviceName
   * @param {service} service
   * @returns promise which will resolve or reject once the operation is complete
   * @memberof LogsHomeService
   */
  updateCappedPlan(serviceName, service) {
    return this.LogsLexiService.update({ serviceName },
      {
        displayName: service.displayName,
        isCapped: service.isCapped,
      })
      .$promise.then((operation) => {
        this.resetAllCache();
        return this.LogsHelperService.handleOperation(serviceName, operation.data || operation, 'logs_home_capped_update_success', { });
      })
      .catch((err) => this.LogsHelperService.handleError('logs_home_capped_update_error', err, { }));
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
    return urls.reduce((foundUrl, url) => (url.type === type ? url.address : foundUrl), '');
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
    set(object, 'elasticSearchApiUrl', `${elasticSearchApiUrl}/_cluster/health?pretty=true`);
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
    set(object, 'graylogApiUrl', this.constructor.findUrl(object.urls, this.LogsConstants.URLS.GRAYLOG_API));
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
    set(object, 'graylogWebuiUrl', this.constructor.findUrl(
      object.urls,
      this.LogsConstants.URLS.GRAYLOG_WEBUI,
    ));
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
        portsAndMessages[urlInfo.PORT] = portsAndMessages[urlInfo.PORT]
          || { name: this.LogsConstants.PORT_TYPES[urlInfo.PORT] };
        portsAndMessages[urlInfo.PORT][urlInfo.MESSAGE] = url.address.split(':')[1]; // eslint-disable-line
      }
    });
    return Object.keys(portsAndMessages).map((portType) => portsAndMessages[portType]);
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
   * Returns the transformed account object
   *
   * @param {any} account
   * @returns the transformed account object
   * @memberof LogsHomeService
   */
  transformAccount(account) {
    if (isEmpty(account.offer)) {
      set(account, 'offer.description', '');
    } else if (account.offer.reference === this.LogsConstants.basicOffer) {
      set(account, 'offer.description', this.LogsConstants.offertypes.BASIC);
    } else {
      const dataVolume = this.$translate.instant('logs_home_data_volume');
      const dataVolumeValue = this.$translate.instant(account.offer.reference);
      set(account, 'offer.description', `${this.LogsConstants.offertypes.PRO} - ${dataVolume}: ${dataVolumeValue}`);
    }
    return account;
  }

  /**
   * Returns the transformed account details object
   *
   * @param {any} accountDetails
   * @returns the transformed account detials object
   * @memberof LogsHomeService
   */
  transformAccountDetails(accountDetails) {
    set(accountDetails, 'email', accountDetails.service.contact
      ? accountDetails.service.contact.email
      : accountDetails.me.email);
    this.getGrayLogUrl(accountDetails);
    this.getGrayLogApiUrl(accountDetails);
    set(accountDetails, 'graylogApiUrl', `${accountDetails.graylogApiUrl}/api-browser`);
    set(accountDetails, 'graylogEntryPoint', accountDetails.graylogWebuiUrl
      .replace('https://', '')
      .replace('/api', ''));
    this.getElasticSearchApiUrl(accountDetails);
    if (accountDetails.last_stream) { this.getGrayLogUrl(accountDetails.last_stream); }
    if (accountDetails.last_dashboard) { this.getGrayLogUrl(accountDetails.last_dashboard); }
    set(accountDetails, 'portsAndMessages', this.getPortsAndMessages(accountDetails));
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
    set(option, 'description', `${option.quantity} ${option.type}: ${option.detail}`);
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

angular.module('managerApp').service('LogsHomeService', LogsHomeService);
