import {
  isNotebookRunning,
  getClassFromStatus,
  datagridToIcebergFilter,
  getDataProcessingUiUrl,
} from '../data-processing.utils';
import { DATA_PROCESSING_GUIDE_URL } from '../data-processing.constants';

import { getCriteria } from '../../project.utils';

export default class {
  /* @ngInject */
  constructor(
    $state,
    CucCloudMessage,
    dataProcessingService,
    ovhManagerRegionService,
    atInternet,
  ) {
    this.$state = $state;
    this.cucCloudMessage = CucCloudMessage;
    this.dataProcessingService = dataProcessingService;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.atInternet = atInternet;
    this.isNotebookRunning = isNotebookRunning;
    this.getClassFromStatus = getClassFromStatus;
    this.guideUrl = DATA_PROCESSING_GUIDE_URL;
    this.getDataProcessingUiUrl = getDataProcessingUiUrl;
  }

  $onInit() {
    this.subscribeToMessages();
    this.criteria = getCriteria('id', this.notebookId);
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  subscribeToMessages() {
    const channel = 'pci.projects.project.data-processing.notebooks';
    this.cucCloudMessage.unSubscribe(channel);
    this.messageHandler = this.cucCloudMessage.subscribe(channel, {
      onMessage: () => this.refreshMessage(),
    });
  }

  /**
   * Retrieve notebook list according to pagination
   * @param offset int element offset to retrieve results from
   * @param pageSize int Number of results to retrieve
   * @param sort Object Sort object from ovh-ui datagrid
   * @param criteria Object Criteria object from ovh-ui datagrid
   * @return {*|Promise<any>}
   */
  getNotebooks({ offset, pageSize, sort, criteria }) {
    const filters = criteria.map((c) => {
      const name = c.property || 'name';
      return datagridToIcebergFilter(name, c.operator, c.value);
    });
    const pageOffset = Math.ceil(offset / pageSize);
    return this.dataProcessingService.getNotebooks(
      this.projectId,
      pageOffset,
      pageSize,
      { name: sort.property, dir: sort.dir === -1 ? 'DESC' : 'ASC' },
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
    const endTime = moment(new Date());
    const duration = moment.duration(endTime.diff(moment(dt)));
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    return `${days}d ${hours}h ${minutes}mn`;
  }

  onSubmitClick() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::data-processing::add-notebook',
      type: 'action',
    });
    this.addNotebook();
  }
}
