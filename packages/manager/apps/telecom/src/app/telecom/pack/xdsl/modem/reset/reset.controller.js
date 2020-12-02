import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ function XdslModemResetCtrl(
  $stateParams,
  $scope,
  $translate,
  $q,
  OvhApiXdsl,
  TucToast,
  TucPackXdslModemMediator,
) {
  this.mediator = TucPackXdslModemMediator;

  this.resetModem = function resetModem(resetOvhConfig) {
    if (isEmpty($stateParams.serviceName)) {
      return TucToast.error(
        $translate.instant('xdsl_modem_reset_an_error_ocurred'),
      );
    }
    TucPackXdslModemMediator.setTask('resetModem');
    OvhApiXdsl.Modem()
      .Reset()
      .v6()
      .reset(
        {
          xdslId: $stateParams.serviceName,
        },
        {
          resetOvhConfig: !!resetOvhConfig,
        },
      )
      .$promise.then((result) => {
        if (result.status === 'todo' || result.status === 'doing') {
          TucPackXdslModemMediator.setTask('resetModem');
        }
        TucPackXdslModemMediator.disableCapabilities();
        TucToast.success(
          $translate.instant(
            resetOvhConfig
              ? 'xdsl_modem_reset_ovh_config_success'
              : 'xdsl_modem_reset_success',
          ),
        );
        return result;
      })
      .catch((err) => {
        TucToast.error(
          $translate.instant(
            resetOvhConfig
              ? 'xdsl_modem_reset_ovh_config_an_error_ocurred'
              : 'xdsl_modem_reset_an_error_ocurred',
          ),
        );
        return $q.reject(err);
      });
    return $q.when(null);
  };

  this.reconfigureVoip = function reconfigureVoip() {
    if (isEmpty($stateParams.serviceName)) {
      return TucToast.error(
        $translate.instant('xdsl_modem_reset_an_error_ocurred'),
      );
    }
    TucPackXdslModemMediator.setTask('reconfigureVoip');

    // Disable capabilities canReconfigureVoip to disable button
    this.mediator.capabilities.canReconfigureVoip = false;

    return OvhApiXdsl.Modem()
      .v6()
      .reconfigureVoip(
        {
          xdslId: $stateParams.serviceName,
        },
        null,
      )
      .$promise.then((result) => {
        if (result.status === 'todo' || result.status === 'doing') {
          TucPackXdslModemMediator.setTask('reconfigureVoip');
        }
        TucToast.success(
          $translate.instant('xdsl_modem_reset_reconf_tel_success'),
        );
        return result;
      })
      .catch((err) => {
        if (err.status === 404) {
          if (err.statusText === 'Not Found') {
            TucToast.error(
              $translate.instant('xdsl_modem_reconf_tel_no_voip_line_found'),
            );
          } else {
            TucToast.error(
              $translate.instant('xdsl_modem_reconf_tel_an_error_ocurred'),
            );
          }
        } else if (err.status === 400) {
          if (
            err.data.message.includes(
              '[l1::xdsl::intern::utils::_doResendModemTelephonyConfiguration()]',
            )
          ) {
            TucToast.error(
              $translate.instant(
                'xdsl_modem_reconf_tel_renew_already_scheduled',
              ),
            );
          } else {
            TucToast.error(
              $translate.instant('xdsl_modem_reconf_tel_an_error_ocurred'),
            );
          }
        } else {
          TucToast.error(
            $translate.instant('xdsl_modem_reconf_tel_an_error_ocurred'),
          );
        }
        return $q.reject(err);
      });
  };

  const init = function init() {
    $scope.$on('pack_xdsl_modem_task_resetModem', (event, state) => {
      if (!state) {
        TucToast.success($translate.instant('xdsl_modem_reset_success_end'));
      }
    });
  };

  init();
}
