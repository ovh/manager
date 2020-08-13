import get from 'lodash/get';

export default class ExchangeAccountAliasController {
  /* @ngInject */
  constructor(
    $scope,
    Exchange,
    exchangeAccount,
    exchangeStates,
    navigation,
    messaging,
    $translate,
  ) {
    this.$scope = $scope;

    this.Exchange = Exchange;
    this.exchangeAccount = exchangeAccount;
    this.exchangeStates = exchangeStates;
    this.navigation = navigation;
    this.messaging = messaging;
    this.$translate = $translate;
  }

  $onInit() {
    this.$routerParams = this.Exchange.getParams();
    this.aliasesParams = {};
    this.aliasMaxLimit = this.Exchange.aliasMaxLimit;

    this.$scope.$on(this.Exchange.events.accountsChanged, () =>
      this.refreshList(),
    );
  }

  getAliases({ pageSize, offset }) {
    this.aliasesParams.pageSize = pageSize;
    this.aliasesParams.offset = offset;

    return this.Exchange.getAliases(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.account.primaryEmailAddress,
      pageSize,
      offset - 1,
    )
      .then((aliases) => {
        this.aliases = aliases.list.results;

        return {
          data: this.aliases,
          meta: {
            totalCount: aliases.count,
          },
        };
      })
      .catch((error) => {
        this.messaging.writeError(
          this.$translate.instant('exchange_tab_ALIAS_error_message'),
          error,
        );
        this.hide();
      });
  }

  refreshList() {
    this.Exchange.getAliases(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.account.primaryEmailAddress,
      this.aliasesParams.pageSize,
      this.aliasesParams.offset - 1,
    )
      .then((aliases) => {
        for (let i = 0; i < aliases.list.results.length; i += 1) {
          this.aliases.splice(i, 1, aliases.list.results[i]);
        }

        for (
          let i = aliases.list.results.length;
          i < this.aliases.length;
          i += 1
        ) {
          this.aliases.splice(i, 1);
        }
      })
      .catch((error) => {
        this.messaging.writeError(
          this.$translate.instant('exchange_tab_ALIAS_error_message'),
          error,
        );
        this.hide();
      });
  }

  hide() {
    this.goToAccounts();
  }

  openDeletingDialog(alias) {
    this.navigation.setAction(
      'exchange/account/alias/remove/account-alias-remove',
      {
        account: this.account,
        alias,
      },
    );
  }

  openAddingDialog() {
    this.navigation.setAction(
      'exchange/account/alias/add/account-alias-add',
      this.account,
    );
  }

  getAddAliasTooltip() {
    if (get(this.aliases, 'length', 0) >= this.aliasMaxLimit) {
      return this.$translate.instant(
        'exchange_tab_ALIAS_add_alias_limit_tooltip',
        {
          t0: this.aliasMaxLimit,
        },
      );
    }

    return null;
  }
}
