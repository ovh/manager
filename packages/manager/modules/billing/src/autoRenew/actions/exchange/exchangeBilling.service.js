export default class Exchange {
  /* @ngInject */
  constructor(OvhHttp) {
    this.OvhHttp = OvhHttp;
  }

  getExchangeDetails(organization, exchange) {
    return this.OvhHttp.get('/sws/exchange/{organization}/{exchange}', {
      rootPath: '2api',
      urlParams: {
        organization,
        exchange,
      },
    });
  }

  /**
   * Return paginated accounts list for the specified exchange.
   * @param exchange - an object describing exchange service we want the accounts of.
   * @param count - the number of resources to retrieve.
   * @param offset - page index
   * @param search - filter over primaryEmail value
   * @param configurableOnly - Integer value: "0" to get all, "1" to filter out dummy accounts
   *                           and creating/deleting ones
   */
  getAccountsForExchange(
    exchange,
    count = 10,
    offset = 0,
    search = '',
    configurableOnly = 0,
    type = '',
    timeout = null,
  ) {
    return this.OvhHttp.get(
      '/sws/exchange/{organization}/{exchange}/accounts',
      {
        rootPath: '2api',
        urlParams: {
          organization: exchange.organization,
          exchange: exchange.domain,
        },
        params: {
          count,
          offset,
          search,
          configurableOnly,
          typeLicence: type,
        },
        timeout,
      },
    );
  }

  updateRenew(organization, serviceName, accounts) {
    return this.OvhHttp.put(
      '/sws/exchange/{organization}/{exchange}/accounts/renew',
      {
        rootPath: '2api',
        urlParams: {
          organization,
          exchange: serviceName,
        },
        data: {
          modelList: accounts,
        },
      },
    );
  }
}
