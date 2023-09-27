import angular from 'angular';

export default /* @ngInject */ ($scope, $stateParams, $translate, EmailPro) => {
  function hasEmptySlot(list) {
    let result = false;
    angular.forEach(list, (value) => {
      if (value.emptySlotFlag) {
        result = true;
      }
    });
    return result;
  }
  function hasFullSlot(list) {
    let result = false;
    angular.forEach(list, (value) => {
      if (!value.emptySlotFlag) {
        result = true;
      }
    });
    return result;
  }

  $scope.disclaimersList = null;
  $scope.loadParams = {};

  $scope.refreshList = function refreshList() {
    EmailPro.getDisclaimers(
      $stateParams.productId,
      $scope.loadParams.pageSize,
      $scope.loadParams.offset - 1,
    )
      .then((data) => {
        for (let i = 0; i < data.list.results.length; i += 1) {
          $scope.disclaimersList.list.results.splice(
            i,
            1,
            data.list.results[i],
          );
        }
        for (
          let i = data.list.results.length;
          i < $scope.disclaimersList.list.results.length;
          i += 1
        ) {
          $scope.disclaimersList.list.results.splice(i, 1);
        }
      })
      .catch((data) => {
        $scope.setMessage(
          $translate.instant('emailpro_tab_DISCLAIMER_error_message'),
          data.data,
        );
      });
  };

  $scope.loadPaginated = function loadPaginated({ pageSize, offset }) {
    $scope.loadParams.pageSize = pageSize;
    $scope.loadParams.offset = offset;
    return EmailPro.getDisclaimers($stateParams.productId, pageSize, offset - 1)
      .then((disclaimers) => {
        $scope.disclaimersList = disclaimers;
        return {
          data: disclaimers.list.results,
          meta: {
            totalCount: disclaimers.count,
          },
        };
      })
      .catch((data) => {
        $scope.setMessage(
          $translate.instant('emailpro_tab_DISCLAIMER_error_message'),
          data.data,
        );
      });
  };

  $scope.updateDisclaimer = function updateDisclaimer(disclaimer) {
    $scope.setAction(
      'emailpro/disclaimer/update/emailpro-disclaimer-update',
      disclaimer,
    );
  };

  $scope.deleteDisclaimer = function deleteDisclaimer(disclaimer) {
    $scope.setAction(
      'emailpro/disclaimer/remove/emailpro-disclaimer-remove',
      disclaimer,
    );
  };

  $scope.setMessagesFlags = function setMessagesFlags(disclaimersList) {
    $scope.addDomainMessageFlag = false;
    $scope.noDisclaimerMessageFlag = false;

    if (
      disclaimersList.list.results.length === 0 ||
      (!hasEmptySlot(disclaimersList.list.results) &&
        !hasFullSlot(disclaimersList.list.results))
    ) {
      $scope.addDomainMessageFlag = true;
    } else if (
      hasEmptySlot(disclaimersList.list.results) &&
      !hasFullSlot(disclaimersList.list.results)
    ) {
      $scope.noDisclaimerMessageFlag = true;
    }
  };

  $scope.$on(EmailPro.events.disclaimersChanged, () =>
    $scope.loadParams.pageSize && $scope.loadParams.offset
      ? $scope.refreshList()
      : null,
  );

  $scope.newDisclaimersDisabled = function newDisclaimersDisabled() {
    let result = false;
    if ($scope.disclaimersList) {
      result = hasEmptySlot($scope.disclaimersList.list.results);
    }
    return !result;
  };

  $scope.addDisclaimer = function addDisclaimer(disclaimer) {
    if (!$scope.newDisclaimersDisabled()) {
      $scope.setAction(
        'emailpro/disclaimer/add/emailpro-disclaimer-add',
        disclaimer,
      );
    }
  };

  $scope.$on(EmailPro.events.disclaimersChanged, () => {
    $scope.$broadcast('paginationServerSide.reload', 'disclaimersTable');
  });
};
