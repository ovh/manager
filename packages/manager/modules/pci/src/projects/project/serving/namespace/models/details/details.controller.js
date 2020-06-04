import { find, unzip } from 'lodash';
import {
  METRICS_COLOR_MAPPING,
  METRICS_REFRESH_INTERVAL,
  WARP10_URL,
} from './details.constants';

export default class PciServingNamespaceModelsDetailsController {
  /* @ngInject */
  constructor(
    $scope,
    $resource,
    $timeout,
    $uibModal,
    CucCloudMessage,
    $translate,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.$timeout = $timeout;
    this.cucCloudMessage = CucCloudMessage;
    this.metricsTimer = null;

    // setup metrics retrieval
    this.warp10 = $resource(
      WARP10_URL,
      {},
      {
        query: {
          method: 'POST',
          isArray: true,
        },
      },
    );

    this.metricsName = [
      {
        id: 'INSTANCES',
        name: this.$translate.instant(
          'pci_projects_project_serving_models_details_infos_metrics_instances',
        ),
        method: this.queryInstancesNb,
      },
      {
        id: 'HTTP',
        name: this.$translate.instant(
          'pci_projects_project_serving_models_details_infos_metrics_http',
        ),
        method: this.queryInstancesNb,
      },
      {
        id: 'USAGE',
        name: this.$translate.instant(
          'pci_projects_project_serving_models_details_infos_metrics_usage',
        ),
        method: this.queryUsage,
      },
    ];

    this.period = [
      {
        id: '5M',
        name: this.$translate.instant(
          'pci_projects_project_serving_models_details_infos_metrics_period_5m',
        ),
        amount: '5',
        unit: 'minutes',
        bucketizer: '1 m',
      },
      {
        id: '1H',
        name: this.$translate.instant(
          'pci_projects_project_serving_models_details_infos_metrics_period_1h',
        ),
        amount: '1',
        unit: 'hours',
        bucketizer: '5 m',
      },
      {
        id: '1D',
        name: this.$translate.instant(
          'pci_projects_project_serving_models_details_infos_metrics_period_1d',
        ),
        amount: '24',
        unit: 'hours',
        bucketizer: '1 h',
      },
    ];

    // setup metrics container
    this.metrics = {
      data: [],
      labels: [],
      series: [],
      colors: [],
    };

    this.selected = {
      type: this.metricsName[0],
      period: this.period[0],
    };
  }

  getStatistics() {
    if (this.metricsTimer !== null) {
      this.$timeout.cancel(this.metricsTimer);
    }
    this.selected.type.method.bind(this)();
    this.metricsTimer = this.$timeout(
      () => this.selected.type.method.bind(this)(),
      METRICS_REFRESH_INTERVAL,
    );
  }

  $onInit() {
    this.getStatistics();
  }

  $onDestroy() {
    if (this.metricsTimer !== null) {
      this.$timeout.cancel(this.metricsTimer);
    }
  }

  computeDates() {
    return {
      startDate: moment().subtract(
        this.selected.period.amount,
        this.selected.period.unit,
      ),
      endDate: moment(),
    };
  }

  queryInstancesNb() {
    const d = this.computeDates();
    this.warp10
      .query(
        `[
            '${this.metricsToken.token}'
            '~serving.model.scaler.*'
            { 'model' '${this.model.id}' }
            '${d.startDate.toISOString()}'
            '${d.endDate.toISOString()}'
        ]
        FETCH
        [ SWAP bucketizer.last 0 ${
          this.selected.period.bucketizer
        } 0 ] BUCKETIZE
        SORT`,
      )
      .$promise.then((series) => {
        const data = Object.values(series[0]);

        for (let i = 0; i < this.metrics.data.length; i += 1) {
          this.metrics.data[i] = [];
          this.metrics.series[i] = [];
          this.metrics.colors[i] = [];
        }

        for (let i = 0; i < data.length; i += 1) {
          if (data[i] && 'v' in data[i]) {
            const serie = unzip(data[i].v);
            this.metrics.labels = serie[0].map((o) =>
              moment(o / 1e3).format('hh:mm:ss'),
            );
            this.metrics.data[i] = serie[1];
            this.metrics.series[i] = this.$translate.instant(
              `pci_projects_project_serving_models_details_infos_instances_metrics_${data[i].c}`,
            );
            this.metrics.colors[i] = METRICS_COLOR_MAPPING[data[i].c];
          }
        }
      });
  }

  queryUsage() {
    const d = this.computeDates();
    this.warp10
      .query(
        `[
            '${this.metricsToken.token}'
            '~serving.model.*.usage'
            { 'model' '${this.model.id}' }
            '${d.startDate.toISOString()}'
            '${d.endDate.toISOString()}'
        ]
        FETCH
        [ SWAP bucketizer.last 0 ${
          this.selected.period.bucketizer
        } 0 ] BUCKETIZE
        SORT`,
      )
      .$promise.then((series) => {
        const data = Object.values(series[0]);

        for (let i = 0; i < this.metrics.data.length; i += 1) {
          this.metrics.data[i] = [];
          this.metrics.series[i] = [];
          this.metrics.colors[i] = [];
        }

        for (let i = 0; i < data.length; i += 1) {
          if (data[i] && 'v' in data[i]) {
            const serie = unzip(data[i].v);
            this.metrics.labels = serie[0].map((o) =>
              moment(o / 1e3).format('hh:mm:ss'),
            );
            this.metrics.data[i] = serie[1];
            this.metrics.series[i] = this.$translate.instant(
              `pci_projects_project_serving_models_details_infos_instances_metrics_${data[i].c}`,
            );
            this.metrics.colors[i] = METRICS_COLOR_MAPPING[data[i].c];
          }
        }
      });
  }

  // eslint-disable-next-line class-methods-use-this
  formatDateToCalendar(dt) {
    // this method needs to use current instance of moment, so it cannot static
    return moment(dt).calendar();
  }
}
