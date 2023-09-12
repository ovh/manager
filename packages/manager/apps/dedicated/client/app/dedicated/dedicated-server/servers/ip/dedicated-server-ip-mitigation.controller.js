import set from 'lodash/set';

angular
  .module('App')
  .controller('ServerIpMitigationCtrl', ($scope, $translate, Server) => {
    $scope.selectedIpAndBlock = $scope.currentActionData;
    $scope.mitigationStatusAuto =
      $scope.selectedIpAndBlock.ip.mitigationStatus === 'AUTO'; // Hack for the wizard status

    // Hack because the condition in the template wouldn't change depending on the mitigation status
    $scope.translations = {};
    if ($scope.mitigationStatusAuto) {
      $scope.translations.wizardTitle = $translate.instant(
        'server_configuration_mitigation_force_title',
      );
      $scope.translations.wizardQuestion = $translate.instant(
        'server_configuration_mitigation_force_question',
        { t0: $scope.selectedIpAndBlock.ip.ip },
      );
    } else {
      $scope.translations.wizardTitle = $translate.instant(
        'server_configuration_mitigation_auto_title',
      );
      $scope.translations.wizardQuestion = $translate.instant(
        'server_configuration_mitigation_auto_question',
        { t0: $scope.selectedIpAndBlock.ip.ip },
      );
    }

    $scope.updateMitigation = function updateMitigation() {
      $scope.resetAction();

      // Toggle between the two mitigation status that can be changed
      let newMitigationStatus = 'AUTO';
      if ($scope.mitigationStatusAuto) {
        newMitigationStatus = 'ACTIVATED';
      }

      Server.updateMitigation(
        $scope.selectedIpAndBlock.block.ip,
        $scope.selectedIpAndBlock.ip.ip,
        newMitigationStatus,
      ).then(
        (data) => {
          set(data, 'type', 'INFO');
          if (newMitigationStatus === 'AUTO') {
            $scope.setMessage(
              $translate.instant(
                'server_configuration_mitigation_auto_success',
                { t0: $scope.selectedIpAndBlock.ip.ip },
              ),
              data,
            );
          } else {
            $scope.setMessage(
              $translate.instant(
                'server_configuration_mitigation_force_success',
                { t0: $scope.selectedIpAndBlock.ip.ip },
              ),
              data,
            );
          }
        },
        (data) => {
          set(data, 'type', 'ERROR');
          if (newMitigationStatus === 'AUTO') {
            $scope.setMessage(
              $translate.instant(
                'server_configuration_mitigation_auto_failed',
                { t0: $scope.selectedIpAndBlock.ip.ip },
              ),
              data,
            );
          } else {
            $scope.setMessage(
              $translate.instant(
                'server_configuration_mitigation_force_failed',
                { t0: $scope.selectedIpAndBlock.ip.ip },
              ),
              data,
            );
          }
        },
      );
    };
  });
