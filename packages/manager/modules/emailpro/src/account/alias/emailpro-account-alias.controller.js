import set from 'lodash/set';

export default class {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, EmailPro, goToAccounts) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.EmailPro = EmailPro;
    this.goToAccounts = goToAccounts;

    this.$scope.aliasMaxLimit = this.EmailPro.aliasMaxLimit;
    this.$scope.getAliasesParams = {
      pageSize: null,
      offset: null,
    };
  }

  $onInit() {
    this.$scope.$on(this.EmailPro.events.accountsChanged, () =>
      this.$scope.refreshList(),
    );

    this.$scope.getAliases = ({ pageSize, offset }) => {
      this.$scope.getAliasesParams.pageSize = pageSize;
      this.$scope.getAliasesParams.offset = offset;
      if (this.$stateParams.emailAddress) {
        return this.EmailPro.getAliases(
          this.$stateParams.productId,
          this.$stateParams.emailAddress,
          pageSize,
          offset - 1,
        )
          .then((data) => {
            this.$scope.aliases = data.list.results;
            return {
              data: data.list.results,
              meta: {
                totalCount: data.count,
              },
            };
          })
          .catch((failure) => {
            set(failure, 'data.type', failure.data.type || 'ERROR');
            this.$scope.setMessage(
              this.$translate.instant('emailpro_tab_ALIAS_error_message'),
              failure.data,
            );
          });
      }

      return this.goToAccounts();
    };

    this.$scope.refreshList = () => {
      this.EmailPro.getAliases(
        this.$stateParams.productId,
        this.$scope.selectedAccount.primaryEmailAddress,
        this.$scope.getAliasesParams.pageSize,
        this.$scope.getAliasesParams.offset - 1,
      )
        .then((data) => {
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
        .catch((failure) => {
          set(failure, 'data.type', failure.data.type || 'ERROR');
          this.$scope.setMessage(
            this.$translate.instant('emailpro_tab_ALIAS_error_message'),
            failure.data,
          );
        });
    };

    this.$scope.hideAliases = () => {
      this.goToAccounts();
    };

    this.$scope.deleteAlias = (alias) => {
      if (!alias.taskPendingId) {
        this.$scope.setAction(
          'emailpro/account/alias/remove/emailpro-account-alias-remove',
          {
            account: this.$scope.selectedAccount,
            alias,
          },
        );
      }
    };

    this.$scope.addAccountAlias = () => {
      if (
        this.$scope.selectedAccount &&
        this.$scope.selectedAccount.aliases <= this.$scope.aliasMaxLimit
      ) {
        this.$scope.setAction(
          'emailpro/account/alias/add/emailpro-account-alias-add',
          this.$scope.selectedAccount,
        );
      }
    };

    this.$scope.getAddAliasTooltip = () => {
      if (
        this.$scope.selectedAccount &&
        this.$scope.selectedAccount.aliases >= this.$scope.aliasMaxLimit
      ) {
        return this.$translate.instant(
          'emailpro_tab_ALIAS_add_alias_limit_tooltip',
        );
      }
      return null;
    };
  }
}
