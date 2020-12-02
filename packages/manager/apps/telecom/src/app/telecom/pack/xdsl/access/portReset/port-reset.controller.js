import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ function XdslAccessPortResetCtrl(
  $stateParams,
  $scope,
  $translate,
  OvhApiXdslLinesDslamPort,
  TucToast,
  TucToastError,
) {
  this.resetDslam = function resetDslam() {
    if (isEmpty($stateParams.serviceName) || isEmpty($stateParams.number)) {
      TucToast.error(
        $translate.instant('xdsl_access_dslam_reset_an_error_ocurred'),
      );
    }

    OvhApiXdslLinesDslamPort.v6().reset(
      {
        xdslId: $stateParams.serviceName,
        number: $stateParams.number,
      },
      null,
      (result) => {
        if (result.status === 'todo' || result.status === 'doing') {
          $scope.access.tasks.current[result.function] = true;
        }

        TucToast.success($translate.instant('xdsl_access_dslam_reset_success'));
      },
      (err) =>
        new TucToastError(err, 'xdsl_access_dslam_reset_an_error_ocurred'),
    );
  };
}
