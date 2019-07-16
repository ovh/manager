/**
 * Account alias
 */
angular.module('Module.emailpro.controllers').controller('EmailProTabAliasCtrl', ($scope, $stateParams, $translate, EmailPro) => {
  $scope.aliasMaxLimit = EmailPro.aliasMaxLimit;
  $scope.getAliasesParams = {
    pageSize: null,
    offset: null,
  };

  $scope.$on(EmailPro.events.accountsChanged, () => $scope.refreshList());

  $scope.getAliases = function ({ pageSize, offset }) {
    $scope.getAliasesParams.pageSize = pageSize;
    $scope.getAliasesParams.offset = offset;
    if ($scope.selectedAccount) {
      return EmailPro
        .getAliases(
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
          _.set(failure, 'data.type', failure.data.type || 'ERROR');
          $scope.setMessage($translate.instant('emailpro_tab_ALIAS_error_message'), failure.data);
        });
    }
    return null;
  };

  $scope.refreshList = function () {
    EmailPro
      .getAliases(
        $stateParams.productId,
        $scope.selectedAccount.primaryEmailAddress,
        $scope.getAliasesParams.pageSize,
        $scope.getAliasesParams.offset - 1,
      )
      .then((data) => {
        for (let i = 0; i < data.list.results.length; i += 1) {
          this.aliases.splice(i, 1, data.list.results[i]);
        }
        for (let i = data.list.results.length; i < this.aliases.length; i += 1) {
          this.aliases.splice(i, 1);
        }
      })
      .catch((failure) => {
        _.set(failure, 'data.type', failure.data.type || 'ERROR');
        $scope.setMessage($translate.instant('emailpro_tab_ALIAS_error_message'), failure.data);
      });
  };

  $scope.hideAliases = function () {
    $scope.$emit('showAccounts');
  };

  $scope.deleteAlias = function (alias) {
    if (!alias.taskPendingId) {
      $scope.setAction('emailpro/account/alias/remove/emailpro-account-alias-remove', {
        account: $scope.selectedAccount,
        alias,
      });
    }
  };

  $scope.addAccountAlias = function () {
    if ($scope.selectedAccount && $scope.selectedAccount.aliases <= $scope.aliasMaxLimit) {
      $scope.setAction('emailpro/account/alias/add/emailpro-account-alias-add', $scope.selectedAccount);
    }
  };

  $scope.getAddAliasTooltip = function () {
    if ($scope.selectedAccount && $scope.selectedAccount.aliases >= $scope.aliasMaxLimit) {
      return $translate.instant('emailpro_tab_ALIAS_add_alias_limit_tooltip');
    }
    return null;
  };
});

angular.module('Module.emailpro.controllers').controller('EmailProAddAccountAliasCtrl', ($scope, $stateParams, $translate, EmailPro) => {
  $scope.selectedAccount = $scope.currentActionData;

  $scope.data = null;
  $scope.model = {};

  $scope.loadDomainData = function () {
    EmailPro.getNewAliasOptions($stateParams.productId, $scope.selectedAccount.primaryEmailAddress, 'ACCOUNT')
      .then((data) => {
        if (data.availableDomains.length === 0) {
          $scope.setMessage($translate.instant('emailpro_tab_ALIAS_add_no_domains'), { status: 'success' });
          $scope.resetAction();
        } else {
          $scope.availableDomains = data.availableDomains;
          $scope.takenEmails = data.takenEmails;
          $scope.model.domain = _.first($scope.availableDomains);
        }
      }, (failure) => {
        _.set(failure, 'data.type', failure.data.type || 'ERROR');
        $scope.setMessage($translate.instant('emailpro_tab_ALIAS_domain_loading_failure'), failure.data);
        $scope.resetAction();
      });
  };

  $scope.checkTakenEmails = function () {
    $scope.takenEmailError = false;
    if ($scope.takenEmails
           && $scope.model.alias
           && $scope.takenEmails.indexOf(`${$scope.model.alias.toLowerCase()}@${$scope.model.domain.name}`) >= 0) {
      $scope.takenEmailError = true;
    }
  };

  $scope.addAccountAlias = function () {
    $scope.resetAction();
    EmailPro
      .addAlias($stateParams.productId, $scope.selectedAccount.primaryEmailAddress, $scope.model)
      .then((data) => {
        $scope.setMessage($translate.instant('emailpro_tab_ALIAS_add_alias_success_message'), { status: 'success' });
        return data;
      })
      .catch((failure) => {
        _.set(failure, 'type', failure.type || 'ERROR');
        $scope.setMessage($translate.instant('emailpro_tab_ALIAS_add_alias_error_message'), failure);
      });
  };

  $scope.aliasIsValid = function () {
    return $scope.model.alias
      && $scope.model.domain
      && $scope.model.alias.length <= 64
      && !$scope.takenEmailError;
  };
});

angular.module('Module.emailpro.controllers').controller('EmailProRemoveAliasCtrl', ($scope, $stateParams, $translate, EmailPro) => {
  $scope.account = $scope.currentActionData.account;
  $scope.alias = $scope.currentActionData.alias;

  $scope.submit = function () {
    $scope.resetAction();

    EmailPro
      .deleteAlias($stateParams.productId, $scope.account.primaryEmailAddress, $scope.alias.alias)
      .then((data) => {
        $scope.setMessage($translate.instant('emailpro_tab_ALIAS_delete_success_message'), { status: 'success' });
        return data;
      })
      .catch((failure) => {
        _.set(failure, 'type', failure.type || 'ERROR');
        $scope.setMessage($translate.instant('emailpro_tab_ALIAS_delete_error_message'), failure);
      });
  };
});

