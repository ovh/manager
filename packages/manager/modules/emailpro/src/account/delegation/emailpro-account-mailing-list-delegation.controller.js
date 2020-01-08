import angular from 'angular';
import set from 'lodash/set';

export default /* @ngInject */ (
  $scope,
  $stateParams,
  EmailPro,
  $timeout,
  $translate,
) => {
  const init = function init() {
    $scope.selectedGroup = $scope.currentActionData;
    $scope.form = { search: null };
  };

  const recordChangeOperations = function recordChangeOperations(
    account,
    changesList,
  ) {
    // record the operation to be done for sendAs rights:
    if (account.newSendAsValue !== account.sendAs) {
      changesList.sendRights.push({
        id: account.id,
        operation: account.newSendAsValue === true ? 'POST' : 'DELETE',
      });
    }

    // records the operation for sendOnBehalfTo rights:
    if (account.newSendOnBehalfToValue !== account.sendOnBehalfTo) {
      changesList.sendOnBehalfToRights.push({
        id: account.id,
        operation: account.newSendOnBehalfToValue === true ? 'POST' : 'DELETE',
      });
    }
    return changesList;
  };

  // Return an array containing changes compared to original configuration
  const getChanges = function getChanges() {
    const changesList = {
      account: $scope.selectedGroup.mailingListName,
      sendRights: [],
      sendOnBehalfToRights: [],
    };
    if ($scope.delegationList) {
      angular.forEach($scope.delegationList.list.results, (account) => {
        recordChangeOperations(account, changesList);
      });
    }
    return changesList;
  };

  // Check if there are changes compared to original configuration
  $scope.hasChanged = function hasChanged() {
    const changesList = getChanges();
    if (changesList) {
      return (
        changesList.sendRights.length > 0 ||
        changesList.sendOnBehalfToRights.length > 0
      );
    }
    return false;
  };

  $scope.getDelegationRight = function getDelegationRight(count, offset) {
    $scope.setMessage(null);
    $scope.loading = true;

    EmailPro.getMailingListDelegationRights(
      $stateParams.productId,
      $scope.selectedGroup.mailingListName,
      count,
      offset,
      $scope.form.search,
    )
      .then((accounts) => {
        $scope.loading = false;

        // make a deep copy of accounts list to use it as model
        $scope.delegationList = angular.copy(accounts);

        // keep the original value to have a reference to compare changes
        angular.forEach($scope.delegationList.list.results, (account) => {
          set(account, 'newSendAsValue', account.sendAs);
          set(account, 'newSendOnBehalfToValue', account.sendOnBehalfTo);
        });
      })
      .catch((failure) => {
        $scope.loading = false;
        $scope.setMessage(
          $translate.instant('emailpro_tab_GROUPS_error_message'),
          failure.data,
        );
      });
  };

  $scope.$on(EmailPro.events.accountsChanged, () => {
    $scope.$broadcast('paginationServerSide.reload', 'delegationTable');
  });

  $scope.$watch(
    'form.search',
    (search) => {
      if ($scope.form.search !== null) {
        $timeout(() => {
          if ($scope.form.search === search) {
            $scope.$broadcast(
              'paginationServerSide.loadPage',
              1,
              'delegationTable',
            );
          }
        }, 1500);
      }
    },
    true,
  );

  $scope.updateDelegationRight = function updateDelegationRight() {
    $scope.resetAction();
    $scope.setMessage(
      $translate.instant('emailpro_GROUPS_delegation_doing_message'),
    );

    EmailPro.updateMailingListDelegationRights(
      $stateParams.productId,
      getChanges(),
    )
      .then((data) => {
        $scope.setMessage(
          $translate.instant('emailpro_GROUPS_delegation_success_message'),
          data,
        );
      })
      .catch((failure) => {
        $scope.setMessage(
          $translate.instant('emailpro_GROUPS_delegation_error_message'),
          failure.data,
        );
      });
  };

  init();
};
