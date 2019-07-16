angular.module('Module.emailpro.controllers')
  .controller('EmailProDisclaimerCtrl', ($scope, $stateParams, $translate, EmailPro) => {
    function hasEmptySlot(list) {
      let result = false;
      angular.forEach(list,
        (value) => {
          if (value.emptySlotFlag) {
            result = true;
          }
        });
      return result;
    }
    function hasFullSlot(list) {
      let result = false;
      angular.forEach(list,
        (value) => {
          if (!value.emptySlotFlag) {
            result = true;
          }
        });
      return result;
    }

    $scope.disclaimersList = null;
    $scope.loadParams = {};

    $scope.refreshList = function () {
      EmailPro
        .getDisclaimers(
          $stateParams.productId,
          $scope.loadParams.pageSize,
          $scope.loadParams.offset - 1,
        )
        .then((data) => {
          for (let i = 0; i < data.list.results.length; i += 1) {
            $scope.disclaimersList.list.results.splice(i, 1, data.list.results[i]);
          }
          for (let i = data.list.results.length;
            i < $scope.disclaimersList.list.results.length; i += 1) {
            $scope.disclaimersList.list.results.splice(i, 1);
          }
        })
        .catch((data) => {
          $scope.setMessage($translate.instant('emailpro_tab_DISCLAIMER_error_message'), data.data);
        });
    };

    $scope.loadPaginated = function ({ pageSize, offset }) {
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
        }).catch((data) => {
          $scope.setMessage($translate.instant('emailpro_tab_DISCLAIMER_error_message'), data.data);
        });
    };

    $scope.updateDisclaimer = function (disclaimer) {
      $scope.setAction('emailpro/disclaimer/update/emailpro-disclaimer-update', disclaimer);
    };

    $scope.deleteDisclaimer = function (disclaimer) {
      $scope.setAction('emailpro/disclaimer/remove/emailpro-disclaimer-remove', disclaimer);
    };

    $scope.setMessagesFlags = function (disclaimersList) {
      $scope.addDomainMessageFlag = false;
      $scope.noDisclaimerMessageFlag = false;

      if (disclaimersList.list.results.length === 0
        || (!hasEmptySlot(disclaimersList.list.results)
          && !hasFullSlot(disclaimersList.list.results))) {
        $scope.addDomainMessageFlag = true;
      } else if (hasEmptySlot(disclaimersList.list.results)
        && !hasFullSlot(disclaimersList.list.results)) {
        $scope.noDisclaimerMessageFlag = true;
      }
    };

    $scope.$on(EmailPro.events.disclaimersChanged, () => {
      $scope.refreshList();
    });

    $scope.newDisclaimersDisabled = function () {
      let result = false;
      if ($scope.disclaimersList) {
        result = hasEmptySlot($scope.disclaimersList.list.results);
      }
      return !result;
    };

    $scope.addDisclaimer = function (disclaimer) {
      if (!$scope.newDisclaimersDisabled()) {
        $scope.setAction('emailpro/disclaimer/add/emailpro-disclaimer-add', disclaimer);
      }
    };

    $scope.$on(EmailPro.events.disclaimersChanged, () => {
      $scope.$broadcast('paginationServerSide.reload', 'disclaimersTable');
    });
  });

