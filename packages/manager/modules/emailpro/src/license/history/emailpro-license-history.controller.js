import angular from 'angular';
import set from 'lodash/set';
import 'moment';

export default /* @ngInject */ (
  $rootScope,
  $stateParams,
  $scope,
  $translate,
  EmailPro,
) => {
  $scope.loading = false;
  $scope.selectedPeriod = { period: 'LASTMONTH' };

  const parseItem = function parseItem(item) {
    const d = moment(item.time, 'YYYY-MM-DDTHH:mm:dd.SSSZZ').toDate();
    return [Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()), item.value];
  };

  const parseSerie = function parseSerie(serie) {
    set(
      serie,
      'name',
      $translate.instant(`emailpro_action_license_history_type_${serie.name}`),
    );
    const rawData = []; // data buffer
    angular.forEach(serie.data, (obj2) => {
      rawData.push(parseItem(obj2));
    });
    set(serie, 'data', rawData);
  };

  $scope.loadMonitoring = function loadMonitoring(periodParam) {
    let period = periodParam;
    $scope.loading = true;
    period = period || $scope.selectedPeriod.period;
    $scope.licenseHistory = null;

    EmailPro.getEmailProLicenseHistory($stateParams.productId, period).then(
      (data) => {
        angular.forEach(data.series, (serie) => {
          parseSerie(serie);
        });
        $scope.licenseHistory = data;
        $scope.loading = false;
      },
      (failure) => {
        $scope.resetAction();
        $scope.loading = false;
        $scope.setMessage(
          $translate.instant('emailpro_action_license_history_fail'),
          failure.data,
        );
      },
    );
  };

  $scope.$watch(
    'selectedPeriod',
    (oldValue, newValue) => {
      if (oldValue !== newValue) {
        $scope.loadMonitoring($scope.selectedPeriod.period);
      }
    },
    true,
  );
};
