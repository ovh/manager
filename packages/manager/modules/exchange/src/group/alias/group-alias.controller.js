import has from 'lodash/has';

export default class ExchangeTabGroupAliasCtrl {
  /* @ngInject */
  constructor(
    $scope,
    Exchange,
    goToGroup,
    mailingList,
    navigation,
    messaging,
    $translate,
    exchangeStates,
  ) {
    this.services = {
      $scope,
      Exchange,
      navigation,
      messaging,
      $translate,
      exchangeStates,
    };

    this.$routerParams = Exchange.getParams();
    this.aliasMaxLimit = this.services.Exchange.aliasMaxLimit;
    this.aliasesParams = {};
    this.goToGroup = goToGroup;
    this.mailingList = mailingList;

    $scope.$on(this.services.Exchange.events.groupsChanged, () =>
      this.refreshList(),
    );
    $scope.getAliases = (pageSize, offset) => this.getAliases(pageSize, offset);
    $scope.getAliaseObjects = () => this.getAliaseObjects();
  }

  getAliases({ pageSize, offset }) {
    this.aliasesParams.pageSize = pageSize;
    this.aliasesParams.offset = offset;

    return this.services.Exchange.getGroupAliasList(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.mailingList.mailingListAddress,
      pageSize,
      offset - 1,
    )
      .then((data) => {
        this.aliases = data.list.results;
        this.aliasesParams.results = {
          data: data.list.results,
          meta: {
            totalCount: data.count,
          },
        };
        return this.aliasesParams.results;
      })
      .catch((err) =>
        this.services.messaging.writeError(
          this.services.$translate.instant('exchange_tab_ALIAS_error_message'),
          err,
        ),
      );
  }

  refreshList() {
    this.services.Exchange.getGroupAliasList(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.mailingList.mailingListAddress,
      this.aliasesParams.pageSize,
      this.aliasesParams.offset - 1,
    )
      .then((data) => {
        this.aliasesParams.results.meta.totalCount = data.count;
        for (let i = 0; i < data.list.results.length; i += 1) {
          this.aliases.splice(i, 1, data.list.results[i]);
        }
        for (
          let i = data.list.results.length;
          i < this.aliases.length;
          i += 1
        ) {
          this.aliases.splice(i, 1);
        }
      })
      .catch((err) =>
        this.services.messaging.writeError(
          this.services.$translate.instant('exchange_tab_ALIAS_error_message'),
          err,
        ),
      );
  }

  deleteGroupAlias(alias) {
    if (!alias.taskPendingId) {
      this.services.navigation.setAction(
        'exchange/group/alias/remove/group-alias-remove',
        {
          selectedGroup: this.mailingList,
          alias,
        },
      );
    }
  }

  addGroupAlias() {
    if (
      this.mailingList &&
      this.mailingList.aliases <= this.aliasMaxLimit &&
      this.services.exchangeStates.constructor.isOk(this.mailingList)
    ) {
      this.services.navigation.setAction(
        'exchange/group/alias/add/group-alias-add',
        this.mailingList,
      );
    }
  }

  getAddAliasTooltip() {
    if (
      has(this.mailingList, 'aliases') &&
      this.mailingList.aliases >= this.aliasMaxLimit
    ) {
      return this.services.$translate.instant(
        'exchange_tab_ALIAS_add_alias_limit_tooltip',
      );
    }

    return null;
  }

  getAliaseObjects() {
    return this.aliases;
  }
}
