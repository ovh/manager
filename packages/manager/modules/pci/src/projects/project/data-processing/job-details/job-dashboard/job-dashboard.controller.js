import { find, unzip } from 'lodash';
import { getDataProcessingUiUrl } from '../../data-processing.utils';
import {
  DATA_PROCESSING_STATUS_TO_CLASS,
  DATA_PROCESSING_STATUSES,
  METRICS_REFRESH_INTERVAL,
  JOB_TYPE_JAVA,
  JOB_TYPE_PYTHON,
} from '../../data-processing.constants';
import { WARP10_URL } from './job-dashboard.constants';

export default class {
  /* @ngInject */
  constructor(
    $scope,
    $resource,
    $timeout,
    $uibModal,
    $window,
    CucCloudMessage,
    dataProcessingService,
    CucRegionService,
    PciStoragesContainersService,
    atInternet,
  ) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$window = $window;
    this.cucCloudMessage = CucCloudMessage;
    this.dataProcessingService = dataProcessingService;
    this.cucRegionService = CucRegionService;
    this.DATA_PROCESSING_STATUS_TO_CLASS = DATA_PROCESSING_STATUS_TO_CLASS;
    this.JOB_TYPE_JAVA = JOB_TYPE_JAVA;
    this.JOB_TYPE_PYTHON = JOB_TYPE_PYTHON;
    this.getDataProcessingUiUrl = getDataProcessingUiUrl;
    this.containerService = PciStoragesContainersService;
    this.atInternet = atInternet;
    this.containerId = null;
    this.metricsTimer = null;
    // setup metrics retrieval
    this.warp10 = $resource(
      WARP10_URL,
      {},
      {
        query: {
          method: 'POST',
          transformRequest: [],
          isArray: true,
        },
      },
    );
    // setup metrics container
    this.metrics = {
      totalMemory: {
        data: [],
        labels: [],
      },
      activeTasks: {
        data: [],
        labels: [],
      },
      blockManagerDiskUsed: {
        data: [],
        label: [],
      },
    };
  }

  $onInit() {
    // retrieve container id for the job
    this.containerService.getAll(this.projectId).then((containers) => {
      const container = find(
        containers,
        (c) => c.name === this.job.containerName,
      );
      if (container) {
        this.containerId = container.id;
      }
    });
    // start metrics retrieval
    this.queryMetrics();
  }

  $onDestroy() {
    if (this.metricsTimer !== null) {
      this.$timeout.cancel(this.metricsTimer);
    }
  }

  /**
   * Query metrics from OVH metrics backend
   * If job is still running, we query each METRICS_REFRESH_INTERVAL to update charts
   */
  queryMetrics() {
    this.queryMetricsTotalMemory();
    this.queryMetricsActiveTasks();
    this.queryMetricsDiskUsed();
    if (this.job.endDate === null) {
      this.metricsTimer = this.$timeout(
        () => this.queryMetrics(),
        METRICS_REFRESH_INTERVAL,
      );
    }
  }

  /**
   * Compute start date and end dates for charts depending on job status.
   * If job is running, we plot the last 5 minutes.
   * If job is not running any more, we plot the last 5 minutes before the end of job
   * @return {{endDate: moment.Moment, startDate: moment.Moment}}
   */
  computeDates() {
    let startDate;
    let endDate;
    if (this.isJobRunning()) {
      startDate = moment().subtract(5, 'minutes');
      endDate = moment();
    } else {
      startDate = moment(this.job.endDate).subtract(5, 'minutes');
      endDate = moment(this.job.endDate);
    }
    return {
      startDate,
      endDate,
    };
  }

  /**
   * Retrieve JVM total memory usage for current job from metrics backend
   */
  queryMetricsTotalMemory() {
    const d = this.computeDates();
    this.warp10
      .query(
        `[ '${
          this.metricsToken.data.token
        }' 'spark_jvm_memory_usage' { 'qty' 'used' 'mem_type' 'total' 'job-id' '${
          this.job.id
        }' } '${d.startDate.toISOString()}' '${d.endDate.toISOString()}' ] FETCH SORT [ SWAP [ 'executor-id' ] reducer.sum ] REDUCE`,
      )
      .$promise.then((series) => {
        if (series.length > 0 && series[0][0] && 'v' in series[0][0]) {
          let data = series[0][0].v;
          data = unzip(data);
          this.metrics.totalMemory = {
            labels: data[0].map((o) => moment(o / 1e3).format('hh:mm:ss')),
            data: data[1].map((o) => parseInt(o / 1e6, 10)),
          };
        }
      });
  }

  /**
   * Retrieve BlockManager disk usage for current job from metrics backend
   */
  queryMetricsDiskUsed() {
    const d = this.computeDates();
    this.warp10
      .query(
        `[ '${
          this.metricsToken.data.token
        }' 'spark_block_manager' { 'qty' 'diskSpaceUsed_MB' 'type' 'disk' 'job-id' '${
          this.job.id
        }' } '${d.startDate.toISOString()}' '${d.endDate.toISOString()}' ] FETCH SORT`,
      )
      .$promise.then((series) => {
        if (series.length > 0 && series[0][0] && 'v' in series[0][0]) {
          let data = series[0][0].v;
          data = unzip(data);
          this.metrics.blockManagerDiskUsed = {
            labels: data[0].map((o) => moment(o / 1e3).format('hh:mm:ss')),
            data: data[1].map((o) => Math.floor(o / 1e6)),
          };
        }
      });
  }

  /**
   * Retrieve Spark activate tasks for current job from metrics backend
   */
  queryMetricsActiveTasks() {
    const d = this.computeDates();
    this.warp10
      .query(
        `[ '${
          this.metricsToken.data.token
        }' 'spark_executor' { 'qty' 'activeTasks' 'type' 'threadpool' 'job-id' '${
          this.job.id
        }' } '${d.startDate.toISOString()}' '${d.endDate.toISOString()}' ] FETCH SORT`,
      )
      .$promise.then((series) => {
        if (series.length > 0 && series[0][0] && 'v' in series[0][0]) {
          let data = series[0][0].v;
          data = unzip(data);
          this.metrics.activeTasks = {
            labels: data[0].map((o) => moment(o / 1e3).format('hh:mm:ss')),
            data: data[1].map((o) => Math.floor(o)),
          };
        }
      });
  }

  /**
   * Whether current job is in a (pre-)running state
   * @return {boolean} true if job is Submitted, Pending, Running
   */
  isJobRunning() {
    return [
      DATA_PROCESSING_STATUSES.PENDING,
      DATA_PROCESSING_STATUSES.RUNNING,
      DATA_PROCESSING_STATUSES.SUBMITTED,
    ].includes(this.job.status);
  }

  // eslint-disable-next-line class-methods-use-this
  formatDateToCalendar(dt) {
    // this method needs to use current instance of moment, so it cannot static
    return moment(dt).calendar();
  }

  onSparkUIClick() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::data-processing::job-details::dashboard::job-user-interface',
      type: 'action',
    });
    this.$window.open(
      getDataProcessingUiUrl(this.job.region, this.job.id),
      '_blank',
    );
  }

  onMetricsClick() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::data-processing::job-details::dashboard::monitor',
      type: 'action',
    });
    this.showMetrics();
  }

  onObjectContainerClick() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::data-processing::job-details::dashboard::object-container',
      type: 'action',
    });
    this.browseObjectStorage(this.containerId);
  }

  onBillingConsoleClick() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::data-processing::job-details::dashboard::billing-console',
      type: 'action',
    });
    this.showBillingConsole();
  }

  onTerminateClick() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::data-processing::job-details::dashboard::kill-job',
      type: 'action',
    });
    this.terminateJob();
  }
}
