import { BRING_YOUR_OWN_IP } from './ip.constant';

export default /* @ngInject */ function IpMainCtrl(
  $scope,
  $timeout,
  $translate,
  Alerter,
  coreConfig,
  currentActiveLink,
  currentUser,
  dashboardLink,
  failoverLink,
  goToOrganisation,
  goToByoipConfiguration,
  goToAgoraOrder,
) {
  $scope.currentUser = currentUser;
  $scope.currentActiveLink = currentActiveLink;
  $scope.dashboardLink = dashboardLink;
  $scope.failoverLink = failoverLink;

  $scope.goToOrganisation = () => goToOrganisation();
  $scope.goToByoipConfiguration = goToByoipConfiguration;
  $scope.goToAgoraOrder = goToAgoraOrder;
  $scope.worldPart = coreConfig.getRegion();
  $scope.BRING_YOUR_OWN_IP = BRING_YOUR_OWN_IP;

  // ---

  $scope.resetAction = function resetAction() {
    $scope.setAction(false);
  };

  $scope.$on('$locationChangeStart', () => {
    $scope.resetAction();
  });

  $scope.setAction = function setAction(action, data) {
    $scope.currentAction = action;
    $scope.currentActionData = data;
    if ($scope.currentAction) {
      $scope.stepPath = `ip/${$scope.currentAction}.html`;
      $('#currentAction').modal({
        keyboard: false,
        backdrop: 'static',
      });
    } else {
      $('#currentAction').modal('hide');
      $timeout(() => {
        $scope.stepPath = '';
      }, 300);
    }
  };

  /* here, because if the user switch the tab after an action requesting a polling,
   * when the polling is done, the message still displayed */
  $scope.$on('iplb.backends.needUpdate', () => {
    Alerter.resetMessage('polling_action');
  });
  $scope.$on('iplb.backends.error', (evt, reason) => {
    let type = 'generic';
    if (reason.action) {
      type = reason.action;
    }

    Alerter.error(
      $translate.instant(`iplb_backend_${type}_failure`),
      'polling_action',
    );
  });
}