angular.module('Module.emailpro.controllers')
  .controller('EmailProAddDisclaimerCtrl', ($scope, $stateParams, $translate, EmailPro, navigation) => {
    $scope.data = {
      content: '',
      outsideOnly: false,
      selectedVariable: 'Name',
    };

    $scope.insertVariable = function () {
      this.data.content += `%%${this.data.selectedAttribute}%%`;
    };

    $scope.loadAvailableDomains = function () {
      $scope.loadingData = true;

      return EmailPro.getNewDisclaimerOptions($stateParams.productId).then((data) => {
        $scope.loadingData = false;
        if (data.availableDomains) {
          $scope.availableDomains = data.availableDomains;
          $scope.selectCurrentDomain();

          $scope.data.selectedAttribute = _.first(data.availableAttributes);
          $scope.availableAttributes = data.availableAttributes;
        } else {
          $scope.resetAction();
          $scope.setMessage($translate.instant('emailpro_ACTION_add_disclaimer_no_domains'));
        }
        return $scope.data;
      });
    };

    $scope.selectCurrentDomain = function () {
      if (_.get(navigation, 'currentActionData.domain.name')) {
        $scope.data.completeDomain = _.find($scope.availableDomains, 'name', navigation.currentActionData.domain.name);
      }
      if (!$scope.data.completeDomain) {
        $scope.data.completeDomain = _.first($scope.availableDomains);
      }
    };

    $scope.loadAvailableDomains();

    $scope.saveDisclaimer = function () {
      const model = {
        domain: $scope.data.completeDomain.name,
        externalEmailsOnly: $scope.data.outsideOnly,
        content: $scope.data.content,
      };

      $scope.setMessage($translate.instant('emailpro_dashboard_action_doing'), { status: 'success' });
      EmailPro.saveDisclaimer($stateParams.productId, model).then(() => {
        $scope.setMessage($translate.instant('emailpro_ACTION_add_disclaimer_success_message'), { status: 'success' });
      }, (failure) => {
        $scope.setMessage($translate.instant('emailpro_ACTION_add_disclaimer_error_message'), failure.data);
      });
      $scope.resetAction();
    };
  });

angular.module('Module.emailpro.controllers')
  .controller('EmailProUpdateDisclaimerCtrl', ($scope, $stateParams, $translate, EmailPro) => {
    function loadOptions() {
      $scope.loadingData = true;
      return EmailPro.getUpdateDisclaimerOptions().then((data) => {
        $scope.availableAttributes = data.availableAttributes;
        if (data.availableAttributes) {
          $scope.data.selectedAttribute = _.first(data.availableAttributes);
        }
        return $scope.data;
      }).then((data) => {
        $scope.loadingData = false;
        return data;
      });
    }

    $scope.data = angular.copy($scope.currentActionData);

    loadOptions();

    $scope.getCompleteDomain = function (domainName) {
      let result;
      angular.forEach($scope.availableDomains, (value) => {
        if (value.name === domainName) {
          result = value;
        }
      });
      return result;
    };

    /**
     * Insert attributes at text field current cursor position
     */
    $scope.insertAttribute = function () {
      $scope.data.content += `%%${$scope.data.selectedAttribute}%%`;
    };

    $scope.saveDisclaimer = function () {
      const model = {
        domain: $scope.data.domain.name,
        externalEmailsOnly: $scope.data.outsideOnly,
        content: $scope.data.content,
      };

      $scope.setMessage($translate.instant('emailpro_dashboard_action_doing'));
      EmailPro.updateDisclaimer($stateParams.productId, model).then(() => {
        $scope.setMessage($translate.instant('emailpro_ACTION_update_disclaimer_success_message'), { status: 'success' });
      }, (failure) => {
        $scope.setMessage($translate.instant('emailpro_ACTION_update_disclaimer_error_message'), failure.data);
      });
      $scope.resetAction();
    };
  });

angular.module('Module.emailpro.controllers')
  .controller('EmailProRemoveDisclaimerCtrl', ($scope, $stateParams, $translate, EmailPro) => {
    $scope.disclaimer = $scope.currentActionData;
    $scope.submit = function () {
      $scope.setMessage($translate.instant('emailpro_dashboard_action_doing'), { status: 'success' });
      EmailPro.deleteDisclaimer($stateParams.productId, $scope.disclaimer.domain.name)
        .then(() => {
          $scope.setMessage($translate.instant('emailpro_ACTION_delete_disclaimer_success'), { status: 'success' });
        }, (failure) => {
          $scope.setMessage($translate.instant('emailpro_ACTION_delete_disclaimer_failure'), failure.data);
        });
      $scope.resetAction();
    };
  });
