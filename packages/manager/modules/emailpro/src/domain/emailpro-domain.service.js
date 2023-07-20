import camelCase from 'lodash/camelCase';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import transform from 'lodash/transform';

export default /* @ngInject */ function EmailProDomains(EmailPro, OvhHttp) {
  this.getDomains = function getDomains(
    serviceName,
    pageSize,
    offset,
    searchParam,
  ) {
    const search = searchParam || undefined;

    return EmailPro.gettingIsServiceMXPlan().then((isMXPlan) =>
      OvhHttp.get('/sws/emailpro/{exchange}/domains', {
        rootPath: '2api',
        urlParams: {
          exchange: serviceName,
        },
        params: {
          count: pageSize || 10,
          offset: offset || 0,
          search,
          isMXPlan,
        },
      }),
    );
  };

  this.addDomain = function addDomain(domainToAdd) {
    return EmailPro.getSelected().then((exchange) => {
      const keyMapping = {
        mxParam: 'configureMx',
        srvParam: 'configureAutodiscover',
      };
      const transformDomain = transform(
        domainToAdd,
        (result, valueParam, key) => {
          let value = valueParam;
          if (key === 'type') {
            if (value) {
              value = camelCase(value);
            }
          }

          /* eslint-disable no-param-reassign */
          if (!isEmpty(pick(keyMapping, key))) {
            result[keyMapping[key]] = value;
          } else {
            result[key] = value;
          }
          /* eslint-enable no-param-reassign */
        },
      );

      if (transformDomain.type === 'authoritative') {
        delete transformDomain.mxRelay;
      }

      return EmailPro.gettingBaseAPIPath()
        .then((baseAPIPath) =>
          OvhHttp.post(`/${baseAPIPath}/{exchangeService}/domain`, {
            rootPath: 'apiv6',
            urlParams: {
              exchangeService: exchange.domain,
            },
            data: transformDomain,
          }),
        )
        .then((response) => {
          EmailPro.resetDomains();
          EmailPro.resetAccounts();
          EmailPro.resetTasks();
          return response;
        })
        .catch((err) => EmailPro.getSuccessDataOrReject(err));
    });
  };

  this.getAddDomainData = function getAddDomainData(serviceName) {
    return EmailPro.gettingIsServiceMXPlan().then((isMXPlan) =>
      OvhHttp.get('/sws/emailpro/{exchange}/domains/options', {
        rootPath: '2api',
        urlParams: {
          exchange: serviceName,
        },
        params: {
          isMXPlan,
        },
      }),
    );
  };

  this.updateDomain = function updateDomain(organization, productId, domain) {
    return EmailPro.gettingBaseAPIPath()
      .then((baseAPIPath) =>
        OvhHttp.put(`/${baseAPIPath}/{exchange}/domain/{domainName}`, {
          rootPath: 'apiv6',
          urlParams: {
            organization,
            exchange: productId,
            domainName: domain.name,
          },
          data: {
            mxRelay: domain.mxRelay,
            type: camelCase(domain.type),
          },
        }),
      )
      .then((response) => {
        EmailPro.resetDomains();
        EmailPro.resetTasks();
        return response;
      });
  };

  this.removeDomain = function removeDomain(serviceName, name) {
    return EmailPro.gettingBaseAPIPath()
      .then((baseAPIPath) =>
        OvhHttp.delete(`/${baseAPIPath}/{exchange}/domain/{domainName}`, {
          rootPath: 'apiv6',
          urlParams: {
            exchange: serviceName,
            domainName: name,
          },
        }),
      )
      .then((response) => {
        EmailPro.resetDomains();
        EmailPro.resetAccounts();
        EmailPro.resetTasks();
        return response;
      });
  };

  /**
   * Get exchange license history
   */
  this.addZoneDnsField = function addZoneDnsField(serviceName, data) {
    return EmailPro.gettingIsServiceMXPlan().then((isMXPlan) => {
      Object.assign(data, { isMXPlan });

      return OvhHttp.put(
        '/sws/emailpro/{exchange}/domains/{domain}/dnsSettings-update',
        {
          rootPath: '2api',
          urlParams: {
            exchange: serviceName,
            domain: data.domain,
          },
          data,
        },
      );
    });
  };

  this.getDnsSettings = function getDnsSettings(serviceName, domain) {
    return EmailPro.gettingIsServiceMXPlan().then((isMXPlan) =>
      OvhHttp.get('/sws/emailpro/{exchange}/domains/{domain}/dnsSettings', {
        rootPath: '2api',
        urlParams: {
          exchange: serviceName,
          domain,
        },
        params: {
          isMXPlan,
        },
      }),
    );
  };

  this.getExpectedDNSSettings = function getExpectedDNSSettings(
    serviceName,
    domain,
  ) {
    return OvhHttp.get('/email/pro/{service}/domain/{domain}', {
      rootPath: 'apiv6',
      urlParams: {
        service: serviceName,
        domain,
      },
    });
  };
}
