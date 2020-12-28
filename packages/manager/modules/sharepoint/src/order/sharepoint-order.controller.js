import angular from 'angular';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import has from 'lodash/has';
import head from 'lodash/head';
import map from 'lodash/map';
import thru from 'lodash/thru';

export default class SharepointOrderCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $window,
    Exchange,
    MicrosoftSharepointLicenseService,
    ouiDatagridService,
    OvhApiMeVipStatus,
    User,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$window = $window;
    this.Exchange = Exchange;
    this.Sharepoint = MicrosoftSharepointLicenseService;
    this.ouiDatagridService = ouiDatagridService;
    this.OvhApiMeVipStatus = OvhApiMeVipStatus;
    this.User = User;
  }

  $onInit() {
    this.organizationId = this.$stateParams.organizationId;
    this.exchangeId = this.$stateParams.exchangeId;

    this.alerts = {
      main: 'sharepoint.alerts.main',
    };

    this.isReseller = false;
    this.associateExchange = false;
    this.associatedExchange = null;
    this.exchanges = null;
    this.accountsToAssociate = [];

    // Indicates that we are activating a SharePoint by coming from an exchange service.
    this.isComingFromAssociatedExchange = false;

    this.loaders = {
      init: true,
      accounts: true,
    };

    this.standAloneQuantity = 1;

    this.getExchanges()
      .then(() => this.User.getUser())
      .then(({ ovhSubsidiary }) => {
        this.userSubsidiary = ovhSubsidiary;
      })
      .then(() => this.checkReseller())
      .then((isReseller) => {
        this.isReseller = isReseller;

        // default mode for normal users is to associate
        if (
          (!isReseller || this.isComingFromAssociatedExchange) &&
          this.exchanges &&
          this.exchanges.length > 0
        ) {
          this.associateExchange = true;
        }
      })
      .finally(() => {
        this.loaders.init = false;
        this.associatedExchange =
          this.associatedExchange || head(this.exchanges);
        this.getAccounts();
      });
  }

  canAssociateExchange() {
    return this.exchanges && this.exchanges.length > 0;
  }

  canOrderProvider() {
    return this.isReseller && this.userSubsidiary === 'FR';
  }

  checkReseller() {
    return this.OvhApiMeVipStatus.v6()
      .get()
      .$promise.then((status) => get(status, 'web', false));
  }

  getExchanges() {
    return this.Sharepoint.getAllExchangeServices()
      .then((exchanges) =>
        map(exchanges, (exchange) => {
          const newExchange = angular.copy(exchange);
          newExchange.domain = newExchange.name;
          return newExchange;
        }),
      )
      .then((exchanges) => this.filterSupportedExchanges(exchanges))
      .then((exchanges) => {
        this.exchanges = exchanges;
        if (exchanges.length === 0) {
          this.associateExchange = false;
        }
        return exchanges;
      })
      .then((exchanges) =>
        this.selectAssociatedExchangeFromRouteParams(exchanges),
      );
  }

  filterSupportedExchanges(exchanges) {
    return thru(
      filter(
        filter(exchanges, (exchange) =>
          this.constructor.isSupportedExchangeType(exchange),
        ),
        (exchange) => this.isSupportedExchangeAdditionalCondition(exchange),
      ),
      (exchangesList) =>
        this.filterExchangesThatAlreadyHaveSharepoint(exchangesList),
    );
  }

  static isSupportedExchangeType(exchange) {
    return exchange.type === 'EXCHANGE_HOSTED';
  }

  isSupportedExchangeAdditionalCondition(exchange) {
    return this.Exchange.getExchangeServer(
      exchange.organization,
      exchange.name,
    ).then((server) => server.individual2010 === false);
  }

  filterExchangesThatAlreadyHaveSharepoint(exchanges) {
    return this.buildSharepointChecklist(exchanges).then((checklist) =>
      filter(exchanges, (exchange, index) => !checklist[index]),
    );
  }

  selectAssociatedExchangeFromRouteParams(exchanges) {
    this.associatedExchange = find(
      exchanges,
      (exchange) =>
        exchange.organization === this.organizationId &&
        exchange.name === this.exchangeId,
    );
    if (this.associatedExchange) {
      this.isComingFromAssociatedExchange = true;
    }
  }

  buildSharepointChecklist(exchanges) {
    return this.$q.all(
      map(exchanges, (exchange) => this.hasSharepoint(exchange)),
    );
  }

  hasSharepoint(exchange) {
    return this.Exchange.getSharepointServiceForExchange(exchange)
      .then(() => true)
      .catch(() => false);
  }

  getAccounts() {
    return this.Exchange.getAccountIds({
      organizationName: this.associatedExchange.organization,
      exchangeService: this.associatedExchange.domain,
    }).then((accountEmails) => ({
      data: map(accountEmails, (email) => ({ email })),
      meta: {
        totalCount: accountEmails.length,
      },
    }));
  }

  getAccount({ email }) {
    return this.Exchange.getAccount({
      organizationName: this.associatedExchange.organization,
      exchangeService: this.associatedExchange.domain,
      primaryEmailAddress: email,
    });
  }

  onAssociateChange(associateExchange) {
    if (!associateExchange) {
      // we need to reset selected accounts if we leave the association interface
      this.resetAccountsToAssociate();
    }
  }

  resetAccountsToAssociate() {
    this.accountsToAssociate = [];
  }

  refreshAccounts(exchange) {
    this.associatedExchange = exchange;
    this.resetAccountsToAssociate();
    this.ouiDatagridService.refresh('exchangeAccountsDatagrid', true);
  }

  onAccountsSelected(accounts) {
    this.accountsToAssociate = accounts.map(
      ({ primaryEmailAddress }) => primaryEmailAddress,
    );
  }

  hasSelectedAccounts() {
    return this.accountsToAssociate.length > 0;
  }

  getSharepointOrderUrl() {
    if (this.associateExchange) {
      if (
        has(this.associatedExchange, 'name') &&
        this.accountsToAssociate.length >= 1
      ) {
        return this.Sharepoint.getSharepointOrderUrl(
          this.associatedExchange.name,
          this.accountsToAssociate,
        );
      }
      return '';
    }

    const quantity = parseInt(this.standAloneQuantity, 10);
    if (quantity >= 1 && quantity <= 30) {
      return this.canOrderProvider()
        ? this.Sharepoint.getSharepointProviderOrderUrl(quantity)
        : this.Sharepoint.getSharepointStandaloneOrderUrl(quantity);
    }

    return '';
  }

  goToSharepointOrder() {
    const win = this.$window.open('', '_blank');
    win.opener = null;
    win.location = this.getSharepointOrderUrl();
  }
}
