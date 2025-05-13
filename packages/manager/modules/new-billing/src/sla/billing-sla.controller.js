import every from 'lodash/every';

export default /* @ngInject */ (
  $scope,
  $translate,
  BillingSla,
  Alerter,
  $q,
  atInternet,
) => {
  $scope.slaIds = [];

  $scope.loaders = {
    slas: true,
    services: false,
  };

  $scope.currentSlaOpen = { value: null };

  function init() {
    $scope.currentSlaOpen = { value: null };
    $scope.slaIds = [];
    $scope.slaIds = [];
    $scope.getSlas(true);
  }

  $scope.getSlas = function getSlas(forceRefresh) {
    $scope.slaIds = [];
    $scope.loaders.slas = true;
    return BillingSla.getSlas({ forceRefresh }).then(
      (ids) => {
        $scope.slaIds = ids;
        if (ids.length === 0) {
          $scope.loaders.slas = false;
        }
      },
      (err) => {
        Alerter.alertFromSWS($translate.instant('sla_informations_error'), err);
      },
    );
  };

  $scope.transformItem = function transformItem(item) {
    $scope.loaders.slas = true;
    return $q
      .all({
        sla: BillingSla.getSla({ id: item }),
        canBeApplied: BillingSla.canBeApplied({ id: item }),
        services: BillingSla.getServices({ id: item }),
        status: BillingSla.getStatus({ id: item }),
      })
      .then(({ sla, canBeApplied, services, status }) => {
        const detail = sla;
        detail.canBeApplied = canBeApplied;
        detail.services = services;
        detail.status = status;
        return detail;
      });
  };

  $scope.onTransformItemDone = function onTransformItemDone() {
    $scope.loaders.slas = false;
  };

  $scope.applySla = function applySla(sla) {
    $scope.loaders.applySla = true;
    atInternet.trackClick({
      type: 'action',
      name: `SLA-Btn-${sla.id}`,
    });

    BillingSla.applySla({ id: sla.id })
      .then(
        () => {
          Alerter.success($translate.instant('sla_apply_success'));
        },
        (err) => {
          Alerter.alertFromSWS($translate.instant('sla_apply_error'), err);
        },
      )
      .finally(() => {
        $scope.loaders.applySla = false;
        init();
      });
  };

  $scope.allNotApplicable = function allNotApplicable() {
    return every($scope.slas, { status: 'notApplicable' });
  };

  $scope.allRequested = function allRequested() {
    return every($scope.slas, { status: 'requested' });
  };

  $scope.allCompleted = function allCompleted() {
    return every($scope.slas, { status: 'completed' });
  };

  init();
};
