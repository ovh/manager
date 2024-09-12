import set from 'lodash/set';
import uniqueId from 'lodash/uniqueId';
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import template from './template.html';

export default /* @ngInject */ () => ({
  restrict: 'A',
  scope: {
    chartjs: '=',
    utils: '=?',
    autoReload: '=?',
  },
  bindToController: true,
  controllerAs: '$ctrl',
  template,
  link(scope, element, attrs, controller) {
    const canvas = element.children().get(0);
    canvas.id = uniqueId('chartjs');
    set(controller, 'ctx', canvas.getContext('2d'));
  },
  controller: /* @ngInject */ function directiveController($scope, $interval) {
    Chart.register(zoomPlugin);

    this.createChart = function createChart(data) {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      this.chartInstance = new Chart(this.ctx, data || this.chartjs);
    };

    this.$onInit = function $onInit() {
      if (this.autoReload) {
        $scope.$watch('$ctrl.chartjs', (data) => {
          if (data) {
            this.utils.refresh();
          }
        });

        $scope.$watchCollection('$ctrl.chartjs.data.datasets', () => {
          this.utils.refresh();
        });

        $scope.$watchCollection('$ctrl.chartjs.data', () => {
          this.utils.refresh();
        });
      }

      this.utils = {
        refresh: () => {
          if (this.chartInstance) {
            this.chartInstance.update();
          } else {
            this.createChart(this.chartjs);
          }
        },
      };
    };

    this.$onDestroy = () => {
      if (this.chartInstance) {
        const pluginPrometheus = this.chartInstance['datasource-prometheus'];
        if (!pluginPrometheus) {
          this.chartInstance.destroy();
          return;
        }

        const destroyInterval = $interval(() => {
          if (!pluginPrometheus.loading) {
            clearInterval(
              this.chartInstance['datasource-prometheus'].updateInterval,
            );
            this.chartInstance.destroy();
            this.chartInstance = null;
            $interval.cancel(destroyInterval);
          }
        }, 500);
      }
    };
  },
});