/**
 * Group alias
 */
angular.module('Module.emailpro.controllers').controller('EmailProTabGroupAliasCtrl', ($scope, $stateParams, $translate, EmailPro) => {
  $scope.aliasMaxLimit = EmailPro.aliasMaxLimit;

  $scope.$on(EmailPro.events.groupsChanged, () => {
    $scope.$broadcast('paginationServerSide.reload', 'groupAliasTable');
  });

  $scope.getAliases = function (count, offset) {
    if ($scope.selectedGroup) {
      $scope.aliasLoading = true;
      EmailPro
        .getGroupAliasList(
          $stateParams.productId,
          $scope.selectedGroup.mailingListAddress,
          count,
          offset,
        )
        .then((data) => {
          $scope.aliasLoading = false;
          $scope.aliases = data;
        })
        .catch((failure) => {
          $scope.aliasLoading = false;
          _.set(failure, 'type', failure.type || 'ERROR');
          $scope.setMessage($translate.instant('emailpro_tab_ALIAS_error_message'), failure);
        });
    }
  };

  $scope.hideAliases = function () {
    $scope.$emit('showGroups');
  };

  $scope.deleteGroupAlias = function (alias) {
    if (!alias.taskPendingId) {
      $scope.setAction('emailpro/group/alias/remove/group-alias-remove', {
        selectedGroup: $scope.selectedGroup,
        alias,
      });
    }
  };

  $scope.addGroupAlias = function () {
    if ($scope.selectedGroup
      && $scope.selectedGroup.aliases <= $scope.aliasMaxLimit
      && $scope.selectedGroup.state === $scope.stateOk) {
      $scope.setAction('emailpro/group/alias/add/group-alias-add', $scope.selectedGroup);
    }
  };

  $scope.getAddAliasTooltip = function () {
    if ($scope.selectedGroup && $scope.selectedGroup.aliases >= $scope.aliasMaxLimit) {
      return $translate.instant('emailpro_tab_ALIAS_add_alias_limit_tooltip');
    }
    return null;
  };
});

angular.module('Module.emailpro.controllers').controller('EmailProAddGroupAliasCtrl', ($scope, $stateParams, $translate, EmailPro) => {
  $scope.selectedMailingList = $scope.currentActionData;

  $scope.availableDomains = null;
  $scope.model = {};

  $scope.loadDomainData = function () {
    EmailPro.getNewAliasOptions($scope.selectedMailingList.mailingListName, 'MAILING_LIST')
      .then((data) => {
        if (data.availableDomains.length === 0) {
          $scope.setMessage($translate.instant('emailpro_tab_ALIAS_add_no_domains'), { status: 'success' });
          $scope.resetAction();
        } else {
          $scope.availableDomains = data.availableDomains;
          $scope.takenEmails = data.takenEmails;
          $scope.model.domain = _.first(data.availableDomains);
        }
      }, (failure) => {
        _.set(failure, 'data.type', failure.data.type || 'ERROR');
        $scope.setMessage($translate.instant('emailpro_tab_ALIAS_domain_loading_failure'), failure.data);
        $scope.resetAction();
      });
  };

  $scope.checkTakenEmails = function () {
    $scope.takenEmailError = false;
    if ($scope.takenEmails
           && $scope.model.alias
           && $scope.takenEmails.indexOf(`${$scope.model.alias}@${$scope.model.domain.name}`) >= 0) {
      $scope.takenEmailError = true;
    }
  };

  $scope.addGroupAlias = function () {
    $scope.resetAction();
    EmailPro
      .addGroupAlias(
        $stateParams.productId,
        $scope.selectedMailingList.mailingListName,
        $scope.model,
      )
      .then(() => {
        $scope.setMessage($translate.instant('emailpro_tab_ALIAS_add_alias_success_message'), { status: 'success' });
      })
      .catch((failure) => {
        _.set(failure, 'data.type', failure.data.type || 'ERROR');
        $scope.setMessage($translate.instant('emailpro_tab_ALIAS_add_alias_error_message'), failure.data);
      });
  };

  $scope.aliasIsValid = function () {
    return $scope.model.alias
      && $scope.model.domain
      && $scope.model.alias.length <= 64
      && !$scope.takenEmailError;
  };
});

angular.module('Module.emailpro.controllers').controller('EmailProRemoveGroupAliasCtrl', ($scope, $stateParams, $translate, EmailPro) => {
  $scope.selectedGroup = $scope.currentActionData.selectedGroup;
  $scope.alias = $scope.currentActionData.alias;

  $scope.submit = function () {
    $scope.resetAction();

    EmailPro
      .deleteGroupAlias(
        $stateParams.productId,
        $scope.selectedGroup.mailingListAddress,
        $scope.alias.alias,
      )
      .then(() => {
        $scope.setMessage($translate.instant('emailpro_tab_ALIAS_delete_success_message'), { status: 'success' });
      })
      .catch((failure) => {
        _.set(failure, 'data.type', failure.data.type || 'ERROR');
        $scope.setMessage($translate.instant('emailpro_tab_ALIAS_delete_error_message'), failure.data);
      });
  };
});
