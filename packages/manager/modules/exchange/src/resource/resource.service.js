import punycode from 'punycode';

export default class ExchangeResources {
  /* @ngInject */
  constructor($http, $q, $rootScope, wucExchange, OvhHttp) {
    this.services = {
      $http,
      $q,
      $rootScope,
      wucExchange,
      OvhHttp,
    };
  }

  /**
   * Return the selected resources for the current exchange account
   */
  retrievingResources(
    organization,
    serviceName,
    count = 10,
    offset = 0,
    search = '',
  ) {
    return this.services.OvhHttp.get(
      '/sws/exchange/{organization}/{exchange}/resources',
      {
        rootPath: '2api',
        clearCache: true,
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

  /**
   * Return the options for creating resources
   */
  getResourcesOptions(organization, serviceName) {
    return this.services.$q
      .all({
        accounts: this.services.wucExchange.getAccountIds({
          organizationName: organization,
          exchangeService: serviceName,
        }),
        externalContacts: this.services.wucExchange.getExternalContactIds({
          organizationName: organization,
          exchangeService: serviceName,
        }),
        mailingLists: this.services.wucExchange.getMailingListIds({
          organizationName: organization,
          exchangeService: serviceName,
        }),
        models: this.services.wucExchange.getModels(),
        domains: this.services.wucExchange.getDomainIds({
          organizationName: organization,
          exchangeService: serviceName,
          state: 'ok',
        }),
        resourceAccounts: this.services.wucExchange.getResourceAccountIds({
          organizationName: organization,
          exchangeService: serviceName,
        }),
      })
      .then(
        ({
          accounts,
          externalContacts,
          mailingLists,
          models,
          domains,
          resourceAccounts,
        }) => ({
          availableDomains: domains.map((domain) => ({
            name: domain,
            displayName: punycode.toUnicode(domain),
          })),
          resourceTypeEnum:
            models.models['email.exchange.ResourceTypeEnum'].enum,
          showMeetingDetailsEnum:
            models.models['email.exchange.ShowMeetingDetailsEnum'].enum,
          takenEmails: [].concat(
            accounts,
            mailingLists,
            externalContacts,
            resourceAccounts,
          ),
        }),
      );
  }

  addResource(organization, serviceName, resource) {
    return this.services.OvhHttp.post(
      '/email/exchange/{organization}/service/{exchange}/resourceAccount',
      {
        rootPath: 'apiv6',
        urlParams: {
          organization,
          exchange: serviceName,
        },
        data: resource,
      },
    ).then((response) => {
      this.services.wucExchange.resetResources();
      this.services.wucExchange.resetTasks();

      return response;
    });
  }

  updateResource(
    organization,
    serviceName,
    currentResourceEmailAddress,
    resource,
  ) {
    return this.services.OvhHttp.put(
      '/email/exchange/{organization}/service/{exchange}/resourceAccount/{resourceEmailAddress}',
      {
        rootPath: 'apiv6',
        urlParams: {
          organization,
          exchange: serviceName,
          resourceEmailAddress: currentResourceEmailAddress,
        },
        data: resource,
      },
    ).then((response) => {
      this.services.wucExchange.resetResources();
      this.services.wucExchange.resetTasks();

      return response;
    });
  }

  /**
   * Delete resource
   */
  removeResource(organization, serviceName, resourceEmailAddress) {
    return this.services.OvhHttp.delete(
      '/email/exchange/{organization}/service/{exchange}/resourceAccount/{resourceEmailAddress}',
      {
        rootPath: 'apiv6',
        urlParams: {
          organization,
          exchange: serviceName,
          resourceEmailAddress,
        },
      },
    ).then((data) => {
      this.services.wucExchange.resetResources();
      this.services.wucExchange.resetTasks();

      return data;
    });
  }

  /**
   * Get accounts by resource
   */
  getAccountsByResource(
    organization,
    serviceName,
    resourceEmailAddress,
    count = 10,
    offset = 0,
    search = '',
  ) {
    return this.services.OvhHttp.get(
      '/sws/exchange/{organization}/{exchange}/resources/{resourceEmailAddress}/rights',
      {
        rootPath: '2api',
        clearCache: true,
        urlParams: {
          organization,
          exchange: serviceName,
          resourceEmailAddress,
        },
        params: {
          count,
          offset,
          search,
        },
      },
    );
  }

  /**
   * Get accounts by resource
   */
  updateResourceDelegation(
    organization,
    serviceName,
    resourceEmailAddress,
    delegationModel,
  ) {
    return this.services.OvhHttp.put(
      '/sws/exchange/{organization}/{exchange}/resources/{resourceEmailAddress}/rights-update',
      {
        rootPath: '2api',
        clearCache: true,
        urlParams: {
          organization,
          exchange: serviceName,
          resourceEmailAddress,
        },
        data: delegationModel,
      },
    ).then((response) => {
      this.services.wucExchange.resetResources();
      this.services.wucExchange.resetTasks();

      return response;
    });
  }
}
