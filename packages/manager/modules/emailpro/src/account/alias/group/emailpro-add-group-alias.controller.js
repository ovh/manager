import head from 'lodash/head';
import set from 'lodash/set';

export default /* @ngInject */ ($scope, $stateParams, $translate, EmailPro) => {
  $scope.selectedMailingList = $scope.currentActionData;

  $scope.availableDomains = null;
  $scope.model = {};

  $scope.loadDomainData = function loadDomainData() {
    EmailPro.getNewAliasOptions(
      $scope.selectedMailingList.mailingListName,
      'MAILING_LIST',
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
          $scope.model.domain = head(data.availableDomains);
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
        `${$scope.model.alias}@${$scope.model.domain.name}`,
      ) >= 0
    ) {
      $scope.takenEmailError = true;
    }
  };

  $scope.addGroupAlias = function addGroupAlias() {
    $scope.resetAction();
    EmailPro.addGroupAlias(
      $stateParams.productId,
      $scope.selectedMailingList.mailingListName,
      $scope.model,
    )
      .then(() => {
        $scope.setMessage(
          $translate.instant('emailpro_tab_ALIAS_add_alias_success_message'),
          { status: 'success' },
        );
      })
      .catch((failure) => {
        set(failure, 'data.type', failure.data.type || 'ERROR');
        $scope.setMessage(
          $translate.instant('emailpro_tab_ALIAS_add_alias_error_message'),
          failure.data,
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
