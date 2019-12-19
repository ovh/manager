import isObject from 'lodash/isObject';
import map from 'lodash/map';
import set from 'lodash/set';

import config from '../../config/config';

angular.module('App').controller('DedicatedCloudSecurityOptionsCtrl', ($q, $stateParams, $scope, $translate, Alerter, DedicatedCloud, User, Poller, DEDICATED_CLOUD_CONSTANTS) => {
  $scope.loading = true;

  $scope.requiredOptionNames = ['nsx', 'vrops'];

  $scope.optionNames = DEDICATED_CLOUD_CONSTANTS.securityOptions;

  $scope.options = {};

  $scope.pccCompliancies = {
    nsx: false,
    vrops: false,
  };

  $scope.allDisabled = function allDisabled() {
    return !map($scope.options).some((item) => item.state === 'enabled');
  };

  $scope.anyEnabling = function anyEnabling() {
    return map($scope.options).some((item) => item.state === 'enabling');
  };

  $scope.nsxAndVropsCompliantPcc = function nsxAndVropsCompliantPcc() {
    return !map($scope.pccCompliancies).some((compliant) => !compliant);
  };

  function getGuide() {
    User.getUser().then((user) => {
      $scope.guides = {};
      $scope.optionNames.forEach((optionName) => {
        set(
          $scope.guides,
          optionName,
          config.constants.URLS[user.ovhSubsidiary].guides[optionName]
            || config.constants.URLS[user.ovhSubsidiary].presentations.home
            || config.constants.URLS.FR.presentations.home,
        );
      });
    });
  }

  function checkOptionCompliance(optionName) {
    return DedicatedCloud.getOptionState(optionName, $stateParams.productId)
      .then((state) => {
        if (state !== 'disabled') {
          return true;
        }
        return DedicatedCloud.isOptionToggable($stateParams.productId, optionName, 'disabled', true);
      })
      .then((response) => {
        if (isObject(response)) {
          return response.toggable;
        }
        return response;
      });
  }

  function init() {
    getGuide();

    function loadOptionsStates() {
      return $q.all(
        $scope.optionNames.map((optionName) => DedicatedCloud
          .getOptionState(optionName, $stateParams.productId)
          .then((state) => {
            $scope.options[optionName] = {
              state,
            };
            return state;
          })),
      );
    }

    // If NSX or vROps can't be enabled for this PCC,
    // then none of these options can be enabled.
    function loadVropsAndNsxCompatibility() {
      return $q
        .all({
          nsx: checkOptionCompliance('nsx'),
          vrops: checkOptionCompliance('vrops'),
        })
        .then((compliancies) => {
          angular.extend($scope.pccCompliancies, compliancies);
        });
    }

    return $q
      .all([loadOptionsStates(), loadVropsAndNsxCompatibility()])
      .catch((err) => {
        Alerter.alertFromSWS($translate.instant('dedicatedCloud_dashboard_loading_error'), err);
      })
      .finally(() => {
        $scope.loading = false;
      });
  }

  init();

  function pollTask(taskId) {
    return DedicatedCloud.getSelected($stateParams.productId).then((pcc) => Poller.poll(`apiv6/dedicatedCloud/${pcc.name}/task/${taskId}`, null, {
      successRule(task) {
        return task.state === 'done';
      },
      errorRule(task) {
        return ['doing', 'todo', 'done', 'waitingForChilds'].indexOf(task.state) === -1;
      },
      namespace: 'dedicatedCloud.options.disable',
    }));
  }

  $scope.$on('option-enable', (event, params) => {
    $scope.options[params.optionName].state = 'enabling';
    pollTask(params.taskId).then(() => {
      $scope.options[params.optionName].state = 'enabled';
    });
  });
});
