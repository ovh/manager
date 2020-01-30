import set from 'lodash/set';

export default /* @ngInject */ ($scope, $stateParams, $translate, EmailPro) => {
  $scope.account = $scope.currentActionData.account;
  $scope.alias = $scope.currentActionData.alias;

  $scope.submit = function submit() {
    $scope.resetAction();

    EmailPro.deleteAlias(
      $stateParams.productId,
      $scope.account.primaryEmailAddress,
      $scope.alias.alias,
    )
      .then((data) => {
        $scope.setMessage(
          $translate.instant('emailpro_tab_ALIAS_delete_success_message'),
          { status: 'success' },
        );
        return data;
      })
      .catch((failure) => {
        set(failure, 'type', failure.type || 'ERROR');
        $scope.setMessage(
          $translate.instant('emailpro_tab_ALIAS_delete_error_message'),
          failure,
        );
      });
  };
};
