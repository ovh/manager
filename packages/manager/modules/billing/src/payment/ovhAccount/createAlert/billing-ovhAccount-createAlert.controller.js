import { ALERT } from '../../../constants/ovhAccountEvent.constants';

export default /* @ngInject */ function BillingOvhAccountCreateAlertController(
  $scope,
  $translate,
  BillingOvhAccount,
  Alerter,
) {
  const self = this;

  self.amount = $scope.currentActionData
    ? String($scope.currentActionData / 100)
    : '0';

  $scope.createAlert = () => {
    self.loading = true;
    BillingOvhAccount.putOvhAccountDetails($scope.ovhAccount.model.accountId, {
      alertThreshold: parseInt(self.disableAlert ? 0 : self.amount, 10) * 100,
    })
      .then(() => {
        $scope.$emit(ALERT);
        $scope.loadOvhAccount({
          offset: 1,
        });
        Alerter.success($translate.instant('ovhAccount_create_alert_success'));
      })
      .catch((err) =>
        Alerter.alertFromSWS(
          $translate.instant('ovhAccount_create_alert_error'),
          err,
        ),
      )
      .finally(() => $scope.resetAction());
  };

  $scope.checkAmount = () => !self.amount.match(/,|\./) && self.amount >= 0;
}
