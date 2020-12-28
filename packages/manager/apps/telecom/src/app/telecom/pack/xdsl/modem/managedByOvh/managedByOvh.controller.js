import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';

export default /* @ngInject */ function XdslModemManagedByCtrl(
  $stateParams,
  $q,
  $translate,
  OvhApiXdsl,
  TucToast,
  TucPackXdslModemMediator,
) {
  const self = this;

  this.mediator = TucPackXdslModemMediator;

  this.undo = function undo() {
    set(
      TucPackXdslModemMediator,
      'info.managedByOvh',
      !TucPackXdslModemMediator.info.managedByOvh,
    );
    TucPackXdslModemMediator.unsetTask('changeModemConfigManagement');
  };

  this.tooltip = get(this.mediator, 'info.managedByOvh')
    ? [
        '<strong class="text-warning">',
        $translate.instant('xdsl_modem_managedBy_warning'),
        '</strong>',
      ].join('')
    : [
        '<strong class="text-warning">',
        $translate.instant('xdsl_modem_managedBy_warning_override'),
        '</strong>',
      ].join('');

  this.changeManagedBy = function changeManagedBy() {
    if (isEmpty($stateParams.serviceName)) {
      TucToast.error(
        $translate.instant('xdsl_modem_managedBy_an_error_ocurred'),
      );
      return $q.reject();
    }
    this.updating = true;
    TucPackXdslModemMediator.setTask('changeModemConfigManagement');
    TucPackXdslModemMediator.disableCapabilities();
    return OvhApiXdsl.Modem()
      .v6()
      .update(
        {
          xdslId: $stateParams.serviceName,
        },
        {
          managedByOvh: TucPackXdslModemMediator.info.managedByOvh,
        },
      )
      .$promise.then((data) => {
        if (TucPackXdslModemMediator.info.managedByOvh) {
          TucToast.success(
            $translate.instant('xdsl_modem_managedBy_success_validation_on'),
          );
        } else {
          TucToast.success(
            $translate.instant('xdsl_modem_managedBy_success_validation_off'),
          );
        }
        return data;
      })
      .catch((err) => {
        self.undo();
        TucToast.error(
          $translate.instant('xdsl_modem_managedBy_an_error_ocurred'),
        );
        return $q.reject(err);
      })
      .finally(() => {
        self.updating = false;
      });
  };
}
