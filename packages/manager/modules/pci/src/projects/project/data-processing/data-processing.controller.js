import {
  isJobRunning,
  getClassFromStatus,
  datagridToIcebergFilter,
  getDataProcessingUiUrl,
} from './data-processing.utils';
import { DATA_PROCESSING_GUIDE_URL } from './data-processing.constants';

export default class {
  /* @ngInject */
  constructor(
    $state,
    CucCloudMessage,
    dataProcessingService,
    CucRegionService,
    atInternet,
  ) {
    this.$state = $state;
    this.cucCloudMessage = CucCloudMessage;
    this.dataProcessingService = dataProcessingService;
    this.cucRegionService = CucRegionService;
    this.atInternet = atInternet;
    this.isJobRunning = isJobRunning;
    this.getClassFromStatus = getClassFromStatus;
    this.guideUrl = DATA_PROCESSING_GUIDE_URL;
    this.getDataProcessingUiUrl = getDataProcessingUiUrl;
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
      const name = c.name || 'name';
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

  // eslint-disable-next-line class-methods-use-this
  formatDate(dt) {
    // this method needs to use current instance of moment, so it cannot static
    return moment(dt).format('MMMM Do YYYY, h:mm:ss a');
  }

  // eslint-disable-next-line class-methods-use-this
  formatDateFromNow(dt) {
    // this method needs to use current instance of moment, so it cannot static
    return moment(dt).fromNow();
  }

  onSubmitClick() {
    this.atInternet.trackClick({
      name: 'public-cloud::pci::projects::project::data-processing::add-job',
      type: 'action',
    });
    this.submitJob();
  }
}
