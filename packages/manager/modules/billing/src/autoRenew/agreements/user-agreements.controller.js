import get from 'lodash/get';

export default /* @ngInject */ function UserAccountAgreementsController(
  $scope,
  $translate,
  Alerter,
  UserAccountServicesAgreements,
) {
  function init() {
    $scope.loading = true;
    $scope.list = [];
  }

  $scope.loadAgreementsList = function loadAgreementsList(count, offset) {
    init();

    UserAccountServicesAgreements.getList(count, offset)
      .then(
        (agreements) => {
          $scope.list = agreements;
        },
        (err) => {
          Alerter.error(
            `${$translate.instant('user_agreements_error')} ${get(
              err,
              'message',
            ) || err}`,
            'agreements_alerter',
          );
        },
      )
      .then(() => {
        $scope.loading = false;
      });
  };

  $scope.resetMessages = function resetMessages() {
    Alerter.resetMessage('agreements_alerter');
  };
}
