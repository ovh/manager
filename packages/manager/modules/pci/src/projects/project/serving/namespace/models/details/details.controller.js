import { unzip } from 'lodash';
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
        method: this.httpHits,
      },
      {
        id: 'HTTP_LATENCY',
        name: this.$translate.instant(
          'pci_projects_project_serving_models_details_infos_metrics_http_latency',
        ),
        method: this.httpLatency,
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
        bucketCount: '5',
        bucketSize: '1 m',
        round: 1,
      },
      {
        id: '1H',
        name: this.$translate.instant(
          'pci_projects_project_serving_models_details_infos_metrics_period_1h',
        ),
        amount: '1',
        unit: 'hours',
        bucketCount: '12',
        bucketSize: '5 m',
        round: 5,
      },
      {
        id: '1D',
        name: this.$translate.instant(
          'pci_projects_project_serving_models_details_infos_metrics_period_1d',
        ),
        amount: '24',
        unit: 'hours',
        bucketCount: '24',
        bucketSize: '1 h',
        round: 60,
      },
    ];

    // setup metrics container
    this.metrics = {
      data: [],
      labels: [],
      series: [],
      colors: [],
      unit: '',
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
    const now = moment();

    // We round it to the next minute / 5 minutes depending on the current metrics
    const remainder =
      this.selected.period.round - (now.minute() % this.selected.period.round);
    const end = moment(now)
      .subtract(remainder, 'minutes')
      .set({ seconds: 0, milliseconds: 0 });

    return {
      startDate: moment(end).subtract(
        this.selected.period.amount,
        this.selected.period.unit,
      ),
      endDate: moment(end),
      now,
    };
  }

  // Reset the current metrics object
  resetCurentMetrics() {
    this.metrics.unit = '';
    this.metrics.data.splice(0, this.metrics.data.length);
    this.metrics.series.splice(0, this.metrics.data.length);
    this.metrics.colors.splice(0, this.metrics.data.length);
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
        [ SWAP bucketizer.last '${d.endDate.toISOString()}' TOTIMESTAMP ${
          this.selected.period.bucketSize
        } ${this.selected.period.bucketCount} ] BUCKETIZE
        [ 0.0 0.0 0 0.0 ] FILLVALUE
        SORT`,
      )
      .$promise.then((series) => {
        const data = Object.values(series[0]);

        // Reset current metrics
        this.resetCurentMetrics();

        for (let i = 0; i < data.length; i += 1) {
          if (data[i] && 'v' in data[i]) {
            const serie = unzip(data[i].v);
            this.metrics.labels = serie[0].map((o) =>
              moment(o / 1e3).format('hh:mm:ss'),
            );
            // eslint-disable-next-line prefer-destructuring
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
        [ SWAP bucketizer.last '${d.endDate.toISOString()}' TOTIMESTAMP ${
          this.selected.period.bucketSize
        } ${this.selected.period.bucketCount} ] BUCKETIZE FILLNEXT
        [ 0.0 0.0 0 0.0 ] FILLVALUE
        SORT`,
      )
      .$promise.then((series) => {
        const data = Object.values(series[0]);

        // Reset current metrics
        this.resetCurentMetrics();

        this.metrics.unit = '%';
        for (let i = 0; i < data.length; i += 1) {
          if (data[i] && 'v' in data[i]) {
            const serie = unzip(data[i].v);
            this.metrics.labels = serie[0].map((o) =>
              moment(o / 1e3).format('hh:mm:ss'),
            );
            this.metrics.data[i] = serie[1].map((o) => (o * 100).toFixed(2));
            this.metrics.series[i] = this.$translate.instant(
              `pci_projects_project_serving_models_details_infos_usage_metrics_${data[i].c}`,
            );
            this.metrics.colors[i] = METRICS_COLOR_MAPPING[data[i].c];
          }
        }
      });
  }

  httpHits() {
    const d = this.computeDates();
    this.warp10
      .query(
        `[
            '${this.metricsToken.token}'
            'serving.model.http.request.count'
            { 'model' '${this.model.id}' }
            '${d.startDate.toISOString()}'
            '${d.endDate.toISOString()}'
        ]
        FETCH
        [ SWAP mapper.delta 0 1 0 ] MAP
        [ SWAP bucketizer.sum '${d.endDate.toISOString()}' TOTIMESTAMP ${
          this.selected.period.bucketSize
        } ${this.selected.period.bucketCount} ] BUCKETIZE FILLNEXT
        [ 0.0 0.0 0 0.0 ] FILLVALUE
        SORT`,
      )
      .$promise.then((series) => {
        const data = Object.values(series[0]);

        // Reset current metrics
        this.resetCurentMetrics();
        this.extractStatusMetrics(data);
      });
  }

  // Retrieve HTTP Latency
  httpLatency() {
    const d = this.computeDates();
    this.warp10
      .query(
        `
        [
          [
              '${this.metricsToken.token}'
              'serving.model.http.request.sum'
              { 'model' '${this.model.id}' }
              '${d.startDate.toISOString()}'
              '${d.endDate.toISOString()}'
          ] FETCH
          [ SWAP bucketizer.last '${d.endDate.toISOString()}' TOTIMESTAMP ${
          this.selected.period.bucketSize
        } ${this.selected.period.bucketCount} ] BUCKETIZE
          [ SWAP [ 'model' 'status' ] reducer.sum ] REDUCE
          [ SWAP mapper.rate 1 0 0 ] MAP
          [
              '${this.metricsToken.token}'
              'serving.model.http.request.count'
              { 'model' '${this.model.id}' }
              '${d.startDate.toISOString()}'
              '${d.endDate.toISOString()}'
          ] FETCH
          [ SWAP bucketizer.last '${d.endDate.toISOString()}' TOTIMESTAMP ${
          this.selected.period.bucketSize
        } ${this.selected.period.bucketCount} ] BUCKETIZE
          [ SWAP [ 'model' 'status' ] reducer.sum ] REDUCE
          [ SWAP mapper.rate 1 0 0 ] MAP
          [ SWAP 0.0 mapper.gt 0 0 0 ] MAP
          [ 0.0 0.0 0 1.0 ] FILLVALUE
          [ 'model' 'status' ]
          op.div
        ]
        APPLY
        SORT`,
      )
      .$promise.then((series) => {
        const data = Object.values(series[0]);

        // Reset current metrics
        this.resetCurentMetrics();
        this.metrics.unit = 'ms';
        this.extractStatusMetrics(data);
      });
  }

  // Merge metrics by status code (200 / 201 => 2xx)
  extractStatusMetrics(data) {
    const statusMap = {};
    for (let i = 0; i < data.length; i += 1) {
      if (data[i] && 'v' in data[i]) {
        const serie = unzip(data[i].v);

        let { status } = data[i].l;

        status = Math.round(status / 100);
        if (!(status in statusMap)) {
          // eslint-disable-next-line prefer-destructuring
          statusMap[status] = serie[1];
        } else {
          statusMap[status] = statusMap[status].map(
            (num, idx) => num + serie[1][idx],
          );
        }

        this.metrics.labels = serie[0].map((o) =>
          moment(o / 1e3).format('HH:mm:ss'),
        );
      }
    }

    let i = 0;

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(statusMap)) {
      this.metrics.data[i] = value;
      const renamedKey = `${key}xx`;
      this.metrics.series[i] = renamedKey;
      this.metrics.colors[i] = METRICS_COLOR_MAPPING[renamedKey];
      i += 1;
    }
  }
}
