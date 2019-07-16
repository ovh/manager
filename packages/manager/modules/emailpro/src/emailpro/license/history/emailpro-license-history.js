angular.module('Module.emailpro.controllers').controller('EmailProLicenseHistoryCtrl', ($rootScope, $stateParams, $scope, $translate, EmailPro) => {
  $scope.loading = false;
  $scope.selectedPeriod = { period: 'LASTMONTH' };

  const parseItem = function (item) {
    const d = moment(item.time, 'YYYY-MM-DDTHH:mm:dd.SSSZZ').toDate();
    return [Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()), item.value];
  };

  const parseSerie = function (serie) {
    _.set(serie, 'name', $translate.instant(`emailpro_action_license_history_type_${serie.name}`));
    const rawData = []; // data buffer
    angular.forEach(serie.data, (obj2) => {
      rawData.push(parseItem(obj2));
    });
    _.set(serie, 'data', rawData);
  };

  $scope.loadMonitoring = function (periodParam) {
    let period = periodParam;
    $scope.loading = true;
    period = period || $scope.selectedPeriod.period;
    $scope.licenseHistory = null;

    EmailPro.getEmailProLicenseHistory($stateParams.productId, period)
      .then((data) => {
        angular.forEach(data.series, (serie) => {
          parseSerie(serie);
        });
        $scope.licenseHistory = data;
        $scope.loading = false;
      }, (failure) => {
        $scope.resetAction();
        $scope.loading = false;
        $scope.setMessage($translate.instant('emailpro_action_license_history_fail'), failure.data);
      });
  };

  $scope.$watch('selectedPeriod', (oldValue, newValue) => {
    if (oldValue !== newValue) {
      $scope.loadMonitoring($scope.selectedPeriod.period);
    }
  }, true);
});
