import findIndex from 'lodash/findIndex';
import keys from 'lodash/keys';

export default class ExchangeSharedAccounts {
  /* @ngInject */
  constructor(
    $translate,
    wucExchange,
    OvhHttp,
    WucConverterFactory,
    WucConverterService,
  ) {
    this.services = {
      $translate,
      wucExchange,
      OvhHttp,
      WucConverterFactory,
      WucConverterService,
    };
  }

  retrievingSharedAccounts(
    organization,
    exchange,
    count = 10,
    offset = 0,
    search = '',
  ) {
    return this.services.OvhHttp.get(
      `/sws/exchange/${organization}/${exchange}/sharedAccounts`,
      {
        rootPath: '2api',
        params: {
          count,
          offset,
          search,
        },
      },
    );
  }

  retrievingNewSharedAccountOptions(organization, exchange) {
    return this.services.OvhHttp.get(
      `/sws/exchange/${organization}/${exchange}/sharedAccounts/options`,
      {
        rootPath: '2api',
      },
    );
  }

  addingSharedAccount(organization, exchange, data) {
    return this.services.OvhHttp.post(
      `/email/exchange/${organization}/service/${exchange}/sharedAccount`,
      {
        rootPath: 'apiv6',
        data,
      },
    ).then((response) => {
      this.services.wucExchange.resetSharedAccounts();
      this.services.wucExchange.resetTasks();

      return response;
    });
  }

  updatingSharedAccount(organization, exchange, sharedEmailAddress, data) {
    return this.services.OvhHttp.put(
      `/email/exchange/${organization}/service/${exchange}/sharedAccount/${sharedEmailAddress}`,
      {
        rootPath: 'apiv6',
        data,
      },
    ).then((response) => {
      this.services.wucExchange.resetSharedAccounts();
      this.services.wucExchange.resetTasks();

      return response;
    });
  }

  deletingSharedAccount(organization, exchange, sharedEmailAddress) {
    return this.services.OvhHttp.delete(
      `/email/exchange/${organization}/service/${exchange}/sharedAccount/${sharedEmailAddress}`,
      {
        rootPath: 'apiv6',
      },
    ).then((response) => {
      this.services.wucExchange.resetSharedAccounts();
      this.services.wucExchange.resetTasks();

      return response;
    });
  }

  retrievingSharedAccountDelegations(
    organization,
    exchange,
    account,
    count = 10,
    offset = 0,
    search = '',
  ) {
    return this.services.OvhHttp.get(
      `/sws/exchange/${organization}/${exchange}/sharedAccounts/${account}/delegations`,
      {
        rootPath: '2api',
        params: {
          count,
          offset,
          search,
        },
      },
    );
  }

  updatingSharedAccountDelegations(organization, exchange, model) {
    return this.services.OvhHttp.put(
      `/sws/exchange/${organization}/${exchange}/sharedAccounts/${model.primaryEmail}/delegations-update`,
      {
        rootPath: '2api',
        data: {
          sendRights: model.sendRights,
          fullAccessRights: model.fullAccessRights,
          sendOnBehalfRights: model.sendOnBehalfToRights,
        },
      },
    ).then((response) => {
      this.services.wucExchange.resetSharedAccounts();
      this.services.wucExchange.resetTasks();

      return response;
    });
  }

  retrievingQuota(organization, exchange) {
    return this.services.OvhHttp.get(
      `/email/exchange/${organization}/service/${exchange}/sharedAccountQuota`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  prepareForCsv(organization, serviceName, opts, offset) {
    return this.retrievingSharedAccounts(
      organization,
      serviceName,
      opts.count,
      offset,
      opts.filter,
    ).then((accounts) => ({
      accounts: accounts.list.results,
      headers: keys(accounts.list.results[0]),
    }));
  }

  formatQuota({ value, unit }) {
    const quota = filesize(
      this.services.WucConverterService.convertToOctet(value, unit, 'binary'),
      {
        output: 'object',
        standard: 'iec',
        round: 2,
      },
    );

    return { value: quota.value, unit: quota.symbol };
  }

  getFormattedQuota(quota) {
    const { value, unit } = this.formatQuota(quota);
    return `${value} ${this.services.$translate.instant(`unit_size_${unit}`)}`;
  }

  getQuotaUnitRange(minQuotaUnit, maxQuotaUnit) {
    return this.services.WucConverterService.getUnitRange(
      minQuotaUnit,
      maxQuotaUnit,
      'binary',
    ).map(({ unit }) => unit);
  }

  convertQuota(value, currentUnit, wantedUnit) {
    const exponent = findIndex(this.services.WucConverterFactory.binary.units, {
      unit: wantedUnit,
    });
    return filesize(
      this.services.WucConverterService.convertToOctet(
        value,
        currentUnit,
        'binary',
      ),
      {
        output: 'object',
        standard: 'iec',
        round: 2,
        exponent,
      },
    ).value;
  }
}
