import { uniqBy, find } from 'lodash';
import moment from 'moment';

export default class JobLogsService {
  /* @ngInject */
  constructor(
    $timeout,
    $translate,
    dataProcessingService,
    PciStoragesContainersService,
    CucControllerHelper,
  ) {
    this.$translate = $translate;
    this.$timeout = $timeout;
    this.initLogs();
    this.dataProcessingService = dataProcessingService;
    this.containerService = PciStoragesContainersService;
    this.cucControllerHelper = CucControllerHelper;
  }

  initLogs() {
    this.logs = {
      logs: [
        {
          timestamp: moment().toISOString(),
          id: moment().valueOf() * 1e6,
          content: this.$translate.instant(
            'data_processing_details_logs_default_message',
          ),
        },
      ],
      logsAddress: null,
    };
  }

  /**
   * Create a timer polling jobs for given job
   * @param projectId Id of the project containing the job
   * @param jobId Id of the job get logs from
   * @param interval Polling interval in ms
   * @param firstPoll boolean Set to true to enable a first polling before timer
   */
  startLogsPolling(projectId, jobId, interval = 5000, firstPoll = false) {
    const from = `now-${(interval + 1000) / 1000}s`;
    if (firstPoll) {
      this.pollLogs(projectId, jobId, from).then((logs) => {
        this.logs = logs;
      });
    }
    this.timer = this.$timeout(
      () =>
        this.pollLogs(projectId, jobId, from).then((logs) => {
          this.logs = logs;
          if (this.logs.logsAddress === null) {
            this.startLogsPolling(projectId, jobId, interval);
          }
        }),
      interval,
    );
  }

  /**
   * Stop polling jobs
   */
  stopLogsPolling() {
    if (this.timer) {
      this.$timeout.cancel(this.timer);
    }
    this.initLogs();
  }

  /**
   * Poll logs for given job from API, dedupe entries if needed
   * @param projectId string Project ID
   * @param jobId string Job ID
   * @param from string How long we want the logs from. eg. 'now-5s'
   * @return {*}
   */
  pollLogs(projectId, jobId, from) {
    return this.dataProcessingService
      .getLogs(projectId, jobId, from)
      .then((data) => ({
        ...data,
        // dedupe messages. Implementation ensures maintained order.
        logs: uniqBy([...this.logs.logs, ...data.logs], (item) => item.id),
      }));
  }

  /**
   * Retrieve container id from a given container name and a region
   * @param projectId string ProjectId from which to retrieve container
   * @param region string Name of region
   * @param containerName string Name of container
   * @return {*} string Id of the container or null if not found
   */
  getContainerId(projectId, region, containerName) {
    return this.containerService.getAll(projectId).then((containers) => {
      const container = find(
        containers,
        (c) => c.name === containerName && c.region === region.substr(0, 3),
      );
      return container ? container.id : null;
    });
  }

  /**
   * Download given object from container
   * @param projectId string ProjectId from which to retrieve container
   * @param region string Name of region
   * @param containerName string Name of container
   * @param objectName string name of the object
   */
  downloadObject(projectId, region, containerName, objectName) {
    this.getContainerId(projectId, region, containerName)
      .then((id) => {
        if (id !== null) {
          return this.containerService.downloadObject(projectId, id, {
            name: objectName,
          });
        }
        return null;
      })
      .then((o) => {
        if (o !== null) {
          this.cucControllerHelper.constructor.downloadUrl(o);
        }
      });
  }
}
