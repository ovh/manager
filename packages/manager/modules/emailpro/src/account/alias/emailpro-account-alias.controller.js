import set from 'lodash/set';

export default /* @ngInject */ ($scope, $stateParams, $translate, EmailPro) => {
  $scope.aliasMaxLimit = EmailPro.aliasMaxLimit;
  $scope.getAliasesParams = {
    pageSize: null,
    offset: null,
  };

  $scope.$on(EmailPro.events.accountsChanged, () => $scope.refreshList());

  $scope.getAliases = function getAliases({ pageSize, offset }) {
    $scope.getAliasesParams.pageSize = pageSize;
    $scope.getAliasesParams.offset = offset;
    if ($scope.selectedAccount) {
      return EmailPro.getAliases(
        $stateParams.productId,
        $scope.selectedAccount.primaryEmailAddress,
        pageSize,
        offset - 1,
      )
        .then((data) => {
          $scope.aliases = data.list.results;
          return {
            data: data.list.results,
            meta: {
              totalCount: data.count,
            },
          };
        })
        .catch((failure) => {
          set(failure, 'data.type', failure.data.type || 'ERROR');
          $scope.setMessage(
            $translate.instant('emailpro_tab_ALIAS_error_message'),
            failure.data,
          );
        });
    }
    return null;
  };

  $scope.refreshList = function refreshList() {
    EmailPro.getAliases(
      $stateParams.productId,
      $scope.selectedAccount.primaryEmailAddress,
      $scope.getAliasesParams.pageSize,
      $scope.getAliasesParams.offset - 1,
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
        $scope.setMessage(
          $translate.instant('emailpro_tab_ALIAS_error_message'),
          failure.data,
        );
      });
  };

  $scope.hideAliases = function hideAliases() {
    $scope.$emit('showAccounts');
  };

  $scope.deleteAlias = function deleteAlias(alias) {
    if (!alias.taskPendingId) {
      $scope.setAction(
        'emailpro/account/alias/remove/emailpro-account-alias-remove',
        {
          account: $scope.selectedAccount,
          alias,
        },
      );
    }
  };

  $scope.addAccountAlias = function addAccountAlias() {
    if (
      $scope.selectedAccount &&
      $scope.selectedAccount.aliases <= $scope.aliasMaxLimit
    ) {
      $scope.setAction(
        'emailpro/account/alias/add/emailpro-account-alias-add',
        $scope.selectedAccount,
      );
    }
  };

  $scope.getAddAliasTooltip = function getAddAliasTooltip() {
    if (
      $scope.selectedAccount &&
      $scope.selectedAccount.aliases >= $scope.aliasMaxLimit
    ) {
      return $translate.instant('emailpro_tab_ALIAS_add_alias_limit_tooltip');
    }
    return null;
  };
};
