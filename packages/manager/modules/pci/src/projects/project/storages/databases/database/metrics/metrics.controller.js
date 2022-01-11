import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import moment from 'moment';
import {
  METRICS_TIME_RANGES,
  CHART_METRICS_OPTIONS,
  CHART_METRICS_REFRESH_INTERVAL,
} from '../../databases.constants';

export default class MetricsCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage, DatabaseService, PciChartjsFactory) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
    this.PciChartjsFactory = PciChartjsFactory;
    this.isLoading = true;
    [this.selectedTimeRange] = METRICS_TIME_RANGES;
    this.timeRanges = METRICS_TIME_RANGES;
    this.metricsData = {};
    this.autoRefresh = false;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.metrics';
    this.loadMessages();
    this.trackDashboard('metrics', 'page');

    this.isLoading = false;

    this.selectedTimeRange.label = this.$translate.instant(
      `pci_databases_metrics_range_label_${this.selectedTimeRange.label_key}`,
    );
    for (let i = 0; i < this.timeRanges.length; i += 1) {
      this.timeRanges[i].label = this.$translate.instant(
        `pci_databases_metrics_range_label_${this.timeRanges[i].label_key}`,
      );
    }

    this.initMetrics();

    this.getMetrics();
  }

  $onDestroy() {
    clearInterval(this.interval);
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(this.messageContainer);
    this.messageHandler = this.CucCloudMessage.subscribe(
      this.messageContainer,
      { onMessage: () => this.refreshMessages() },
    );
  }

  initMetrics() {
    this.availableMetrics.forEach((metric) => {
      const chartOptions = CHART_METRICS_OPTIONS.chart;
      chartOptions.options.scales.xAxes[0].ticks = {
        callback: (value, index, values) => {
          return moment(values[index].value).format('L LT');
        },
      };
      chartOptions.options.tooltips.callbacks = {
        title(tooltipItem, data) {
          return data.datasets[tooltipItem[0].datasetIndex].data[
            tooltipItem[0].index
          ].x.format('L LT');
        },
      };
      this.metricsData[metric] = {
        chart: new this.PciChartjsFactory(angular.copy(chartOptions)),
      };

      this.metricsData[metric].chart.setTitle(
        this.$translate.instant(`pci_databases_metrics_title_${metric}`),
      );

      this.metricsData[metric].chart.setTooltipCallback('label', (item) =>
        parseFloat(item.value, 10).toFixed(2),
      );
    });
  }

  onTimeRangeChange(selectedTimeRange) {
    this.selectedTimeRange = selectedTimeRange;
    this.trackDashboard(
      `metrics::display_granularity_${this.selectedTimeRange.value}`,
      'page',
    );
    this.getMetrics();
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getMetrics() {
    this.availableMetrics.forEach((availableMetric) => {
      this.DatabaseService.getMetrics(
        this.projectId,
        this.database.engine,
        this.database.id,
        availableMetric,
        this.selectedTimeRange.value,
      ).then((data) => {
        const metrics = sortBy(data.metrics, 'hostname');
        this.metricsData[data.name].data = data;

        metrics.forEach((metric) => {
          this.metricsData[data.name].chart.updateSerie(
            metric.hostname.substring(0, metric.hostname.indexOf('-')),
            map(metric.dataPoints, (point) => ({
              x: moment.unix(point.timestamp),
              y: point.value,
            })),
            {
              dataset: {
                fill: true,
                borderWidth: 1,
              },
            },
          );
        });

        this.metricsData[data.name].utils.refresh();
      });
    });
  }

  onChangeAutoRefresh(autoRefresh) {
    this.autoRefresh = autoRefresh;

    clearInterval(this.interval);
    if (autoRefresh) {
      this.interval = setInterval(() => {
        this.getMetrics();
      }, CHART_METRICS_REFRESH_INTERVAL);
    }
  }
}
