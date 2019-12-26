import set from 'lodash/set';

export default /* @ngInject */ ($scope, $stateParams, $translate, EmailPro) => {
  $scope.selectedGroup = $scope.currentActionData.selectedGroup;
  $scope.alias = $scope.currentActionData.alias;

  $scope.submit = function submit() {
    $scope.resetAction();

    EmailPro.deleteGroupAlias(
      $stateParams.productId,
      $scope.selectedGroup.mailingListAddress,
      $scope.alias.alias,
    )
      .then(() => {
        $scope.setMessage(
          $translate.instant('emailpro_tab_ALIAS_delete_success_message'),
          { status: 'success' },
        );
      })
      .catch((failure) => {
        set(failure, 'data.type', failure.data.type || 'ERROR');
        $scope.setMessage(
          $translate.instant('emailpro_tab_ALIAS_delete_error_message'),
          failure.data,
        );
      });
  };
};
