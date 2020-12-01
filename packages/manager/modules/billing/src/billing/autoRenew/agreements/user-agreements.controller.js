import get from 'lodash/get';

export default /* @ngInject */ function UserAccountAgreementsController(
  $scope,
  $translate,
  Alerter,
  atInternet,
  gotoAcceptAllAgreements,
  UserAccountServicesAgreements,
) {
  function init() {
    $scope.loading = true;
    $scope.list = [];

    $scope.getToValidate();
  }

  $scope.loaders = {
    toActivate: true,
    toActivateList: true,
  };

  $scope.toActivate = [];

  $scope.agreed = {};

  $scope.gotoAcceptAllAgreements = gotoAcceptAllAgreements;

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

  $scope.getToValidate = function getToValidate() {
    $scope.toActivate = [];
    $scope.loaders.toActivate = true;

    UserAccountServicesAgreements.getToValidate().then(
      (agreements) => {
        $scope.toActivate = agreements;
        $scope.loaders.toActivate = false;
      },
      angular.noop,
      (contract) => {
        $scope.toActivate.push(contract);
        $scope.agreed[contract.id] = false;
      },
    );
  };

  $scope.accept = function accept(contract) {
    atInternet.trackClick({
      name:
        'dedicated::account::billing::autorenew::agreements::go-to-accept-agreement',
      type: 'action',
    });
    $scope.loaders[`accept_${contract.id}`] = true;

    UserAccountServicesAgreements.accept(contract)
      .then(
        () => {
          $scope.getToValidate();
          $scope.$broadcast('paginationServerSide.reload', 'agreementsList');
        },
        (d) => {
          Alerter.set(
            'alert-danger',
            `${$translate.instant('user_agreement_details_error')} ${get(
              d,
              'data.message',
              d,
            )}`,
            null,
            'agreements_alerter',
          );
        },
      )
      .finally(() => {
        $scope.loaders[`accept_${contract.id}`] = false;
      });
  };

  $scope.resetMessages = function resetMessages() {
    Alerter.resetMessage('agreements_alerter');
  };
}
