import datagridToIcebergFilter from '../detail/logs-iceberg.utils';

export default class LogsListCtrl {
  /* @ngInject */
  constructor(
    CucCloudMessage,
    LogsListService,
    LogsConstants,
    CucOrderHelperService,
  ) {
    this.CucCloudMessage = CucCloudMessage;
    this.LogsListService = LogsListService;
    this.LogsConstants = LogsConstants;
    this.CucOrderHelperService = CucOrderHelperService;
    this.messages = [];
  }

  $onInit() {
    this.CucCloudMessage.unSubscribe('dbaas-logs.list');
    this.messageHandler = this.CucCloudMessage.subscribe('dbaas-logs.list', {
      onMessage: () => this.refreshMessage(),
    });
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  loadServices({ offset, pageSize = 1, sort, criteria }) {
    const filters = criteria.map((c) => {
      const name = c.property || 'serviceName';
      return datagridToIcebergFilter(name, c.operator, c.value);
    });
    const pageOffset = Math.ceil(offset / pageSize);
    return this.LogsListService.getPaginatedServices(
      pageOffset,
      pageSize,
      { name: sort.property, dir: sort.dir === -1 ? 'DESC' : 'ASC' },
      filters,
    );
  }
}
