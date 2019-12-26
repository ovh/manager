import head from 'lodash/head';
import set from 'lodash/set';

export default /* @ngInject */ ($scope, $stateParams, $translate, EmailPro) => {
  $scope.selectedAccount = $scope.currentActionData;

  $scope.data = null;
  $scope.model = {};

  $scope.loadDomainData = function loadDomainData() {
    EmailPro.getNewAliasOptions(
      $stateParams.productId,
      $scope.selectedAccount.primaryEmailAddress,
      'ACCOUNT',
    ).then(
      (data) => {
        if (data.availableDomains.length === 0) {
          $scope.setMessage(
            $translate.instant('emailpro_tab_ALIAS_add_no_domains'),
            { status: 'success' },
          );
          $scope.resetAction();
        } else {
          $scope.availableDomains = data.availableDomains;
          $scope.takenEmails = data.takenEmails;
          $scope.model.domain = head($scope.availableDomains);
        }
      },
      (failure) => {
        set(failure, 'data.type', failure.data.type || 'ERROR');
        $scope.setMessage(
          $translate.instant('emailpro_tab_ALIAS_domain_loading_failure'),
          failure.data,
        );
        $scope.resetAction();
      },
    );
  };

  $scope.checkTakenEmails = function checkTakenEmails() {
    $scope.takenEmailError = false;
    if (
      $scope.takenEmails &&
      $scope.model.alias &&
      $scope.takenEmails.indexOf(
        `${$scope.model.alias.toLowerCase()}@${$scope.model.domain.name}`,
      ) >= 0
    ) {
      $scope.takenEmailError = true;
    }
  };

  $scope.addAccountAlias = function addAccountAlias() {
    $scope.resetAction();
    EmailPro.addAlias(
      $stateParams.productId,
      $scope.selectedAccount.primaryEmailAddress,
      $scope.model,
    )
      .then((data) => {
        $scope.setMessage(
          $translate.instant('emailpro_tab_ALIAS_add_alias_success_message'),
          { status: 'success' },
        );
        return data;
      })
      .catch((failure) => {
        set(failure, 'type', failure.type || 'ERROR');
        $scope.setMessage(
          $translate.instant('emailpro_tab_ALIAS_add_alias_error_message'),
          failure,
        );
      });
  };

  $scope.aliasIsValid = function aliasIsValid() {
    return (
      $scope.model.alias &&
      $scope.model.domain &&
      $scope.model.alias.length <= 64 &&
      !$scope.takenEmailError
    );
  };
};
