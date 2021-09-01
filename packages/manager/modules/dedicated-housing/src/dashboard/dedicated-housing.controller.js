import assign from 'lodash/assign';

import { HOUSING_PHONE_SUPPORT } from '../housing.constants';
import { getConstants } from '../config/config';

export default /* @ngInject */ function HousingCtrl(
  $scope,
  $stateParams,
  $timeout,
  $translate,
  Alerter,
  backupLink,
  currentActiveLink,
  dashboardLink,
  name,
  Housing,
  ovhUserPref,
  taskLink,
  coreConfig,
) {
  $scope.loadingHousingInformations = true;
  $scope.loadingHousingError = false;
  $scope.housingPhoneStopBother = true;
  $scope.housingPhoneNumber = HOUSING_PHONE_SUPPORT;
  $scope.disable = {
    reboot: false,
  };

  $scope.housing = {
    name,
  };

  $scope.backupLink = backupLink;
  $scope.currentActiveLink = currentActiveLink;
  $scope.dashboardLink = dashboardLink;
  $scope.taskLink = taskLink;

  function checkIfStopBotherHousingPhone() {
    return ovhUserPref
      .getValue('HOUSING_SUPPORT_PHONE_STOP_BOTHER')
      .then((stopBother) => {
        $scope.housingPhoneStopBother = stopBother;
      })
      .catch(() => {
        $scope.housingPhoneStopBother = false;
      });
  }

  function init() {
    Housing.getSelected($stateParams.productId)
      .then((informations) => {
        $scope.housing = assign($scope.housing, informations);
        return Housing.getDescription($stateParams.productId);
      })
      .then((description) => {
        $scope.housing = assign($scope.housing, description);
        $scope.housing.isExpired = moment(description.expiration).isBefore(
          moment(),
        );
        $scope.housing.serviceInfos = description;
        $scope.loadingHousingInformations = false;
      })
      .catch((err) => {
        Alerter.alertFromSWS(
          $translate.instant('housing_tab_stats_failure_load'),
          err,
          'housing_dashboard_alert',
        );
        $scope.loadingHousingError = true;
      });

    $scope.user = coreConfig.getUser();
    checkIfStopBotherHousingPhone();

    const urls = getConstants(coreConfig.getRegion()).URLS;
    $scope.changeOwnerUrl = urls[$scope.user.ovhSubsidiary].changeOwner;

    Housing.getOrderableApc($stateParams.productId).then((data) => {
      $scope.disable.reboot = !(data.free && data.orderable);
      $scope.housing.apc = data;
    });
  }

  $scope.setToBigModalDialog = function setToBigModalDialog(active) {
    $scope.bigModalDialog = active;
  };

  $scope.resetAction = function resetAction() {
    $scope.setAction(false);
    $scope.setToBigModalDialog(false);
  };

  $scope.setAction = function setAction(action, data) {
    if (action) {
      $scope.currentAction = action;
      $scope.currentActionData = data;
      $scope.stepPath = `dedicated/housing/${$scope.currentAction}.html`;

      $('#currentAction').modal({
        keyboard: true,
        backdrop: 'static',
      });
    } else {
      $('#currentAction').modal('hide');
      $scope.currentActionData = null;
      $timeout(() => {
        $scope.stepPath = '';
      }, 300);
    }
  };

  $scope.createStopBotherUserPref = function createStopBotherUserPref() {
    ovhUserPref.create('HOUSING_SUPPORT_PHONE_STOP_BOTHER', true);
  };

  init();
}
