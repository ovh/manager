import punycode from 'punycode';

export default class wizardHostedCreationEmailCreation {
  /* @ngInject */
  constructor(OvhHttp, Poller, $q, $rootScope) {
    this.OvhHttp = OvhHttp;
    this.Poller = Poller;
    this.$q = $q;
    this.$rootScope = $rootScope;
  }

  addingOrUpdatingEmailAccount(
    organizationName,
    exchangeService,
    primaryEmailAddress,
    data,
  ) {
    return this.OvhHttp.put(
      `/email/exchange/${organizationName}/service/${exchangeService}/account/${primaryEmailAddress}`,
      {
        rootPath: 'apiv6',
        data,
      },
    ).then((task) => {
      this.$rootScope.$broadcast('exchange.wizard.request.done', task);
    });
  }

  retrievingServiceParameters(organizationName, exchangeService) {
    return this.OvhHttp.get(
      `/email/exchange/${organizationName}/service/${exchangeService}`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  checkingMigration(
    domainName,
    accountName,
    destinationServiceName,
    destinationEmailAddress,
  ) {
    const asciiDomainName = punycode.toASCII(domainName);

    return this.OvhHttp.get(
      `/email/domain/${asciiDomainName}/account/${accountName}/migrate/${destinationServiceName}/destinationEmailAddress/${destinationEmailAddress}/checkMigrate`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  executingMigration(
    domainName,
    accountName,
    destinationServiceName,
    destinationEmailAddress,
    password,
  ) {
    const asciiDomainName = punycode.toASCII(domainName);

    return this.OvhHttp.post(
      `/email/domain/${asciiDomainName}/account/${accountName}/migrate/${destinationServiceName}/destinationEmailAddress/${destinationEmailAddress}/migrate`,
      {
        rootPath: 'apiv6',
        data: {
          password,
        },
      },
    );
  }

  updatingPassword(
    organizationName,
    exchangeService,
    primaryEmailAddress,
    password,
  ) {
    return this.OvhHttp.post(
      `/email/exchange/${organizationName}/service/${exchangeService}/account/${primaryEmailAddress}/changePassword`,
      {
        rootPath: 'apiv6',
        data: {
          password,
        },
      },
    );
  }

  retrievingAvailableAccounts(organizationName, exchangeService) {
    return this.OvhHttp.get(
      `/email/exchange/${organizationName}/service/${exchangeService}/account`,
      {
        rootPath: 'apiv6',
        params: {
          primaryEmailAddress: '%configureme.me%',
        },
      },
    ).then((availableAccounts) => {
      const promises = availableAccounts.map((availableAccount) =>
        this.OvhHttp.get(
          `/email/exchange/${organizationName}/service/${exchangeService}/account/${availableAccount}`,
          {
            rootPath: 'apiv6',
          },
        ),
      );

      return this.$q.all(promises);
    });
  }

  retrievingAccounts(
    organizationName,
    exchangeService,
    search = '',
    count = 10,
    offset = 0,
  ) {
    return this.OvhHttp.get(
      `/sws/exchange/${organizationName}/${exchangeService}/accounts`,
      {
        rootPath: '2api',
        params: {
          count,
          offset,
          search,
          configurableOnly: 1,
          typeLicence: '',
        },
      },
    );
  }
}
