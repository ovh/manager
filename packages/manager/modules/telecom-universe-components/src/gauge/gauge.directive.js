import set from 'lodash/set';

import template from './gauge.html';

export default /* @ngInject */ () => ({
  restrict: 'A',
  template,
  scope: {
    tucGauge: '=?',
    tucGaugeWidth: '=?',
    ngModel: '=?',
  },
  controllerAs: '$ctrl',
  bindToController: true,
  link(scope, elt, attrs, controller) {
    set(controller, 'cursor', elt.find('.gauge-cursor'));
    set(controller, 'svg', elt.find('svg.gauge'));
    set(controller, 'gaugeContainer', elt.find('g.gauge'));
  },
  controller($scope, $interval) {
    'ngInject';

    const self = this;
    let going;
    let targetValue = 0;
    let currentValue = 0;

    function goto(value) {
      targetValue = value || 0;
      if (going) {
        return;
      }
      going = $interval(() => {
        const speed =
          Math.abs(targetValue - currentValue) / (self.tucGauge || 1);
        if (speed > 0.05) {
          const dir =
            (targetValue - currentValue) / Math.abs(targetValue - currentValue);
          currentValue += dir * speed * (self.tucGauge / 5);
          const fraction = (currentValue || 0) / (self.tucGauge || 1);
          self.cursor.attr('transform', `rotate(${180 * fraction})`);
        } else {
          $interval.cancel(going);
          going = undefined;
        }
      }, 100);
    }

    $scope.$on('destroy', () => {
      if (going) {
        $interval.cancel(going);
      }
    });

    $scope.$watch('$ctrl.tucGaugeWidth', (width) => {
      const scale = (width || 100) / 440;
      self.gaugeContainer.attr('transform', `scale(${scale})`);
      self.svg.css('width', `${Math.ceil(440 * scale)}px`);
      self.svg.css('height', `${Math.ceil(320 * scale)}px`);
    });

    $scope.$watch('$ctrl.ngModel', goto);
  },
});
