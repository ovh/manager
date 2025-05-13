import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import { format, fromUnixTime } from 'date-fns';
import {
  METRICS_TIME_RANGES,
  CHART_METRICS_OPTIONS,
  CHART_METRICS_REFRESH_INTERVAL,
} from '../../databases.constants';
import { METRICS_CONVERTER } from './metrics.constants';

export default class MetricsCtrl {
  /* @ngInject */
  constructor(
    $translate,
    ChartFactory,
    CucCloudMessage,
    DatabaseService,
    DATEFNS_LOCALE,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
    this.DATEFNS_LOCALE = DATEFNS_LOCALE;
    this.PciChartjsFactory = ChartFactory;
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
    const locale = this.DATEFNS_LOCALE;
    this.availableMetrics.forEach((metric) => {
      const chartOptions = CHART_METRICS_OPTIONS.chart;
      chartOptions.options.scales.x.ticks = {
        callback: (value) => {
          return format(value, 'Pp', { locale });
        },
      };
      chartOptions.options.plugins.tooltip.callbacks = {
        title(tooltipItem) {
          return format(
            tooltipItem[0].dataset.data[tooltipItem[0].dataIndex].x,
            'Pp',
            { locale },
          );
        },
      };
      this.metricsData[metric] = {
        chart: new this.PciChartjsFactory(angular.copy(chartOptions)),
      };

      this.metricsData[metric].chart.setTitle(
        this.$translate.instant(`pci_databases_metrics_title_${metric}`),
      );

      this.metricsData[metric].chart.setTooltipCallback('label', (item) =>
        parseFloat(item.formattedValue, 10).toPrecision(3),
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
        this.metricsData[data.name].chart.data.datasets = [];
        metrics.forEach((metric) => {
          this.metricsData[data.name].chart.updateSerie(
            metric.hostname,
            map(metric.dataPoints, (point) => ({
              x: fromUnixTime(point.timestamp),
              y: point.value * (METRICS_CONVERTER[data.name] || 1),
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
