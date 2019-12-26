import uniqueId from 'lodash/uniqueId';

import 'chart.js/dist/Chart.min';
import 'chartjs-plugin-zoom/chartjs-plugin-zoom';

import template from './chartjs.html';

export default () => ({
  restrict: 'A',
  scope: {
    wucChartjs: '=?',
  },
  bindToController: true,
  controllerAs: '$ctrl',
  template,
  link(scope, element, attrs, controller) {
    const canvas = element.children().get(0);
    canvas.id = uniqueId('wucChartjs');
    // eslint-disable-next-line no-param-reassign
    controller.ctx = canvas.getContext('2d');
  },
  controller($scope) {
    'ngInject';

    const self = this;

    this.createChart = function createChart(data) {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      this.chartInstance = new Chart(this.ctx, data || this.wucChartjs);
    };

    this.$onInit = () => {
      $scope.$watch('$ctrl.wucChartjs', (data) => {
        if (data) {
          self.createChart(data);
        }
      });

      $scope.$on('destroy', () => {
        if (self.chartInstance) {
          self.chartInstance.destroy();
        }
      });
    };
  },
});
