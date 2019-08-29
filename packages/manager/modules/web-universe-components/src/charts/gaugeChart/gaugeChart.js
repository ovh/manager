import 'justgage';

const thegauge = [];

export default /* @ngInject */ $timeout => ({
  restrict: 'A',
  replace: false,
  scope: {
    data: '=chartdata',
    min: '@chartMin',
    max: '=chartMax',
    limitWarning: '@limitWarning',
    limitAlert: '@limitAlert',
    colorOk: '@colorOk',
    colorWarning: '@colorWarning',
    colorAlert: '@colorAlert',
    diskUnit: '=diskUnit',
    shadowOpacity: '@shadowOpacity',
  },
  link($scope, $elem, $attr) {
    function printGauge() {
      const nv = $scope.data;
      let printValue;
      let color;

      if (nv != null && ($scope.max !== undefined && $scope.max !== null)) {
        if ($scope.colorOk === undefined) {
          $scope.colorOk = '#a9d70b';
        }
        if ($scope.colorWarning === undefined) {
          $scope.colorWarning = '#f9c802';
        }
        if ($scope.colorAlert === undefined) {
          $scope.colorAlert = '#ff0000';
        }
        if ($scope.limitWarning === undefined) {
          $scope.limitWarning = 70;
        }
        if ($scope.limitAlert === undefined) {
          $scope.limitAlert = 90;
        }
        color = $scope.colorOk;

        if (nv < $scope.limitWarning) {
          color = $scope.colorOk;
        } else if (nv < $scope.limitAlert) {
          color = $scope.colorWarning;
        } else {
          color = $scope.colorAlert;
        }

        printValue = ((nv * $scope.max) / 100).toFixed(2);

        if ($scope.gauge === undefined) {
          $scope.gauge = new JustGage({
            id: $attr.id,
            value: printValue,
            min: 0,
            max: $scope.max,
            title: '',
            valueFontColor: color,
            shadowOpacity: $scope.shadowOpacity,
            levelColors: [color],
            relativeGaugeSize: true,
          });

          $scope.gauge.txtMax.attr(
            'text',
            `${$scope.gauge.txtMax.attrs.text} ${$scope.diskUnit}`,
          );
          $scope.gauge.txtMin.attr(
            'text',
            `${$scope.gauge.txtMin.attrs.text} ${$scope.diskUnit}`,
          );
        } else {
          $scope.gauge.config.max = $scope.max;
          $scope.gauge.refresh(printValue);
        }
        $scope.gauge.txtValue.attr('text', printValue + $scope.diskUnit);
        $scope.gauge.txtValue.attr('font-size', '16px');
        thegauge.push($scope.gauge);
      }
    }

    $scope.$watch(
      'data',
      () => {
        $timeout(printGauge, 100);
      },
      true,
    );

    $scope.$watch(
      'max',
      () => {
        $timeout(printGauge, 100);
      },
      true,
    );
  },
});
