import {
  isJobRunning,
  getClassFromStatus,
  datagridToIcebergFilter,
} from './data-processing.utils';
import { DATA_PROCESSING_GUIDE_URL } from './data-processing.constants';

export default class {
  /* @ngInject */
  constructor(
    $state,
    CucCloudMessage,
    dataProcessingService,
    CucRegionService,
  ) {
    this.$state = $state;
    this.cucCloudMessage = CucCloudMessage;
    this.dataProcessingService = dataProcessingService;
    this.cucRegionService = CucRegionService;
    this.isJobRunning = isJobRunning;
    this.getClassFromStatus = getClassFromStatus;
    this.guideUrl = DATA_PROCESSING_GUIDE_URL;
  }

  $onInit() {
    this.subscribeToMessages();
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  subscribeToMessages() {
    const channel = 'pci.projects.project.data-processing';
    this.cucCloudMessage.unSubscribe(channel);
    this.messageHandler = this.cucCloudMessage.subscribe(channel, {
      onMessage: () => this.refreshMessage(),
    });
  }

  /**
   * Retrieve job list according to pagination
   * @param offset int element offset to retrieve results from
   * @param pageSize int Number of results to retrieve
   * @param sort Object Sort object from ovh-ui datagrid
   * @param criteria Object Criteria object from ovh-ui datagrid
   * @return {*|Promise<any>}
   */
  getJobs({ offset, pageSize, sort, criteria }) {
    const filters = criteria.map((c) => {
      const name = c.name === undefined ? 'name' : c.name;
      return datagridToIcebergFilter(name, c.operator, c.value);
    });
    const pageOffset = Math.ceil(offset / pageSize);
    return this.dataProcessingService.getJobs(
      this.projectId,
      pageOffset,
      pageSize,
      sort.property,
      filters,
    );
  }

  /**
   * Load a modal asking confirmation to terminate current job
   */
  terminateJob(job) {
    this.$state.go('pci.projects.project.data-processing.terminate', {
      projectId: this.projectId,
      jobId: job.id,
      jobName: job.name,
    });
  }
}
