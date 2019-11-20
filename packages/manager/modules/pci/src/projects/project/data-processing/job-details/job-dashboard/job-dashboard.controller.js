import { find, unzip } from 'lodash';
import moment from 'moment';
import {
  DATA_PROCESSING_STATUS_TO_CLASS, DATA_PROCESSING_STATUSES,
  DATA_PROCESSING_UI_URL, METRICS_REFRESH_INTERVAL,
} from '../../data-processing.constants';

export default class {
  /* @ngInject */
  constructor($scope, $state, $resource, $timeout, $uibModal, CucCloudMessage,
    dataProcessingService, CucRegionService, PciStoragesContainersService) {
    this.$scope = $scope;
    this.$state = $state; // router state
    this.$timeout = $timeout;
    this.cucCloudMessage = CucCloudMessage;
    this.dataProcessingService = dataProcessingService;
    this.cucRegionService = CucRegionService;
    this.DATA_PROCESSING_STATUS_TO_CLASS = DATA_PROCESSING_STATUS_TO_CLASS;
    this.DATA_PROCESSING_UI_URL = DATA_PROCESSING_UI_URL;
    this.containerService = PciStoragesContainersService;
    this.containerId = null;
    this.metricsTimer = null;
    // setup metrics retrieval
    this.warp10 = $resource('https://warp10.gra1.metrics.ovh.net/api/v0/exec', {}, {
      query: {
        method: 'POST',
        transformRequest: [],
        isArray: true,
      },
    });
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
    this.containerService.getAll(this.projectId)
      .then((containers) => {
        const container = find(containers, c => c.name === this.job.containerName);
        if (container !== undefined) {
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
      this.metricsTimer = this.$timeout(() => this.queryMetrics(), METRICS_REFRESH_INTERVAL);
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
      startDate = moment()
        .subtract(5, 'minutes');
      endDate = moment();
    } else {
      startDate = moment(this.job.endDate)
        .subtract(5, 'minutes');
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
      .query(`[ '${this.metricsToken.data.token}' 'spark_jvm_memory_usage' { 'qty' 'used' 'mem_type' 'total' 'job-id' '${this.job.id}' } '${d.startDate.toISOString()}' '${d.endDate.toISOString()}' ] FETCH SORT [ SWAP [ 'executor-id' ] reducer.sum ] REDUCE`)
      .$promise
      .then((series) => {
        if (series.length > 0 && series[0][0] !== undefined && 'v' in series[0][0]) {
          let data = series[0][0].v;
          data = unzip(data);
          this.metrics.totalMemory = {
            labels: data[0].map(o => moment(o / 1e3)
              .format('hh:mm:ss')),
            data: data[1].map(o => parseInt(o / 1e6, 10)),
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
      .query(`[ '${this.metricsToken.data.token}' 'spark_block_manager' { 'qty' 'diskSpaceUsed_MB' 'type' 'disk' 'job-id' '${this.job.id}' } '${d.startDate.toISOString()}' '${d.endDate.toISOString()}' ] FETCH SORT`)
      .$promise
      .then((series) => {
        if (series.length > 0 && series[0][0] !== undefined && 'v' in series[0][0]) {
          let data = series[0][0].v;
          data = unzip(data);
          this.metrics.blockManagerDiskUsed = {
            labels: data[0].map(o => moment(o / 1e3)
              .format('hh:mm:ss')),
            data: data[1].map(o => Math.floor(o / 1e6)),
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
      .query(`[ '${this.metricsToken.data.token}' 'spark_executor' { 'qty' 'activeTasks' 'type' 'threadpool' 'job-id' '${this.job.id}' } '${d.startDate.toISOString()}' '${d.endDate.toISOString()}' ] FETCH SORT`)
      .$promise
      .then((series) => {
        if (series.length > 0 && series[0][0] !== undefined && 'v' in series[0][0]) {
          let data = series[0][0].v;
          data = unzip(data);
          this.metrics.activeTasks = {
            labels: data[0].map(o => moment(o / 1e3)
              .format('hh:mm:ss')),
            data: data[1].map(o => Math.floor(o)),
          };
        }
      });
  }

  /**
   * Load a modal asking confirmation to terminate current job
   */
  terminateJob() {
    this.$state.go('pci.projects.project.data-processing.job-details.dashboard.terminate', {
      projectId: this.projectId,
      jobId: this.job.id,
      jobName: this.job.name,
    });
  }

  /**
   * Load a modal with metrics token and instructions
   */
  showMetrics() {
    this.$state.go('pci.projects.project.data-processing.job-details.dashboard.metrics-token', {
      projectId: this.projectId,
      jobId: this.job.id,
      jobName: this.job.name,
    });
  }

  /**
   * Redirect to billing console in manager
   */
  showBillingConsole() {
    this.$state.go('pci.projects.project.billing', { projectId: this.projectId });
  }

  /**
   * Redirect to Object storage Manager view, showing job container
   */
  browseObjectStorage() {
    this.$state.go('pci.projects.project.storages.objects.object', {
      projectId: this.projectId,
      containerId: this.containerId,
    });
  }

  /**
   * Whether current job is in a (pre-)running state
   * @return {boolean} true if job is Submitted, Pending, Running
   */
  isJobRunning() {
    return [DATA_PROCESSING_STATUSES.PENDING, DATA_PROCESSING_STATUSES.RUNNING,
      DATA_PROCESSING_STATUSES.SUBMITTED].includes(this.job.status);
  }
}
