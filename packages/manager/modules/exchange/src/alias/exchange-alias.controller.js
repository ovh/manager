import punycode from 'punycode';
import { ALIAS_TYPE_FOR_API_PATH } from './exchange-alias.constants';

export default class ExchangeAliasController {
  /* @ngInject */
  constructor(
    $scope,
    wucExchange,
    exchangeAccount,
    exchangeStates,
    navigation,
    messaging,
    $translate,
    ouiDatagridService,
  ) {
    this.$scope = $scope;

    this.wucExchange = wucExchange;
    this.exchangeAccount = exchangeAccount;
    this.exchangeStates = exchangeStates;
    this.navigation = navigation;
    this.messaging = messaging;
    this.$translate = $translate;
    this.ouiDatagridService = ouiDatagridService;
  }

  $onInit() {
    this.$routerParams = this.wucExchange.getParams();
    this.aliasesParams = {};
    this.aliasMaxLimit = this.wucExchange.aliasMaxLimit;

    this.$scope.$on(this.wucExchange.events.accountsChanged, () =>
      this.refreshDatagrid(),
    );
  }

  getAliases({ pageSize, offset }) {
    this.isLoading = true;
    const pageOffset = Math.ceil(offset / pageSize);
    return this.wucExchange
      .getAliases(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.$routerParams[this.aliasType],
        ALIAS_TYPE_FOR_API_PATH[this.aliasType],
        pageOffset,
        pageSize,
      )
      .then((aliases) => {
        this.aliases = aliases;
        this.isLoading = false;
        return aliases;
      })
      .catch((error) => {
        this.messaging.writeError(
          this.$translate.instant('exchange_tab_ALIAS_error_message'),
          error,
        );
        this.goBack();
      });
  }

  refreshDatagrid() {
    this.ouiDatagridService.refresh('aliasDatagrid', true);
  }

  openDeletingDialog({ alias }) {
    return this.goToAliasRemove(alias);
  }

  openAddingDialog() {
    return this.goToAliasAdd();
  }

  getAddAliasTooltip() {
    if (this.aliases?.length >= this.aliasMaxLimit) {
      return this.$translate.instant(
        'exchange_tab_ALIAS_add_alias_limit_tooltip',
        {
          t0: this.aliasMaxLimit,
        },
      );
    }

    return null;
  }

  static convertToPunycode(domain) {
    return punycode.toUnicode(domain);
  }
}
