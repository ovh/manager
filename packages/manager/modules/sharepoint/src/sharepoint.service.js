import compact from 'lodash/compact';
import filter from 'lodash/filter';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import startsWith from 'lodash/startsWith';
import reduce from 'lodash/reduce';

const URL_DEFAULT_SUFFIX = '.sp.ovh.net';
const DEFAULT_SUBSIDIARY = 'GB';

export default class MicrosoftSharepointLicenseService {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    Alerter,
    OvhHttp,
    OvhApiEmailExchange,
    SHAREPOINT_GUIDE_URLS,
    User,
    iceberg,
  ) {
    this.alerter = Alerter;
    this.OvhHttp = OvhHttp;
    this.$q = $q;
    this.SHAREPOINT_GUIDE_URLS = SHAREPOINT_GUIDE_URLS;
    this.$translate = $translate;
    this.User = User;
    this.OvhApiEmailExchange = OvhApiEmailExchange;
    this.iceberg = iceberg;

    this.cache = {
      models: 'UNIVERS_MODULE_SHAREPOINT_MODELS',
      sharepoints: 'UNIVERS_MODULE_SHAREPOINT_SHAREPOINTS',
      services: 'UNIVERS_MODULE_SHAREPOINT_SERVICES',
      servicesInfos: 'UNIVERS_MODULE_SHAREPOINT_SERVICE_INFOS',
      accounts: 'UNIVERS_MODULE_SHAREPOINT_SERVICE_ACCOUNTS',
      license: 'UNIVERS_MODULE_SHAREPOINT_SERVICE_LICENSE',
    };

    this.User.getUrlOfEndsWithSubsidiary('express_order')
      .then((orderBaseUrl) => {
        this.orderBaseUrl = orderBaseUrl;
      })
      .catch((error) => {
        this.alerter.alertFromSWS(
          this.$translate.instant('sharepoint_dashboard_error'),
          error,
        );
      });
  }

  /**
   * Set guide
   * @param {string} assignToObject
   * @param {string} assignToProperty
   */
  assignGuideUrl(assignToObject, assignToProperty) {
    return this.User.getUser().then((user) => {
      // eslint-disable-next-line no-param-reassign
      assignToObject[assignToProperty] =
        this.SHAREPOINT_GUIDE_URLS[user.ovhSubsidiary] ||
        this.SHAREPOINT_GUIDE_URLS[DEFAULT_SUBSIDIARY];
    });
  }

  /**
   * Get serviceName infos
   * @param {string} serviceName
   */
  retrievingMSService(serviceName) {
    return this.OvhHttp.get(`/msServices/${serviceName}`, {
      rootPath: 'apiv6',
      cache: this.cache.sharepoints,
    });
  }

  /**
   * Get sharepoint infos
   * @param {string} serviceName
   */
  getSharepoint(serviceName) {
    return this.OvhHttp.get(`/msServices/${serviceName}/sharepoint`, {
      rootPath: 'apiv6',
      cache: this.cache.sharepoints,
    });
  }

  /**
   * Update sharepoint
   * @param {string} serviceName
   * @param {string} url
   */
  setSharepointUrl(serviceName, url) {
    return this.OvhHttp.put(`/msServices/${serviceName}/sharepoint`, {
      rootPath: 'apiv6',
      data: {
        url,
      },
      clearAllCache: this.cache.sharepoints,
    });
  }

  /**
   * Update sharepoint
   * @param {string} serviceName
   * @param {string|null} displayName
   *
   */
  setSharepointDisplayName(serviceName, displayName) {
    return this.OvhHttp.put(`/msServices/${serviceName}/sharepoint`, {
      rootPath: 'apiv6',
      data: {
        displayName,
      },
      clearAllCache: this.cache.sharepoints,
    });
  }

  /**
   * @param {string} exchangeName
   * @param {array} emails
   */
  getSharepointOrderUrl(exchangeName, emails) {
    if (isEmpty(this.orderBaseUrl)) {
      return null;
    }

    const configuration = emails.map((email) => ({
      planCode: 'sharepoint_account',
      configuration: [
        {
          label: 'EXCHANGE_ACCOUNT_ID',
          values: [email],
        },
      ],
    }));

    const products = [
      {
        planCode: 'sharepoint_platform',
        configuration: [
          {
            label: 'EXCHANGE_SERVICE_NAME',
            values: [exchangeName],
          },
        ],
        option: configuration,
      },
    ];

    return `${
      this.orderBaseUrl
    }#/new/express/resume?productId=sharepoint&products=${JSURL.stringify(
      products,
    )}`;
  }

  /**
   *
   * @param {string} serviceName
   * @param {string} primaryEmailAddress
   */
  getSharepointAccountOrderUrl(serviceName, primaryEmailAddress) {
    if (isEmpty(this.orderBaseUrl)) {
      return null;
    }

    const productId = 'sharepoint';
    const products = [
      {
        planCode: 'sharepoint_account',
        configuration: [
          {
            label: 'EXCHANGE_ACCOUNT_ID',
            values: [primaryEmailAddress],
          },
        ],
      },
    ];

    return `${
      this.orderBaseUrl
    }#/new/express/resume?productId=${productId}&serviceName=${serviceName}&products=${JSURL.stringify(
      products,
    )}`;
  }

  /**
   *
   * @param {string} serviceName
   * @param {number} number
   */
  getSharepointStandaloneNewAccountOrderLegacyUrl(serviceName, number) {
    if (isEmpty(this.orderBaseUrl)) {
      return null;
    }

    const products = [
      {
        planCode: 'sharepoint_account',
        quantity: number || 1,
        productId: 'sharepoint',
        serviceName,
      },
    ];

    return `${this.orderBaseUrl}#/new/express/resume?products=${JSURL.stringify(
      products,
    )}`;
  }

  /**
   *
   * @param {string} serviceName
   * @param {number} quantity
   */
  getSharepointStandaloneNewAccountOrderUrl(serviceName, quantity) {
    if (isEmpty(this.orderBaseUrl)) {
      return null;
    }

    const products = [
      {
        productId: 'microsoft',
        planCode: 'activedirectory-account-hosted',
        serviceName,
        configuration: [],
        option: [
          {
            planCode: 'sharepoint-account-hosted-2016',
            quantity,
          },
        ],
      },
    ];

    return `${this.orderBaseUrl}#/express/review?products=${JSURL.stringify(
      products,
    )}`;
  }

  /**
   *
   * @param {string} serviceName
   * @param {number} quantity
   */
  getSharepointProviderNewAccountOrderUrl(serviceName, quantity) {
    if (isEmpty(this.orderBaseUrl)) {
      return null;
    }

    const products = [
      {
        productId: 'microsoft',
        planCode: 'activedirectory-account-provider',
        serviceName,
        configuration: [],
        option: [
          {
            planCode: 'sharepoint-account-provider-2016',
            quantity,
          },
        ],
      },
    ];

    return `${this.orderBaseUrl}#/express/review?products=${JSURL.stringify(
      products,
    )}`;
  }

  /**
   *
   * @param {number} quantity
   */
  getSharepointStandaloneOrderUrl(quantity) {
    if (isEmpty(this.orderBaseUrl)) {
      return null;
    }

    const productId = 'sharepoint';
    const products = [
      {
        planCode: 'sharepoint_platform',
        configuration: [],
        option: [
          {
            planCode: 'sharepoint_account',
            quantity: quantity || 1,
            configuration: [],
          },
        ],
      },
    ];

    return `${
      this.orderBaseUrl
    }#/new/express/resume?productId=${productId}&products=${JSURL.stringify(
      products,
    )}`;
  }

  /**
   *
   * @param {number} quantity
   */
  getSharepointProviderOrderUrl(quantity = 1) {
    if (isEmpty(this.orderBaseUrl)) {
      return null;
    }

    const products = [
      {
        productId: 'microsoft',
        planCode: 'activedirectory-provider',
        configuration: [],
        option: [
          {
            planCode: 'sharepoint-provider',
          },
          {
            planCode: 'activedirectory-account-provider',
            quantity,
            option: [
              {
                planCode: 'sharepoint-account-provider-2016',
                quantity,
              },
            ],
          },
        ],
      },
    ];

    return `${this.orderBaseUrl}#/express/review?products=${JSURL.stringify(
      products,
    )}`;
  }

  /**
   * Get sharepoint options
   * @param {string} serviceName
   */
  retrievingSharepointServiceOptions(serviceName) {
    return this.OvhHttp.get(
      `/order/cartServiceOption/sharepoint/${serviceName}`,
      {
        rootPath: 'apiv6',
        cache: this.cache.sharepoints,
      },
    );
  }

  /**
   * Get SharePoint accounts
   * @param serviceName
   * @param userPrincipalName
   */
  getAccounts(serviceName, userPrincipalName) {
    const queryParam = {};

    if (!isEmpty(userPrincipalName)) {
      queryParam.userPrincipalName = `%${userPrincipalName}%`;
    }

    return this.OvhHttp.get(`/msServices/${serviceName}/account`, {
      rootPath: 'apiv6',
      params: queryParam,
      cache: this.cache.sharepoints,
    });
  }

  /**
   *
   * @param {string} serviceName
   */
  restoreAdminRights(serviceName) {
    return this.OvhHttp.post(
      `/msServices/${serviceName}/sharepoint/restoreAdminRights`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * Get account details
   * @param {string} serviceName
   * @param {string} account
   */
  getAccountDetails(serviceName, account) {
    return this.OvhHttp.get(`/msServices/${serviceName}/account/${account}`, {
      rootPath: 'apiv6',
      cache: this.cache.sharepoints,
    });
  }

  /**
   * Get SharePoint account
   * @param {string} serviceName
   * @param {string} account
   */
  getAccountSharepoint(serviceName, account) {
    return this.OvhHttp.get(
      `/msServices/${serviceName}/account/${account}/sharepoint`,
      {
        rootPath: 'apiv6',
        cache: this.cache.sharepoints,
      },
    );
  }

  /**
   *
   * @param {string} serviceName
   * @param {string} account
   * @param {object} data
   */
  updateSharepointAccount(serviceName, account, data) {
    return this.OvhHttp.put(
      `/msServices/${serviceName}/account/${account}/sharepoint`,
      {
        rootPath: 'apiv6',
        data,
        clearAllCache: this.cache.sharepoints,
      },
    );
  }

  /**
   *
   * @param {string} serviceName
   * @param {string} account
   * @param {Object} data
   */
  updateSharepoint(serviceName, account, data) {
    return this.OvhHttp.put(`/msServices/${serviceName}/account/${account}`, {
      rootPath: 'apiv6',
      data,
      clearAllCache: this.cache.sharepoints,
    });
  }

  /**
   *
   * @param {string} serviceName
   * @param {string} account
   * @param {Object} opts
   */
  updatingSharepointPasswordAccount(serviceName, account, opts) {
    return this.OvhHttp.post(
      `/msServices/${serviceName}/account/${account}/changePassword`,
      {
        rootPath: 'apiv6',
        data: {
          password: opts.password,
        },
      },
    );
  }

  /**
   *
   * @param {string} serviceName
   * @param {string} account
   */
  deleteSharepointAccount(serviceName, account) {
    return this.OvhHttp.put(
      `/msServices/${serviceName}/account/${account}/sharepoint`,
      {
        rootPath: 'apiv6',
        data: {
          deleteAtExpiration: true,
        },
        clearAllCache: this.cache.sharepoints,
      },
    );
  }

  /**
   * Get account
   * @param {string} organizationName
   * @param {string} sharepointService
   * @param {string} userPrincipalName
   */
  getAccount(organizationName, sharepointService, userPrincipalName) {
    return this.OvhHttp.get(
      `/sharepoint/${organizationName}/service/${sharepointService}/account/${userPrincipalName}`,
      {
        rootPath: 'apiv6',
        cache: this.cache.accounts,
      },
    );
  }

  /**
   * Get account tasks
   * @param {string} organizationName
   * @param {string} sharepointService
   * @param {string} userPrincipalName
   */
  getAccountTasks(organizationName, sharepointService, userPrincipalName) {
    return this.OvhHttp.get(
      `/sharepoint/${organizationName}/service/${sharepointService}/account/${userPrincipalName}/tasks`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * An API function will be developed to get directly the info.
   * For now, an exchange with hostname "ex.mail.ovh.net" should have the suffix ".sp.ovh.net"
   * An exchange with hostname "ex2.mail.ovh.net" will have the suffix ".sp2.ovh.net"
   */
  retrievingSharepointSuffix(serviceName) {
    return this.OvhHttp.get(`/msServices/${serviceName}/sharepoint`, {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    })
      .then((sharepoint) => {
        const separator = startsWith(sharepoint.farmUrl, '.') ? '' : '.';

        return `${separator}${sharepoint.farmUrl}`;
      })
      .catch(() => URL_DEFAULT_SUFFIX);
  }

  /**
   * Get upn suffixes, that is the domains allowed for account's configuration
   */
  getUsedUpnSuffixes() {
    return this.OvhHttp.get('/msServices', {
      rootPath: 'apiv6',
      cache: this.cache.sharepoints,
    })
      .then((msServices) => {
        const queue = msServices.map((serviceId) =>
          this.OvhHttp.get(`/msServices/${serviceId}/upnSuffix`, {
            rootPath: 'apiv6',
            cache: this.cache.sharepoints,
          })
            .then((suffixes) => suffixes)
            .catch(() => null),
        );

        return this.$q.all(queue).then((data) => flatten(compact(data)));
      })
      .catch(() => []);
  }

  /**
   * Get upn suffixes, that is the domains allowed for account's configuration
   */
  getSharepointUpnSuffixes(serviceName) {
    return this.OvhHttp.get(`/msServices/${serviceName}/upnSuffix`, {
      rootPath: 'apiv6',
      cache: this.cache.sharepoints,
    });
  }

  /**
   * Add an upn suffix
   */
  addSharepointUpnSuffixe(serviceName, suffix) {
    return this.OvhHttp.post(`/msServices/${serviceName}/upnSuffix`, {
      rootPath: 'apiv6',
      data: {
        suffix,
      },
      clearAllCache: this.cache.sharepoints,
    });
  }

  /**
   * Delete an upn suffix
   */
  deleteSharepointUpnSuffix(serviceName, suffix) {
    return this.OvhHttp.delete(
      `/msServices/${serviceName}/upnSuffix/${suffix}`,
      {
        rootPath: 'apiv6',
        clearAllCache: this.cache.sharepoints,
      },
    );
  }

  /**
   * Get upn suffix details
   */
  getSharepointUpnSuffixeDetails(serviceName, suffix) {
    return this.OvhHttp.get(`/msServices/${serviceName}/upnSuffix/${suffix}`, {
      rootPath: 'apiv6',
      cache: this.cache.sharepoints,
    });
  }

  /**
   * Get tasks list
   * @param {string} serviceName
   */
  getTasks(serviceName) {
    return this.OvhHttp.get(`/msServices/${serviceName}/sharepoint/task`, {
      rootPath: 'apiv6',
    });
  }

  /**
   * Get task details
   * @param {string} serviceName
   * @param {string} tasksId
   */
  getTask(serviceName, tasksId) {
    return this.OvhHttp.get(
      `/msServices/${serviceName}/sharepoint/task/${tasksId}`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  getAllExchangeServices() {
    return this.OvhHttp.get('/email/exchange', {
      rootPath: 'apiv6',
    })
      .then((serviceIds) =>
        this.$q.all(
          map(serviceIds, (serviceId) => this.getExchangeServices(serviceId)),
        ),
      )
      .then((services) =>
        reduce(
          services,
          (flattened, other) => {
            return flattened.concat(other);
          },
          [],
        ),
      );
  }

  getExchangeServices(organizationName) {
    return this.iceberg('/email/exchange/:organizationName/service')
      .query()
      .expand('CachedObjectList-Pages')
      .execute({ organizationName })
      .$promise.then((services) => services.data)
      .then((services) =>
        filter(
          services,
          (service) => has(service, 'displayName') && has(service, 'offer'),
        ),
      )
      .then((services) =>
        map(services, (service) => ({
          name: service.domain,
          displayName: service.displayName,
          organization: service.domain,
          type: `EXCHANGE_${service.offer.toUpperCase()}`,
        })),
      );
  }

  getAssociatedExchangeService(exchangeId) {
    return this.getExchangeServices(exchangeId)
      .then((services) =>
        find(services, {
          name: exchangeId,
        }),
      )
      .then((exchangeService) => {
        if (exchangeService) {
          return {
            exchangeService,
            exchangeLink: `#/configuration/${exchangeService.type.toLowerCase()}/${
              exchangeService.organization
            }/${exchangeService.name}`,
          };
        }
        return this.$q.reject();
      });
  }
}
