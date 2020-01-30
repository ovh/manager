import set from 'lodash/set';

export default /* @ngInject */ ($scope, $stateParams, $translate, EmailPro) => {
  $scope.aliasMaxLimit = EmailPro.aliasMaxLimit;

  $scope.$on(EmailPro.events.groupsChanged, () => {
    $scope.$broadcast('paginationServerSide.reload', 'groupAliasTable');
  });

  $scope.getAliases = function getAliases(count, offset) {
    if ($scope.selectedGroup) {
      $scope.aliasLoading = true;
      EmailPro.getGroupAliasList(
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
          set(failure, 'type', failure.type || 'ERROR');
          $scope.setMessage(
            $translate.instant('emailpro_tab_ALIAS_error_message'),
            failure,
          );
        });
    }
  };

  $scope.hideAliases = function hideAliases() {
    $scope.$emit('showGroups');
  };

  $scope.deleteGroupAlias = function deleteGroupAlias(alias) {
    if (!alias.taskPendingId) {
      $scope.setAction('emailpro/group/alias/remove/group-alias-remove', {
        selectedGroup: $scope.selectedGroup,
        alias,
      });
    }
  };

  $scope.addGroupAlias = function addGroupAlias() {
    if (
      $scope.selectedGroup &&
      $scope.selectedGroup.aliases <= $scope.aliasMaxLimit &&
      $scope.selectedGroup.state === $scope.stateOk
    ) {
      $scope.setAction(
        'emailpro/group/alias/add/group-alias-add',
        $scope.selectedGroup,
      );
    }
  };

  $scope.getAddAliasTooltip = function getAddAliasTooltip() {
    if (
      $scope.selectedGroup &&
      $scope.selectedGroup.aliases >= $scope.aliasMaxLimit
    ) {
      return $translate.instant('emailpro_tab_ALIAS_add_alias_limit_tooltip');
    }
    return null;
  };
};
