import camelCase from 'lodash/camelCase';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import transform from 'lodash/transform';

export default class ExchangeDomains {
  /* @ngInject */
  constructor($rootScope, $http, $q, constants, wucExchange, OvhHttp) {
    this.services = {
      $rootScope,
      $http,
      $q,
      constants,
      wucExchange,
      OvhHttp,
    };
  }

  gettingDomains(
    organization,
    serviceName,
    count = 10,
    offset = 0,
    search = '',
  ) {
    return this.services.OvhHttp.get(
      '/sws/exchange/{organization}/{exchange}/domains',
      {
        rootPath: '2api',
        urlParams: {
          organization,
          exchange: serviceName,
        },
        params: {
          count,
          offset,
          search,
        },
      },
    );
  }

  addingDomain(domainToAdd) {
    const keyMapping = {
      mxParam: 'configureMx',
      srvParam: 'configureAutodiscover',
    };

    const transformDomain = transform(
      domainToAdd,
      (result, valueParam, key) => {
        let value = valueParam;

        if (key === 'type') {
          value = camelCase(value);
        }

        if (!isEmpty(pick(keyMapping, key))) {
          // uses value from the keyMapping object
          // eslint-disable-next-line no-param-reassign
          result[keyMapping[key]] = value;
        } else {
          // uses value from the domain
          // eslint-disable-next-line no-param-reassign
          result[key] = value;
        }
      },
    );

    if (transformDomain.type === 'authoritative') {
      delete transformDomain.mxRelay;
    }

    return this.services.OvhHttp.post(
      '/email/exchange/{organizationName}/service/{exchangeService}/domain',
      {
        rootPath: 'apiv6',
        urlParams: {
          organizationName: this.services.wucExchange.value.organization,
          exchangeService: this.services.wucExchange.value.domain,
        },
        data: transformDomain,
      },
    ).then((response) => {
      this.services.wucExchange.resetDomains();
      this.services.wucExchange.resetAccounts();
      this.services.wucExchange.resetTasks();

      return response;
    });
  }

  retrievingDataToCreateDomains(organization, productId) {
    return this.services.OvhHttp.get(
      '/sws/exchange/{organization}/{exchange}/domains/options',
      {
        rootPath: '2api',
        urlParams: {
          organization,
          exchange: productId,
        },
      },
    );
  }

  updatingDomain(organization, productId, domainName, data) {
    return this.services.OvhHttp.put(
      '/email/exchange/{organization}/service/{exchange}/domain/{domainName}',
      {
        rootPath: 'apiv6',
        urlParams: {
          organization,
          exchange: productId,
          domainName,
        },
        data,
      },
    ).then((response) => {
      this.services.wucExchange.resetDomains();
      this.services.wucExchange.resetTasks();

      return response;
    });
  }

  removingDomain(organization, serviceName, name) {
    return this.services.OvhHttp.delete(
      '/email/exchange/{organization}/service/{exchange}/domain/{domainName}',
      {
        rootPath: 'apiv6',
        urlParams: {
          organization,
          exchange: serviceName,
          domainName: name,
        },
      },
    ).then((response) => {
      this.services.wucExchange.resetDomains();
      this.services.wucExchange.resetAccounts();
      this.services.wucExchange.resetTasks();

      return response;
    });
  }

  /**
   * Get exchange license history
   */
  addingZoneDnsField(organization, serviceName, data) {
    return this.services.OvhHttp.put(
      '/sws/exchange/{organization}/{exchange}/domains/{domain}/dnsSettings-update',
      {
        rootPath: '2api',
        urlParams: {
          organization,
          exchange: serviceName,
          domain: data.domain,
        },
        data,
      },
    );
  }

  gettingDNSSettings(organization, serviceName, domain) {
    return this.services.OvhHttp.get(
      '/sws/exchange/{organization}/{exchange}/domains/{domain}/dnsSettings',
      {
        rootPath: '2api',
        urlParams: {
          organization,
          exchange: serviceName,
          domain,
        },
      },
    );
  }

  gettingExpectedDNSSettings(organization, serviceName, domain) {
    return this.services.OvhHttp.get(
      '/email/exchange/{organization}/service/{exchange}/domain/{domain}',
      {
        rootPath: 'apiv6',
        urlParams: {
          organization,
          exchange: serviceName,
          domain,
        },
      },
    );
  }

  getDkimSelector(organization, serviceName, domain) {
    return this.services.$http
      .get(
        `/email/exchange/${organization}/service/${serviceName}/domain/${domain}/dkimSelector`,
      )
      .then(({ data }) => data);
  }

  getDkimSelectorName(organization, serviceName, domain, selector) {
    return this.services.$http
      .get(
        `/email/exchange/${organization}/service/${serviceName}/domain/${domain}/dkim/${selector}`,
      )
      .then(({ data }) => data);
  }

  getDomain(organization, serviceName, domain) {
    return this.services.$http
      .get(
        `/email/exchange/${organization}/service/${serviceName}/domain/${domain}`,
      )
      .then(({ data }) => data);
  }

  postDkim(organization, serviceName, domain, params) {
    return this.services.$http
      .post(
        `/email/exchange/${organization}/service/${serviceName}/domain/${domain}/dkim`,
        params,
      )
      .then(({ data }) => data);
  }

  disableDkim(organization, serviceName, domain, selector) {
    return this.services.$http
      .post(
        `/email/exchange/${organization}/service/${serviceName}/domain/${domain}/dkim/${selector}/disable`,
      )
      .then(({ data }) => data);
  }

  enableDkim(organization, serviceName, domain, selector) {
    return this.services.$http
      .post(
        `/email/exchange/${organization}/service/${serviceName}/domain/${domain}/dkim/${selector}/enable`,
      )
      .then(({ data }) => data);
  }
}
